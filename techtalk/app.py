from flask import Flask, render_template, request, jsonify, session, redirect
from database import Database
from config import Config
from import_words import import_words_from_site

app = Flask(__name__)
app.config.from_object(Config)
app.config['SECRET_KEY'] = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'

db = Database()
import_words_from_site()

@app.route('/')
def index():
    streak = session.get('streak', 0)
    crystals = session.get('crystals', 0)
    current_user = {
        'nickname': session.get('nickname', 'guest'),
        'id': session.get('user_id', None)
    }
    return render_template('index.html', 
                         streak=streak, 
                         crystals=crystals,
                         current_user=current_user)

@app.route('/profile/<nickname>')
def profile(nickname):
    user = db.get_user_by_nickname(nickname)
    current_user = {
        'nickname': session.get('nickname', 'guest'),
        'id': session.get('user_id', None),
        'username': session.get('username', 'guest')
    }
    
    # Добавляем данные для отображения в профиле
    streak = session.get('streak', 0)
    crystals = session.get('crystals', 0)
    friends_count = 0  # Позже добавим подсчет из базы данных
    
    if nickname == 'guest':
        return render_template('profile.html',
                             user=current_user,
                             streak=streak,
                             crystals=crystals,
                             friends_count=friends_count,
                             current_user=current_user)
    
    if not user:
        return redirect('/')
        
    return render_template('profile.html',
                         user=user,
                         streak=streak,
                         crystals=crystals,
                         friends_count=friends_count,
                         current_user=current_user)


@app.route('/inventory')
def inventory():
    current_user = {
        'nickname': session.get('nickname', 'guest'),
        'id': session.get('user_id', None)
    }
    if current_user['nickname'] == 'guest':
        return render_template('inventory.html', items=[], current_user=current_user)
    items = db.get_user_inventory(current_user['id'])
    return render_template('inventory.html', items=items, current_user=current_user)


@app.route('/store')
def store():
    current_user = {
        'nickname': session.get('nickname', 'guest'),
        'id': session.get('user_id', None)
    }
    return render_template('store.html', current_user=current_user)

@app.route('/game')
def game():
    lang = request.args.get('lang', 'ru')
    return render_template(f'pregame_{lang}.html', current_user={'nickname': 'Player'})

@app.route('/start_game')
def start_game():
    lang = request.args.get('lang', 'ru')
    length = request.args.get('length', 5, type=int)
    theme = request.args.get('theme', 'none')
    
    word = db.get_random_word(lang, length, theme)
    if not word:
        return redirect('/')
        
    session['game_word'] = word[0].upper()
    session['game_lang'] = lang
    
    if lang == 'ru':
        return render_template('game_ru.html', current_user={'nickname': 'Player'})
    else:
        return render_template('game_en.html', current_user={'nickname': 'Player'})



@app.route('/get_word')
def get_word():
    length = request.args.get('length', 5, type=int)
    lang = request.args.get('lang', 'ru')
    word = db.get_random_word(lang, length)
    
    if word:
        session['game_word'] = word[0].upper()
        return jsonify({'word': word[0].upper()})
    return jsonify({'error': 'Word not found'})

@app.route('/check', methods=['POST'])
def check_word():
    guess = request.json.get('guess', '').upper()
    word = session.get('word', '')
    
    if not word or len(guess) != len(word):
        return jsonify({'error': 'Invalid word length'})
    
    result = []
    for i, letter in enumerate(guess):
        if letter == word[i]:
            result.append('correct')
        elif letter in word:
            result.append('present')
        else:
            result.append('absent')
            
    session['attempts'] = session.get('attempts', 0) + 1
    
    return jsonify({
        'result': result,
        'finished': guess == word or session['attempts'] >= app.config['MAX_ATTEMPTS'],
        'word': word if guess == word or session['attempts'] >= app.config['MAX_ATTEMPTS'] else None
    })

@app.route('/new-game', methods=['POST'])
def new_game():
    lang = session.get('language', 'en')
    word_pair = db.get_random_word(lang, app.config['GAME_WORD_LENGTH'])
    if not word_pair:
        return jsonify({'error': 'No words available'})
    
    session['word'] = word_pair[0].upper()
    session['attempts'] = 0
    
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True)
