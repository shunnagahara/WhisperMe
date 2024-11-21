import { Routes, Route, Navigate } from 'react-router-dom';
import ChatPage from './ChatPage';
import Profile from './Profile';
import ChatRoomList from './ChatRoomList';

const App = () => (
  <div className="App">
    <Routes>
      <Route path="/lovyu/chat/:room" element={<ChatPage />} />
      <Route path="/lovyu/list" element={<ChatRoomList />} />
      <Route path="/lovyu/profile" element={<Profile />} />
      <Route path="/lovyu/*" element={<Navigate replace to="/lovyu/profile" />} />
    </Routes>
  </div>
);
export default App;
