// **外部ライブラリ**
import {
  CollectionReference,
  DocumentReference,
  QuerySnapshot,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { ChatLog } from "../../constants/types/chatLog";
import { deleteActiveUser, updateLastUpdated } from "../../repository/firestore/activeUser";
import { addMessage, updateMessageModalFlag } from "../../repository/firestore/message";
import { CONFESSION_MESSAGE, FIVE_MINUTES, ONE_SECOND } from "../../constants/common";
import { fetchActiveUserNumber } from "../../repository/firestore/activeUser";


/**
 * Firestoreのユーザー情報を削除するハンドル関数
 * @param userRef Firestoreのユーザードキュメント参照
 * @returns イベントリスナーの関数
 */
export const handleRemoveActiveUser = (userRef: DocumentReference) => {
  return (event: BeforeUnloadEvent) => {
    deleteActiveUser(userRef).catch((error) => {
      console.error("Error occurred during beforeunload:", error);
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
    }, ONE_SECOND);
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
    setIsLoveConfessionModalOpen(true);
    const messageDoc = doc(messagesRef, messageId);
    await updateMessageModalFlag(messageDoc, true);
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
  setIsReplyModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  userName: string,
  isInitialMount: React.MutableRefObject<boolean>
) => {
  const q = query(messagesRef, orderBy("date", "desc"), limit(10));
  return onSnapshot(q, (snapshot: QuerySnapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        if (isInitialMount.current) return;
        const data = change.doc.data() as ChatLog;
        if (isLoveConfessionMessage(data, userName)) {
          handleOpenModal(messagesRef, change.doc.id, setIsReplyModalOpen);
        }

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
  substituteMessage?: string,
  announceFlag?: boolean
): Promise<void> => {
  const properMessage = (message)? message : substituteMessage
  await addMessage(messagesRef, {
    name: userName,
    msg: properMessage,
    date: new Date().getTime(),
    modalOpenFlag,
    announceFlag,
  });
  await updateLastUpdated(userRef)
  resetInput();
};

/**
 * メッセージが特定条件を満たすかどうかを判定する
 * @param messageData メッセージのデータ
 * @param currentUserName 現在のユーザー名
 * @returns 条件を満たす場合は`true`、それ以外は`false`
 */
export const isLoveConfessionMessage = (
  messageData: ChatLog,
  currentUserName: string
): boolean => {
  return (
    messageData.msg === CONFESSION_MESSAGE &&
    messageData.name !== currentUserName &&
    messageData.modalOpenFlag === true
  );
};

/**
 * 告白モーダルを一定時間ごとに開くタイマーを設定
 * @param setIsConfessionModalOpen 告白モーダルを開く状態を更新する関数
 * @param intervalRef タイマーIDを保持するRef
 * @param intervalTime タイマーの間隔（ミリ秒単位、デフォルト: 30000ミリ秒）
 */
export const startConfessionModalTimer = (
  setIsConfessionModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  intervalRef: React.MutableRefObject<NodeJS.Timeout | null>,
  roomId: string
) => {
  intervalRef.current = setInterval(async () => {
    const activeUserNumber = await fetchActiveUserNumber(roomId);
    if(activeUserNumber === 2) setIsConfessionModalOpen(true);
  }, FIVE_MINUTES);
};

/**
 * 告白モーダルタイマーをクリア
 * @param intervalRef タイマーIDを保持するRef
 */
export const clearConfessionModalTimer = (intervalRef: React.MutableRefObject<NodeJS.Timeout | null>) => {
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }
};

/**
 * ユーザーが既に入室済の場合、アナウンス用メッセージを保存する
 * @param messagesRef Firestoreのメッセージコレクション参照
 * @param roomId ルームナンバー
 * @param name ユーザー名
 */
export const saveAnnounceMessageForEntering = async (
  messagesRef: CollectionReference,
  roomId: string,
  name: string
) => {
  const activeUserNumber = await fetchActiveUserNumber(roomId);
  if (activeUserNumber === 1) return
  await addMessage(messagesRef, {
    name: name,
    msg: 'あなたの運命の人が入室しました。',
    date: new Date().getTime(),
    modalOpenFlag: false,
    announceFlag: true,
  });
};