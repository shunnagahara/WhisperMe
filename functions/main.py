from google.cloud import firestore
from datetime import datetime, timedelta
import pytz
from flask import jsonify

# Firestoreクライアントを初期化
db = firestore.Client()

# 定数を定義
INACTIVITY_THRESHOLD_SECONDS = 300  # 非アクティブとみなす閾値（秒単位）

def get_max_chat_rooms():
    """
    Firestoreから最大チャットルーム数を取得する。

    Returns:
        int: 最大チャットルーム数
    """
    try:
        config_ref = db.collection('config').document('chatSettings')
        config_doc = config_ref.get()
        if config_doc.exists:
            max_rooms = config_doc.to_dict().get('maxRooms', 0)
            if isinstance(max_rooms, int) and max_rooms > 0:
                return max_rooms
        print("Firestoreに有効な最大チャットルーム設定がありません。デフォルト値を使用します。")
        return 8  # デフォルト値
    except Exception as e:
        print(f"Firestoreから最大チャットルーム数を取得できませんでした: {e}")
        return 8  # デフォルト値

def delete_inactive_users(request):
    """
    非アクティブなユーザーをチャットルームから削除する。

    この関数は、チャットルーム（1から最大数まで）をループし、
    各チャットルームの 'activeUsers' コレクション内のドキュメントを確認します。
    `lastUpdated` フィールドが非アクティブとみなされる閾値
    （INACTIVITY_THRESHOLD_SECONDS）を超えている場合、そのユーザーを削除します。
    また、チャットルーム内のアクティブユーザー数が1以下の場合は処理をスキップします。

    引数:
        request (flask.Request): HTTPリクエストオブジェクト。通常はFlaskルートハンドラから提供されます。
        現在、この関数では使用されていません。

    戻り値:
        flask.Response: 処理の成功を示すJSONレスポンス。
    """
    # 現在のUTC時刻を取得
    current_time = datetime.now(pytz.UTC)

    # 最大チャットルーム数をFirestoreから取得
    max_chat_rooms = get_max_chat_rooms()

    # 各チャットルームをループ
    for number in range(1, max_chat_rooms + 1):
        # 該当するチャットルームのコレクションを指定
        collection_path = f'chatroom/{number}/activeUsers'
        active_users_ref = db.collection(collection_path)
        docs = list(active_users_ref.stream())  # すべてのドキュメントをリスト化

        # アクティブユーザーの数をチェック
        if len(docs) <= 1:
            print(f"チャットルーム {number} をスキップ: アクティブユーザーが不足しています")
            continue  # 次のチャットルームへ

        # 各ドキュメントをチェックして、非アクティブユーザーを削除
        for doc in docs:
            # `lastUpdated`フィールドを取得
            last_updated = doc.to_dict().get('lastUpdated')
            if last_updated and (current_time - last_updated).total_seconds() > INACTIVITY_THRESHOLD_SECONDS:
                print(f"チャットルーム {number} のドキュメント {doc.id} を削除中")
                doc.reference.delete()

    return jsonify({"message": "非アクティブなユーザーを正常に処理しました"}), 200
