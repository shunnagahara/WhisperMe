import { DocumentReference, deleteDoc, doc, updateDoc, addDoc, serverTimestamp, CollectionReference, onSnapshot, query, orderBy, limit, QuerySnapshot  } from "firebase/firestore";
import { ChatLog } from "../../constants/types/chatLog";
/**
 * BeforeUnloadイベントでFirestoreのユーザー情報を削除する
 * @param userRef Firestoreのユーザードキュメント参照
 * @returns イベントリスナーの関数
 */
export const handleBeforeUnload = (userRef: DocumentReference) => {
  return (event: BeforeUnloadEvent) => {
    deleteDoc(userRef).catch((error) => {
      console.error("Failed to delete user document:", error);
    });
    event.preventDefault();
  };
};

/**
 * カウントダウンタイマーのセットアップとクリーンアップ
 * @param isModalOpen モーダルの状態
 * @param countdownTimer タイマーを管理するRef
 * @param setCountdown カウントダウン値を更新する関数
 */
export const handleCountdown = (
  isModalOpen: boolean,
  countdownTimer: React.MutableRefObject<NodeJS.Timeout | null>,
  setCountdown: React.Dispatch<React.SetStateAction<number>>
) => {
  if (isModalOpen) {
    countdownTimer.current = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
  } else {
    if (countdownTimer.current) {
      clearInterval(countdownTimer.current);
    }
  }

  return () => {
    if (countdownTimer.current) {
      clearInterval(countdownTimer.current);
    }
  };
};

/**
 * モーダルを開き、`modalOpenFlag`を更新する関数
 * @param messagesRef Firestoreのメッセージコレクション参照
 * @param messageId 更新するメッセージのID
 * @param setIsLoveConfessionModalOpen モーダルの状態を更新する関数
 */
export const handleOpenModal = async (
  messagesRef: CollectionReference,
  messageId: string,
  setIsLoveConfessionModalOpen: React.Dispatch<React.SetStateAction<boolean>>
): Promise<void> => {
  try {
    // モーダルを開く
    setIsLoveConfessionModalOpen(true);

    // `modalOpenFlag` を `true` に更新
    const messageDoc = doc(messagesRef, messageId);
    await updateDoc(messageDoc, { modalOpenFlag: true });
  } catch (error) {
    console.error("Failed to open modal and update modalOpenFlag:", error);
  }
};

/**
 * チャットメッセージを取得し、更新処理を行う
 * @param messagesRef Firestoreのメッセージコレクション参照
 * @param setChatLogs チャットログの更新関数
 * @param setIsLoveConfessionModalOpen モーダルの状態を更新する関数
 * @param userName 現在のユーザー名
 * @param isInitialMount 初回マウントのフラグ
 */
export const fetchChatMessages = (
  messagesRef: CollectionReference,
  setChatLogs: React.Dispatch<React.SetStateAction<ChatLog[]>>,
  setIsLoveConfessionModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  userName: string,
  isInitialMount: React.MutableRefObject<boolean>
) => {
  const q = query(messagesRef, orderBy("date", "desc"), limit(10));

  return onSnapshot(q, (snapshot: QuerySnapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        if (isInitialMount.current) return;

        const data = change.doc.data();
        if (
          data.msg === "愛してます" &&
          userName !== data.name &&
          data.modalOpenFlag === false
        ) {
          // モーダルを開く処理を呼び出し
          handleOpenModal(messagesRef, change.doc.id, setIsLoveConfessionModalOpen);
        }

        // 初回以降にリアルタイムで追加されるメッセージのみを表示
        const log = {
          key: change.doc.id,
          ...data,
        } as ChatLog;

        setChatLogs((prevLogs) => [...prevLogs, log]);
      }
    });
    isInitialMount.current = false;
  });
};

/**
 * メッセージ送信処理
 * @param messagesRef Firestoreのメッセージコレクション参照
 * @param userRef Firestoreのユーザードキュメント参照
 * @param userName 送信者の名前
 * @param message メッセージ内容
 * @param modalOpenFlag モーダルオープンフラグ
 * @param resetInput 入力欄リセット用関数
 */
export const submitMsg = async (
  messagesRef: CollectionReference,
  userRef: DocumentReference,
  userName: string,
  modalOpenFlag: boolean,
  resetInput: () => void,
  message?: string,
  substituteMessage?: string
): Promise<void> => {

  const properMessage = (message)? message : substituteMessage

  await addDoc(messagesRef, {
    name: userName,
    msg: properMessage,
    date: new Date().getTime(),
    modalOpenFlag,
  });

  // ユーザーの`lastUpdated`フィールドを更新
  await updateDoc(userRef, { lastUpdated: serverTimestamp() });

  // 入力欄をリセット
  resetInput();
};