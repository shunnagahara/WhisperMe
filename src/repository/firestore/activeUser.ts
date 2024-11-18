import { collection, QuerySnapshot, setDoc, getDocs, updateDoc, deleteDoc, DocumentData, DocumentReference, serverTimestamp } from "firebase/firestore";
import { db } from './../../firebaseConfig';
import { User } from "../../constants/types/user";

/**
 * Firestoreからアクティブユーザーデータを取得
 * @param snapshot FirestoreのQuerySnapshot
 * @returns Userオブジェクト、またはnull
 */
export const fetchActiveUser = async (
  snapshot: QuerySnapshot<DocumentData>
): Promise<User | null> => {
  if (snapshot.empty) return null;
  const firstDoc = snapshot.docs[0];
  return firstDoc.data() as User;
};

/**
 * Firestoreからアクティブユーザー数を取得
 * @param snapshot FirestoreのQuerySnapshot
 * @param roomId ルームナンバー
 * @returns activeUserの数
 */
export const fetchActiveUserNumber = async (roomId:string) : Promise<number> => {
  const activeUsersSnapshot = await getDocs(collection(db, `chatroom/${roomId}/activeUsers`));
  if (activeUsersSnapshot.empty) return 0;
  return activeUsersSnapshot.size
};


/**
 * Firestoreのアクティブユーザーデータを保存
 * @param userRef Firestoreのユーザードキュメント参照
 * @param user 更新するユーザー情報
 */
export const setActiveUser = async (
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
    throw error;
  }
};

/**
 * Firestoreのアクディブユーザーデータの最終日時を更新
 * @param userRef Firestoreのユーザードキュメント参照
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
    throw error;
  }
};