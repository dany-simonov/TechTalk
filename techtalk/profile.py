from flask import Blueprint, render_template, request, jsonify, session
from werkzeug.utils import secure_filename
import os

profile = Blueprint('profile', __name__)

@profile.route('/profile/<nickname>')
def user_profile(nickname):
    user = db.get_user_by_nickname(nickname)
    if not user:
        return redirect('/')
    inventory = db.get_user_inventory(user['id'])
    friends = db.get_user_friends(user['id'])
    return render_template('profile.html', user=user, inventory=inventory, friends=friends)

@profile.route('/upload-picture', methods=['POST'])
def upload_picture():
    if 'picture' not in request.files:
        return jsonify({'error': 'Нет файла'}), 400
    file = request.files['picture']
    if file.filename == '':
        return jsonify({'error': 'Файл не выбран'}), 400
    
    filename = secure_filename(file.filename)
    file.save(os.path.join('static/uploads', filename))
    db.update_profile_picture(session['user_id'], filename)
    return jsonify({'success': True})
