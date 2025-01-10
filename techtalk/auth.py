from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
import re

auth = Blueprint('auth', __name__)

@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    nickname = data.get('nickname')

    if not re.match(r'^[a-zA-Z0-9_]{3,20}$', username):
        return jsonify({'error': 'Некорректный формат логина'}), 400

    if not re.match(r'^@[a-zA-Z0-9_]{1,15}$', nickname):
        return jsonify({'error': 'Некорректный формат никнейма'}), 400

    if len(password) < 8:
        return jsonify({'error': 'Пароль слишком короткий'}), 400

    hashed_password = generate_password_hash(password)
    if db.create_user(username, hashed_password, nickname):
        return jsonify({'message': 'Регистрация успешна'}), 201
    return jsonify({'error': 'Пользователь уже существует'}), 400
