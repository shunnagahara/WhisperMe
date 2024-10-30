import { Routes, Route, Navigate } from 'react-router-dom';
import ChatPage from './ChatPage';
import Profile from './Profile';
import ChatRoomList from './ChatRoomList';

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
