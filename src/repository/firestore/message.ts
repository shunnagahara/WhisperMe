import { addDoc, CollectionReference, DocumentReference, updateDoc } from "firebase/firestore";
import { ChatLog } from "../../constants/types/chatLog";

/**
 * Firestoreのメッセージドキュメントの`modalOpenFlag`を更新
 * @param messageRef Firestoreのメッセージドキュメント参照
 * @param modalOpenFlag 更新するモーダルオープンフラグの値
 */
export const updateMessageModalFlag = async (
  messageRef: DocumentReference,
  modalOpenFlag: boolean
): Promise<void> => {
  try {
    await updateDoc(messageRef, { modalOpenFlag });
  } catch (error) {
    console.error("Failed to update modalOpenFlag:", error);
    throw error;
  }
};

/**
 * Firestoreに新しいメッセージを追加
 * @param messagesRef Firestoreのメッセージコレクション参照
 * @param messageData 追加するメッセージデータ
 */
export const addMessage = async (
  messagesRef: CollectionReference,
  messageData: ChatLog
): Promise<void> => {
  try {
    await addDoc(messagesRef, messageData);
  } catch (error) {
    console.error("Failed to add message:", error);
    throw error;
  }
};