// src/utils/fetchFirstUserFromSnapshot.ts
import { QuerySnapshot, DocumentData } from "firebase/firestore";
import { User } from "../../constants/types/user"; // User型をインポート

/**
 * Firestoreのスナップショットから最初のユーザーデータを取得
 * @param snapshot FirestoreのQuerySnapshot
 * @returns 最初のUserオブジェクト、またはnull
 */
export const fetchActiveUserFromFirestore = async (
  snapshot: QuerySnapshot<DocumentData>
): Promise<User | null> => {
  if (snapshot.empty) {
    return null; // スナップショットが空の場合はnullを返す
  }

  const firstDoc = snapshot.docs[0]; // 最初のドキュメントを取得
  return firstDoc.data() as User; // ドキュメントのデータをUser型として返す
};