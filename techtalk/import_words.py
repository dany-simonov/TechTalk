import requests
from bs4 import BeautifulSoup
from database import Database

def import_words_from_site():
    rs = requests.get('http://www.7english.ru/dictionary.php?id=2000&letter=all')
    root = BeautifulSoup(rs.content, 'html.parser')
    
    en_ru_items = []
    for tr in root.select('tr[onmouseover]'):
        td_list = [td.text.strip() for td in tr.select('td')]
        if len(td_list) != 9 or not td_list[1] or not td_list[5]:
            continue
            
        en = td_list[1]
        ru = td_list[5].split(', ')[0]
        
        # Фильтруем слова с пробелами и специальными символами
        if ' ' in en or any(char in en for char in '.-,\'\"'):
            continue
            
        # Фильтруем слишком короткие и длинные слова
        if 3 <= len(en) <= 8:
            en_ru_items.append((en, ru))

    db = Database()
    db.add_words(en_ru_items)
    return len(en_ru_items)

if __name__ == '__main__':
    count = import_words_from_site()
    print(f'Импортировано {count} слов')
