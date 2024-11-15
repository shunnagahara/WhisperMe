import { Routes, Route, Navigate } from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import Profile from './pages/Profile';
import ChatRoomList from './pages/ChatRoomList';

const App = () => (
  <div className="App">
    <Routes>
      <Route path="/chat/:room" element={<ChatPage />} />
      <Route path="/list" element={<ChatRoomList />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate replace to="/profile" />} />
    </Routes>
  </div>
);
export default App;
