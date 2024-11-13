from google.cloud import firestore
from datetime import datetime, timedelta
import pytz
from flask import jsonify

# Firestoreクライアントを初期化
db = firestore.Client()

def delete_inactive_users(request):
    # 現在のUTC時刻を取得
    current_time = datetime.now(pytz.UTC)

    # チャットルーム1から6までをループ
    for number in range(1, 7):
        # 該当するチャットルームのコレクションを指定
        collection_path = f'chatroom/{number}/activeUsers'
        active_users_ref = db.collection(collection_path)
        docs = active_users_ref.stream()

        for doc in docs:
            # `lastUpdated`フィールドを取得
            last_updated = doc.to_dict().get('lastUpdated')
            if last_updated and (current_time - last_updated).total_seconds() > 300:
                print(f'Deleting document {doc.id} in chatroom {number}')
                doc.reference.delete()

    return jsonify({"message": "Inactive users deleted successfully"}), 200