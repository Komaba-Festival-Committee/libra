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
    for root, dirs, files in os.walk(root_folder_path):
        for file in files:
            if file.endswith('.txt'):
                file_path = os.path.join(root, file)
                content = read_file(file_path)

                # データベースに保存
                file_data = {
                    'year': year,
                    'name': file,
                    'path': os.path.relpath(file_path, root_folder_path),
                    'type': 'file',
                    'content': content,
                    'parent_id': parent_id,
                }
                result = collection.insert_one(file_data)

                # 新しいフォルダのIDを設定
                new_parent_id = result.inserted_id

        for dir in dirs:
            sub_folder_path = os.path.join(root, dir)
            # データベースにフォルダを登録し、新しいIDを取得
            folder_data = {
                'year': year,
                'name': dir,
                'path': os.path.relpath(sub_folder_path, root_folder_path),
                'type': 'folder',
                'parent_id': parent_id
            }
            result = collection.insert_one(folder_data)
            new_parent_id = result.inserted_id

            # サブフォルダに対して再帰的に処理
            store_files_in_mongo(sub_folder_path, new_parent_id)


store_files_in_mongo(folder_path)
