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
  QuerySnapshot,
  query,
  orderBy,
  limit,
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

/**
 * ユーザー名 (localStrageに保存)
 * */
const getUName = (): string => {
  const userName = localStorage.getItem('whisper-me-username');
  if (!userName) {
    const inputName = window.prompt('ユーザー名を入力してください', '');
    if (inputName) {
      localStorage.setItem('whisper-me-username', inputName);

      return inputName;
    }
  }

  return userName;
};

/**
 * UNIX TIME => hh:mm
 * */
const formatHHMM = (time: Date) => {
  return new Date(time).toTimeString().slice(0, 5);
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
  const userName = useMemo(() => getUName(), []);

  // /chat/:room urlのパラメータ(チャットルーム名)
  const { room } = useParams<{ room: string }>();
  const roomRef = collection(db, 'chatroom', room, 'activeUsers');
  const userRef = doc(roomRef, userName); 
  const messagesRef = useMemo(
    () => collection(db, 'chatroom', room, 'messages'),
    [room]
  );

  const closeWithoutSending = () => {
    setIsModalOpen(false);
    setCountdown(10);
  };

  /**
   * チャットログに追加
   */
  const addLog = (id: string, data: any) => {
    const log = {
      key: id,
      ...data,
    };
    // Firestoreから取得したデータは時間降順のため、表示前に昇順に並び替える
    setChatLogs((prev) =>
      [...prev, log].sort((a, b) => a.date.valueOf() - b.date.valueOf())
    );
  };

  /**
   * メッセージ送信
   */
  const submitMsg = async (argMsg?: string) => {
    const message = argMsg || inputMsg;
    if (!message) {
      return;
    }

    await addDoc(messagesRef, {
      name: userName,
      msg: message,
      date: new Date().getTime(),
    });

    setInputMsg('');
  };

  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    deleteDoc(userRef);
    event.preventDefault();
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
    modalTimer.current = setInterval(() => setIsModalOpen(true), 300000); // 5分おき

    return () => {
      if (modalTimer.current) clearInterval(modalTimer.current);
    };
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      // ルームに入った際にユーザー情報を追加
      setDoc(userRef, { name: userName }, { merge: true });
      setInterval(() => { setIsModalOpen(true); }, 60000); // 60000 ms = 60 seconds
      isInitialMount.current = false;
      // 最新10件をとるためdateでソート
      const q = query(messagesRef, orderBy('date', 'desc'), limit(10));
      onSnapshot(q, (snapshot: QuerySnapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            // チャットログへ追加
            addLog(change.doc.id, change.doc.data());
            if (change.doc.data().msg === "愛してますよ") {
              // チャットメッセージが「愛してますよ」ならモーダルを開く
              setIsLoveConfessionModalOpen(true);
            }
            // 画面最下部へスクロール
            const doc = document.documentElement;
            window.setTimeout(
              () => window.scroll(0, doc.scrollHeight - doc.clientHeight),
              100
            );
          }
        });
      });
      return
    }
    // beforeunloadイベントにリスナーを追加
    window.addEventListener('beforeunload', handleBeforeUnload);
    return

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName, userRef]);

  // モーダルを閉じるときにメッセージを送信する関数
  const handleCloseModal = () => {
    setIsModalOpen(false);
    submitMsg("愛してます"); // チャットに「愛してます」を送信
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
              className={`balloon_${userName === item.name ? 'r' : 'l'}`}
              key={item.key}
            >
              {/* {userName === item.name ? `[${formatHHMM(item.date)}]` : ''} */}
              <div className="faceicon">
                <NameIcon
                  userName={item.name}
                  option={{ foreColor: userName === item.name ? '#69C' : '#969' }}
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
            <div>{userName}</div>
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
