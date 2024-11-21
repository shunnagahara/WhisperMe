import { Routes, Route, Navigate } from 'react-router-dom';
import ChatPage from './ChatPage';
import Profile from './Profile';
import ChatRoomList from './ChatRoomList';
import { PROFILE_PAGE_PATH, CHATROOM_LIST_PAGE_PATH, CHAT_PAGE_PATH } from '../constants/common';

const App = () => (
  <div className="App">
    <Routes>
      <Route path={`${CHAT_PAGE_PATH}/:room`} element={<ChatPage />} />
      <Route path={CHATROOM_LIST_PAGE_PATH} element={<ChatRoomList />} />
      <Route path={PROFILE_PAGE_PATH} element={<Profile />} />
      <Route path="/lovyu/*" element={<Navigate replace to={PROFILE_PAGE_PATH} />} />
    </Routes>
  </div>
);
export default App;
