import React, { useState } from "react";
import { Routes, Route, Link} from 'react-router-dom';
import ChatPage from './ChatPage';
import "./App.css";

interface ChatRoomListProps {}

interface Message {
  user: string;
  text: string;
}

const ChatRoomList: React.FC<ChatRoomListProps> = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>("");

  const handleSendMessage = () => {
    if (inputText.trim()) {
      setMessages([...messages, { user: "You", text: inputText }]);
      setInputText("");
    }
  };

  return (
    <div className="roombox">
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