import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { doc, collection } from 'firebase/firestore';
import { db } from './../firebaseConfig';
import { fetchProfile } from './../repository/webstorage/user';
import { setActiveUser } from '../repository/firestore/activeUser';
import {
  handleRemoveActiveUser,
  handleCountdown,
  fetchChatMessages,
  submitMsg,
  startConfessionModalTimer,
  clearConfessionModalTimer,
  saveAnnounceMessageForEntering,
} from '../service/model/chatRoomService';
import { ChatLog } from './../constants/types/chatLog';
import { CONFESSION_MESSAGE, CONFESSION_REPLY_MESSAGE, TEN_SECONDS } from '../constants/common';
import Modal from './../components/Modal';
import Balloon from './../components/Balloon';
import Announcement from './../components/Announcement';
import ChatInputBox from './../components/ChatInputBox';
import './../css/chatRoom.css';
import './../css/modal.css';


const ChatRoom: React.FC = () => {
  const [chatLogs, setChatLogs]                           = useState<ChatLog[]>([]);
  const [inputMsg, setInputMsg]                           = useState('');
  const [countdown, setCountdown]                         = useState(TEN_SECONDS);
  const isInitialMount                                    = useRef(true);
  const hasRun                                            = useRef(false);
  const [isConfessionModalOpen, setIsConfessionModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen]           = useState(false);
  const modalTimer     = useRef<NodeJS.Timeout | null>(null);
  const countdownTimer = useRef<NodeJS.Timeout | null>(null);
  const user        = useMemo(() => fetchProfile(), []);
  const { room }    = useParams<{ room: string }>();
  const roomRef     = collection(db, 'chatroom', room, 'activeUsers');
  const userRef     = doc(roomRef, user.name); 
  const messagesRef = useMemo(() => collection(db, 'chatroom', room, 'messages'),[room]);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    const execActiveUser = async () => {await setActiveUser(userRef, user);};
    execActiveUser();
    const execSaveAnnounceMessageForEntering = async () => {await saveAnnounceMessageForEntering(messagesRef, room, user.name);};
    execSaveAnnounceMessageForEntering();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleRemoveUserListener = handleRemoveActiveUser(userRef);
    window.addEventListener("popstate", handleRemoveUserListener);
    window.addEventListener("beforeunload", handleRemoveUserListener);
    return () => {
      window.addEventListener("popstate", handleRemoveUserListener);
      window.addEventListener("beforeunload", handleRemoveUserListener);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    startConfessionModalTimer(setIsConfessionModalOpen, modalTimer, room);
    return () => {
      clearConfessionModalTimer(modalTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const cleanup = handleCountdown(isConfessionModalOpen, countdownTimer, setCountdown);
    return cleanup;
  }, [isConfessionModalOpen]);

  useEffect(() => {
    if (countdown === 0) closeWithoutSending();
  }, [countdown]);

  useEffect(() => {
    const unsubscribe = fetchChatMessages(
      messagesRef,
      setChatLogs,
      setIsReplyModalOpen,
      user.name,
      isInitialMount
    );
    return () => unsubscribe();
  }, [messagesRef, user.name]);

  const handleSend = async (inputMessage: string, substituteMessage?:string, announceFlag:boolean  = false) => {
    const modalOpenFlag = inputMsg !== CONFESSION_MESSAGE;
    await submitMsg(messagesRef, userRef, user.name, modalOpenFlag, () => setInputMsg(""), inputMessage, substituteMessage, announceFlag);
  };

  const handleCloseConfessionModal = () => {
    setIsConfessionModalOpen(false);
    setCountdown(TEN_SECONDS);
  };

  const handleConfessionSend = () => {
    setIsConfessionModalOpen(false);
    handleSend("", CONFESSION_MESSAGE);
    setCountdown(TEN_SECONDS);
  };

  const handleReplySend = () => {
    setIsReplyModalOpen(false);
    handleSend("", CONFESSION_REPLY_MESSAGE);
  };

  const closeWithoutSending = () => {
    setIsConfessionModalOpen(false);
    setCountdown(TEN_SECONDS);
  };

  return (
    <>
      <div className="chatroom-container">
        <div className="chatroom-logs-container">
        {chatLogs.map((item) =>
          !item.announceFlag ? (
            <Balloon
              key={item.key}
              userName={item.name}
              message={item.msg}
              isCurrentUser={user.name === item.name}
            />
          ) : user.name !== item.name ?(
            <Announcement key={item.key} message={item.msg} />
          ): null
        )}
        </div>

        <ChatInputBox userName={user.name} onSendMessage={handleSend} />

        <Modal show={isConfessionModalOpen} handleClose={handleCloseConfessionModal} title="運命の出会い" message="同じ部屋にいる相手は運命の人かもしれません。" subMessage="思いを相手に伝えますか？" countdown={`${countdown}秒後にモーダルは自動的に閉じます。`}>
          <input className="modal-input" type="text" value={CONFESSION_MESSAGE} readOnly />
          <button className="modal-submit-button" onClick={handleConfessionSend}>送信</button>
        </Modal>

        <Modal show={isReplyModalOpen} handleClose={() => setIsReplyModalOpen(false)} title="愛の告白" message="相手から愛の告白がありました" subMessage="あなたも思いを伝えますか？" countdown=''>
          <input type="text" value={CONFESSION_REPLY_MESSAGE} readOnly className="modal-input" />
          <button onClick={handleReplySend} className="modal-submit-button">送信</button>
        </Modal>
      </div>
    </>
  );
};

export default ChatRoom;
