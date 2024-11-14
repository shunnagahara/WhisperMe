import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './firebaseConfig';
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  QuerySnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import NameIcon from './NameIcon';
import Modal from './Modal'; // モーダルコンポーネントをインポート
import './ChatPage.css';
import './Modal.css';

type ChatLog = {
  key: string;
  name: string;
  msg: string;
  date: Date;
};

type User = {
  name: string;
  gender: string;
  ageRange: string;
  personalities: Record<number, string>;
  appearance: string;
  targetGender: string;
  favoriteAppearance: string;
  selectedPersonalities: Record<number, string>;
  favoriteAgeRange: string;
};

/**
 * ユーザー名 (localStrageに保存)
 * */
const fetchUser = (): User => {
  const user = JSON.parse(localStorage.getItem('lovyu-user'));
  return {
    name: user.name,
    gender: user.gender,
    ageRange: user.ageRange,
    personalities: user.personalities,
    appearance: user.appearance,
    targetGender: user.targetGender,
    favoriteAppearance: user.favoriteAppearance,
    selectedPersonalities: user.selectedPersonalities,
    favoriteAgeRange: user.favoriteAgeRange,
  };
};


/**
 * チャットコンポーネント(Line風)
 * ・localStorageに名前がなければ入力
 * ・自分の入力を右側、他の人は左側に表示
 */
const ChatPage: React.FC = () => {
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [isLoveConfessionModalOpen, setIsLoveConfessionModalOpen] = useState(false);
  const modalTimer = useRef<NodeJS.Timeout | null>(null);
  const countdownTimer = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);
  const user = useMemo(() => fetchUser(), []);

  // /chat/:room urlのパラメータ(チャットルーム名)
  const { room } = useParams<{ room: string }>();
  const roomRef = collection(db, 'chatroom', room, 'activeUsers');
  const userRef = doc(roomRef, user.name); 
  const messagesRef = useMemo(
    () => collection(db, 'chatroom', room, 'messages'),
    [room]
  );

  const closeWithoutSending = () => {
    setIsModalOpen(false);
    setCountdown(10);
  };

  /**
   * メッセージ送信
   */
  const submitMsg = async (argMsg?: string, modalOpenFlag: boolean = true) => {
    const message = argMsg || inputMsg;
    if (!message) {
      return;
    }

    if (message === "愛してます") {
      modalOpenFlag = false
    }

    await addDoc(messagesRef, {
      name: user.name,
      msg: message,
      date: new Date().getTime(),
      modalOpenFlag: modalOpenFlag,
    });

    // ユーザーのlastUpdatedフィールドを更新
    await updateDoc(userRef, { lastUpdated: serverTimestamp() });

    setInputMsg('');
  };



  useEffect(() => {
    if (isModalOpen) {
      countdownTimer.current = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      if (countdownTimer.current) clearInterval(countdownTimer.current);
    }

    return () => {
      if (countdownTimer.current) clearInterval(countdownTimer.current);
    };
  }, [isModalOpen]);  

  useEffect(() => {
    if (countdown === 0) {
      closeWithoutSending();
    }
  }, [countdown]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      deleteDoc(userRef);
      event.preventDefault();
    };
    // ルームに入った際にユーザー情報を追加
    setDoc(userRef, { ...user, lastUpdated: serverTimestamp() }, { merge: true });
    modalTimer.current = setInterval(() => setIsModalOpen(true), 300000); // 5分おき
    // beforeunloadイベントにリスナーを追加
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      if (modalTimer.current) clearInterval(modalTimer.current);
    };
  }, [user, userRef]);

  useEffect(() => {

    // モーダルが開かれたら `modalOpenFlag` を `true` に更新
    const handleOpenModal = async (messageId: string) => {
      setIsLoveConfessionModalOpen(true);
      
      // modalOpenFlag を true に更新
      const messageDoc = doc(messagesRef, messageId);
      await updateDoc(messageDoc, { modalOpenFlag: true });
    };

    const q = query(messagesRef, orderBy('date', 'desc'), limit(10));
    
    return onSnapshot(q, (snapshot: QuerySnapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          // 初回ロードを無視
          if (isInitialMount.current) {
            return;
          }

          if (change.doc.data().msg === "愛してます" && (user.name !== change.doc.data().name) && (change.doc.data().modalOpenFlag === false)) {
            // チャットメッセージが「愛してますよ」ならモーダルを開く
            handleOpenModal(change.doc.id);
          }

          // 初回以降にリアルタイムで追加されるメッセージのみを表示
          const log = {
            key: change.doc.id,
            ...change.doc.data()
          } as ChatLog;

          setChatLogs((prevLogs) => [...prevLogs, log]);
        }
      });

      // 初回ロード完了後にフラグをオフにする
      isInitialMount.current = false;
    });
  }, [messagesRef, user.name]);

  // モーダルを閉じるときにメッセージを送信する関数
  const handleCloseModal = () => {
    setIsModalOpen(false);
    submitMsg("愛してます", false); // チャットに「愛してます」を送信
    setCountdown(10);
  };

  // モーダルを閉じてメッセージを送信
  const handleLoveConfessionSend = () => {
    setIsLoveConfessionModalOpen(false);
    submitMsg("私も愛してます"); // チャットに「私も愛してます」を送信
  };

  return (
    <>
      {/* チャットログ */}
      <div className="chatroom-container">
        <div className="chatroom-logs-container">
          {chatLogs.map((item) => (
            <div
              className={`balloon_${user.name === item.name ? 'r' : 'l'}`}
              key={item.key}
            >
              {/* {userName === item.name ? `[${formatHHMM(item.date)}]` : ''} */}
              <div className="faceicon">
                <NameIcon
                  userName={item.name}
                  option={{ foreColor: user.name === item.name ? '#69C' : '#969' }}
                />
              </div>
              <div style={{ marginLeft: '3px' }}>
                {/* {item.name} */}
                <p className="says">{item.msg}</p>
              </div>
              {/* {userName === item.name ? '' : `[${formatHHMM(item.date)}]`} */}
            </div>
          ))}
        </div>

        {/* メッセージ入力 */}
        <div className="chatbox">
          <form
            className="chatform"
            onSubmit={async (e) => {
              e.preventDefault();
              await submitMsg();
            }}
          >
            <div>{user.name}</div>
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
            />
            <input
              type="image"
              onClick={() => submitMsg}
              src="../img/airplane.png"
              alt="Send Button"
            />
          </form>
        </div>

        {/* モーダルコンポーネント */}
        <Modal show={isModalOpen} handleClose={handleCloseModal} title="運命の出会い" message="同じ部屋にいる相手は運命の人かもしれません。" subMessage="思いを相手に伝えますか？" countdown={`${countdown}秒後にモーダルは自動的に閉じます。`}>
          <input className="modal-input" type="text" value="愛してます" readOnly />
          <button className="modal-submit-button" onClick={handleCloseModal}>送信</button>
        </Modal>

        <Modal show={isLoveConfessionModalOpen} handleClose={() => setIsLoveConfessionModalOpen(false)} title="愛の告白" message="相手から愛の告白がありました" subMessage="あなたも思いを伝えますか？" countdown=''>
          <input type="text" value="私も愛してます" readOnly className="modal-input" />
          <button onClick={handleLoveConfessionSend} className="modal-submit-button">送信</button>
        </Modal>
      </div>
    </>
  );
};

export default ChatPage;
