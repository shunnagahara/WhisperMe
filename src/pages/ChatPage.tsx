import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './../firebaseConfig';
import { doc, setDoc, collection, serverTimestamp, } from 'firebase/firestore';
import NameIcon from './../components/NameIcon';
import Modal from './../components/Modal';
import { ChatLog } from './../constants/types/chatLog';
import { fetchUserFromWebStorage } from './../repository/webstorage/user'
import { handleBeforeUnload, handleCountdown, fetchChatMessages, submitMsg } from '../service/model/chatPageService';
import './../css/ChatPage.css';
import './../css/Modal.css';


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
  const user = useMemo(() => fetchUserFromWebStorage(), []);

  // /chat/:room urlのパラメータ(チャットルーム名)
  const { room } = useParams<{ room: string }>();
  const roomRef = collection(db, 'chatroom', room, 'activeUsers');
  const userRef = doc(roomRef, user.name); 
  const messagesRef = useMemo(
    () => collection(db, 'chatroom', room, 'messages'),
    [room]
  );

  useEffect(() => {
    setDoc(userRef, { ...user, lastUpdated: serverTimestamp() }, { merge: true });
    const unloadListener = handleBeforeUnload(userRef);
    window.addEventListener("beforeunload", unloadListener);
    modalTimer.current = setInterval(() => setIsModalOpen(true), 30000); // 5分おき
    return () => {
      if (modalTimer.current) clearInterval(modalTimer.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    const cleanup = handleCountdown(isModalOpen, countdownTimer, setCountdown);
    return cleanup; // クリーンアップ関数を実行
  }, [isModalOpen]);  

  useEffect(() => {
    if (countdown === 0) {
      closeWithoutSending();
    }
  }, [countdown]);

  useEffect(() => {
    const unsubscribe = fetchChatMessages(
      messagesRef,
      setChatLogs,
      setIsLoveConfessionModalOpen,
      user.name,
      isInitialMount
    );

    return () => unsubscribe(); // クリーンアップ
  }, [messagesRef, user.name]);

  const handleSend = async (inputMessage: string, substituteMessage?:string) => {
    const modalOpenFlag = inputMsg !== "愛してます";
    await submitMsg(messagesRef, userRef, user.name, modalOpenFlag, () => setInputMsg(""), inputMessage, substituteMessage);
  };

  // モーダルを閉じるときにメッセージを送信する関数
  const handleCloseModal = () => {
    setIsModalOpen(false);
    handleSend("", "愛してます");
    setCountdown(10);
  };

  // モーダルを閉じてメッセージを送信
  const handleLoveConfessionSend = () => {
    setIsLoveConfessionModalOpen(false);
    handleSend("", "私も愛してます");
  };

  const closeWithoutSending = () => {
    setIsModalOpen(false);
    setCountdown(10);
  };

  return (
    <>
      <div className="chatroom-container">
        <div className="chatroom-logs-container">
          {chatLogs.map((item) => (
            <div
              className={`balloon_${user.name === item.name ? 'r' : 'l'}`}
              key={item.key}
            >
              <div className="faceicon">
                <NameIcon
                  userName={item.name}
                  option={{ foreColor: user.name === item.name ? '#69C' : '#969' }}
                />
              </div>
              <div style={{ marginLeft: '3px' }}>
                <p className="says">{item.msg}</p>
              </div>
            </div>
          ))}
        </div>

        {/* メッセージ入力 */}
        <div className="chatbox">
          <form
            className="chatform"
            onSubmit={async (e) => {
              e.preventDefault();
              await handleSend(inputMsg);
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
