from flask import Flask, render_template, request, jsonify, session, redirect
from database import Database
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
db = Database()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/game/<lang>')
def game(lang):
    if lang not in app.config['LANGUAGES']:
        return redirect('/')
    session['language'] = lang
    session['attempts'] = 0
    word_pair = db.get_random_word(lang, app.config['GAME_WORD_LENGTH'])
    if not word_pair:
        return redirect('/')
    session['word'] = word_pair[0].upper()
    return render_template('game.html')

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