import React, { useState, useEffect } from "react";
import {Link} from 'react-router-dom';
import { db } from './firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import "./App.css";
import './ChatRoomList.css';

interface ChatRoomListProps {}

interface RoomInfo {
  id: string;
  userCount: number;
}

const ChatRoomList: React.FC<ChatRoomListProps> = () => {
  const [rooms, setRooms] = useState<RoomInfo[]>([]);

  useEffect(() => {
    const roomNames = ['1', '2', '3', '4', '5', '6'];
    const unsubscribers = roomNames.map((roomId) => {
      const activeUsersRef = collection(db, 'chatroom', roomId, 'activeUsers');
      return onSnapshot(activeUsersRef, (snapshot) => {
        setRooms((prevRooms) => {
          const newRoomData = {
            id: roomId,
            userCount: snapshot.size,
          };
          return [...prevRooms.filter((r) => r.id !== roomId), newRoomData];
        });
      });
    });

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, []);


  return (
    <div className="chatroom-container">
      <h1 className="chatroom-title">チャットルーム一覧</h1>
      <div className="chatroom-list">
        {rooms.map((room) => (
          <div key={room.id} className={`room-link ${room.userCount >= 2 ? 'room-full' : ''}`}>
            {room.userCount < 2 ? (
              <Link to={`/chat/${room.id}`} className="room-button">
                Room {room.id} ({room.userCount} 人)
              </Link>
            ) : (
              <div className="room-button disabled">
                Room {room.id} - 満室
              </div>
            )}
          </div>
        ))}
      </div>
      {/* チャットコンテナ */}
    </div>
  );
};

export default ChatRoomList;