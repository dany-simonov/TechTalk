from flask import Flask, render_template, request, jsonify, session, redirect
from database import Database
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
app.config['SECRET_KEY'] = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
db = Database()

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
        'id': session.get('user_id', None)
    }
    if nickname == 'guest':
        return render_template('profile.html', 
                             user={'nickname': 'guest', 'balance': 0}, 
                             inventory=[], 
                             current_user=current_user)
    if not user:
        return redirect('/')
    inventory = db.get_user_inventory(user['id'])
    return render_template('profile.html', user=user, inventory=inventory, current_user=current_user)

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
    if lang not in app.config['LANGUAGES']:
        return redirect('/')
    
    session['language'] = lang
    session['attempts'] = 0
    word_pair = db.get_random_word(lang, app.config['GAME_WORD_LENGTH'])
    
    if not word_pair:
        return redirect('/')
        
    session['word'] = word_pair[0].upper()
    current_user = {
        'nickname': session.get('nickname', 'guest'),
        'id': session.get('user_id', None)
    }
    return render_template('game.html', lang=lang, current_user=current_user)

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
