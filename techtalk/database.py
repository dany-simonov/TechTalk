import sqlite3
from typing import List, Tuple

class Database:
    def __init__(self, db_name: str = 'techtalk.db'):
        self.db_name = db_name
        self.create_tables()

    def create_tables(self):
        with sqlite3.connect(self.db_name) as conn:
            cursor = conn.cursor()
            
            # Существующая таблица слов
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS words (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    word_en TEXT NOT NULL,
                    word_ru TEXT NOT NULL,
                    length INTEGER NOT NULL
                )
            ''')
            
            # Новая таблица пользователей
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    nickname TEXT UNIQUE NOT NULL,
                    profile_picture TEXT,
                    balance INTEGER DEFAULT 0
                )
            ''')

            # Новая таблица предметов
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS items (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    description TEXT,
                    price INTEGER NOT NULL,
                    icon TEXT,
                    type TEXT NOT NULL
                )
            ''')

            # Новая таблица инвентаря
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS user_items (
                    user_id INTEGER NOT NULL,
                    item_id INTEGER NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users(id),
                    FOREIGN KEY (item_id) REFERENCES items(id)
                )
            ''')

            # Новая таблица друзей
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS friends (
                    user_id INTEGER NOT NULL,
                    friend_id INTEGER NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users(id),
                    FOREIGN KEY (friend_id) REFERENCES users(id)
                )
            ''')
            
            conn.commit()

    # Существующие методы для работы со словами
    def add_words(self, words: List[Tuple[str, str]]):
        with sqlite3.connect(self.db_name) as conn:
            cursor = conn.cursor()
            for en, ru in words:
                cursor.execute(
                    'INSERT INTO words (word_en, word_ru, length) VALUES (?, ?, ?)',
                    (en.lower(), ru.lower(), len(en))
                )
            conn.commit()

    def get_random_word(self, language: str, length: int = None) -> Tuple[str, str]:
        with sqlite3.connect(self.db_name) as conn:
            cursor = conn.cursor()
            query = 'SELECT word_en, word_ru FROM words'
            params = []
            
            if length:
                query += ' WHERE length = ?'
                params.append(length)
                
            query += ' ORDER BY RANDOM() LIMIT 1'
            
            cursor.execute(query, params)
            result = cursor.fetchone()
            
            if not result:
                return None
                
            return result if language == 'en' else (result[1], result[0])

    # Новые методы для работы с пользователями
    def create_user(self, username: str, password: str, nickname: str) -> bool:
        try:
            with sqlite3.connect(self.db_name) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    'INSERT INTO users (username, password, nickname) VALUES (?, ?, ?)',
                    (username, password, nickname)
                )
                conn.commit()
                return True
        except sqlite3.IntegrityError:
            return False

    def get_user(self, username: str) -> dict:
        with sqlite3.connect(self.db_name) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
            result = cursor.fetchone()
            if result:
                return {
                    'id': result[0],
                    'username': result[1],
                    'nickname': result[3],
                    'profile_picture': result[4],
                    'balance': result[5]
                }
            return None

    # Новые методы для работы с предметами и инвентарем
    def add_item_to_inventory(self, user_id: int, item_id: int) -> bool:
        try:
            with sqlite3.connect(self.db_name) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    'INSERT INTO user_items (user_id, item_id) VALUES (?, ?)',
                    (user_id, item_id)
                )
                conn.commit()
                return True
        except sqlite3.IntegrityError:
            return False

    def get_user_inventory(self, user_id: int) -> List[dict]:
        with sqlite3.connect(self.db_name) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT i.* FROM items i
                JOIN user_items ui ON i.id = ui.item_id
                WHERE ui.user_id = ?
            ''', (user_id,))
            return [
                {
                    'id': row[0],
                    'name': row[1],
                    'description': row[2],
                    'icon': row[4],
                    'type': row[5]
                }
                for row in cursor.fetchall()
            ]
    def get_user_by_nickname(self, nickname):
        with sqlite3.connect(self.db_name) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM users WHERE nickname = ?', (nickname,))
            user = cursor.fetchone()
            if user:
                return {
                    'id': user[0],
                    'nickname': user[3],  # индекс 3 для nickname в нашей схеме
                    'balance': user[5]    # индекс 5 для balance в нашей схеме
                }
            return None

    
if __name__ == '__main__':
    db = Database()
