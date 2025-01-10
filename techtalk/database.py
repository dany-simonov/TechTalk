import sqlite3
from typing import List, Tuple

class Database:
    def __init__(self, db_name: str = 'techtalk.db'):
        self.db_name = db_name
        self.create_tables()

    def create_tables(self):
        with sqlite3.connect(self.db_name) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS words (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    word_en TEXT NOT NULL,
                    word_ru TEXT NOT NULL,
                    length INTEGER NOT NULL
                )
            ''')
            conn.commit()

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

# Тестирование базы данных
if __name__ == '__main__':
    db = Database()
    
    # Сначала запустим import_words.py для наполнения базы
    print("Тестируем получение случайных слов:")
    print("Английское слово:", db.get_random_word('en'))
    print("Русское слово:", db.get_random_word('ru'))
    print("\nТестируем получение слов определенной длины:")
    print("Слово длиной 5 букв:", db.get_random_word('en', 5))
