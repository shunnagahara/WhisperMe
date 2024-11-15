import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { subscribeToRooms } from './../service/model/chatRoomListService';
import { isRoomAvailable } from './../service/presentation/chatRoomListService'
import Loading from './../components/Loading'
import { RoomInfo } from './../constants/types/roomInfo';
import { fetchUserFromWebStorage } from '../repository/webstorage/user';
import './../css/ChatRoomList.css';

const ChatRoomList: React.FC = () => {
  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const storedUser = fetchUserFromWebStorage()

  useEffect(() => {
    const unsubscribe = subscribeToRooms({
      storedUser,
      setRooms,
      setIsLoading,
    });
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <Loading message="ルームを読み込み中..." />;
  }

  return (
    <div className="chatroom-container">
      <h1 className="chatroom-title">チャットルーム一覧</h1>
      <div className="chatroom-list">
        {rooms.map((room) => {

          return (
            <div key={room.id} className={`room-link ${room.userCount >= 2  ? 'room-full' : ''}`}>
              {isRoomAvailable(room.userCount, storedUser, room.user?.gender, room.user?.targetGender) ? (
                <Link to={`/chat/${room.id}`} className="room-button">
                  Room {room.id} ({room.userCount} 人)
                  {room.userCount === 1 && room.matchingRate && (
                    <span className="matching-rate-heart">
                      ❤️ {room.matchingRate}%
                    </span>
                  )}
                </Link>
              ) : (
                <div className="room-button disabled">
                  Room {room.id} - 入室不可
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatRoomList;
