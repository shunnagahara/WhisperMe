// src/utils/fetchFirstUserFromSnapshot.ts
import { QuerySnapshot, setDoc, updateDoc, deleteDoc, DocumentData, DocumentReference, serverTimestamp } from "firebase/firestore";
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


/**
 * Firestoreのユーザーデータを更新
 * @param userRef Firestoreのユーザードキュメント参照
 * @param user 更新するユーザー情報
 */
export const updateUserLastUpdated = async (
  userRef: DocumentReference,
  user: User
): Promise<void> => {
  try {
    await setDoc(
      userRef,
      { ...user, lastUpdated: serverTimestamp() },
      { merge: true }
    );
  } catch (error) {
    console.error("Failed to update user document:", error);
    throw error; // 必要に応じてエラーを再スロー
  }
};

/**
 * Firestoreのユーザーデータを更新
 * @param userRef Firestoreのユーザードキュメント参照
 * @param user 更新するユーザー情報
 */
export const updateLastUpdated = async (
  userRef: DocumentReference,
): Promise<void> => {
  try {
    await updateDoc(
      userRef,
      {lastUpdated: serverTimestamp() }
    );
  } catch (error) {
    console.error("Failed to LastUpdated document:", error);
    throw error;
  }
};

/**
 * ユーザードキュメントを削除
 * @param userRef Firestoreのユーザードキュメント参照
 */
export const deleteActiveUser = async (userRef: DocumentReference): Promise<void> => {
  try {
    await deleteDoc(userRef);
  } catch (error) {
    console.error("Failed to delete user document:", error);
    throw error; // 必要に応じてエラーを再スロー
  }
};