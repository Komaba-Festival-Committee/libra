import os
import sys
from pymongo import MongoClient

year = sys.argv[1]

# MongoDBのクライアント設定
client = MongoClient('mongodb://localhost:27018/')
db = client['libra']
collection = db['text_files']

# フォルダのパス
folder_path = os.path.join(os.path.dirname(__file__), 'STATIC/KF' + year)


def read_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except UnicodeDecodeError:
        try:
            with open(file_path, 'r', encoding='shift_jis') as f:
                return f.read()
        except UnicodeDecodeError:
            with open(file_path, 'r', encoding='iso-8859-1') as f:
                return f.read()


def store_files_in_mongo(root_folder_path, parent_id=None):
    for entry in os.scandir(root_folder_path):
        if entry.is_file() and os.path.splitext(entry.name)[1] == '.txt':
            content = read_file(entry)
            # データベースに保存
            file_data = {
                'year': year,
                'name': entry.name,
                'path': os.path.relpath(entry, root_folder_path),
                'type': 'file',
                'content': content,
                'parent_id': parent_id,
            }
            result = collection.insert_one(file_data)

            # 新しいフォルダのIDを設定
            new_parent_id = result.inserted_id

        elif entry.is_dir():
            # データベースにフォルダを登録し、新しいIDを取得
            folder_data = {
                'year': year,
                'name': entry.name,
                'path': os.path.relpath(entry, root_folder_path),
                'type': 'folder',
                'parent_id': parent_id
            }
            result = collection.insert_one(folder_data)
            new_parent_id = result.inserted_id

            # サブフォルダに対して再帰的に処理
            store_files_in_mongo(entry, new_parent_id)


store_files_in_mongo(folder_path)
