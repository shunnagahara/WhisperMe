# 開発用コマンドまとめ

npm start

npm run deploy

firebase deploy --only firestore:rules --token "$FIREBASE_TOKEN”

firebase deploy --only firestore:rules --dry-run

gcloud functions deploy delete_inactive_users \
--runtime python39 \
--trigger-http \
--allow-unauthenticated \
--region asia-northeast1