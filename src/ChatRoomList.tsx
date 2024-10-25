import React, { useState, useEffect } from "react";
import { Routes, Route, Link} from 'react-router-dom';
import ChatPage from './ChatPage';
import Modal from './Modal';
import "./App.css";

interface ChatRoomListProps {}

interface UserData {
  name: string;
  gender: string;
}

const ChatRoomList: React.FC<ChatRoomListProps> = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [gender, setGender] = useState<string>(''); // 性別を管理する state
  const [submittedData, setSubmittedData] = useState<UserData | null>(null);
  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    setShowModal(true);  // 初回レンダリング時にモーダルを開く
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value); // 入力された値をnameにセット
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGender(e.target.value); // 選択された性別をgenderにセット
  };

  const handleSubmit = () => {
    const userData: UserData = {
      name,
      gender
    };
    localStorage.setItem('whisper-me-username', JSON.stringify(userData));
    setSubmittedData(userData);
    setShowModal(false); // モーダルを閉じる
  };

  return (
    <div className="roombox">
      <Modal show={showModal} handleClose={handleCloseModal}>
        <h2>モーダル画面</h2>
        <p>ここにコンテンツを表示できます。</p>
        <input 
          type="text" 
          value={name} 
          onChange={handleNameChange} 
          placeholder="名前を入力" 
        />
       <p>性別を選択してください：</p>
        <select value={gender} onChange={handleGenderChange}>
          <option value="">選択してください</option>
          <option value="male">男性</option>
          <option value="female">女性</option>
          <option value="other">その他</option>
        </select>
        <button onClick={handleSubmit}>送信</button>
      </Modal>
      {/* 送信後に表示される名前と性別 */}
      {submittedData && (
        <div>
          <p>送信された名前: {submittedData.name}</p>
          <p>送信された性別: {submittedData.gender}</p>
        </div>
      )}
      <div className="sidebar">
            <Link to="/chat/1" className="room-link">Room 1</Link>
            <Link to="/chat/2" className="room-link">Room 2</Link>
            <Link to="/chat/3" className="room-link">Room 3</Link>
            <Link to="/chat/4" className="room-link">Room 4</Link>
            <Link to="/chat/5" className="room-link">Room 5</Link>
            <Link to="/chat/6" className="room-link">Room 6</Link>
      </div>
      <div className="chat-container">
        <Routes>
          <Route path="/chat/1" element={<ChatPage/>}/>
          <Route path="/chat/2" element={<ChatPage />} />
          <Route path="/chat/3" element={<ChatPage />} />
          <Route path="/chat/4" element={<ChatPage />} />
          <Route path="/chat/5" element={<ChatPage />} />
          <Route path="/chat/6" element={<ChatPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default ChatRoomList;