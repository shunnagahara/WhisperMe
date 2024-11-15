import { DocumentReference, deleteDoc } from "firebase/firestore";

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