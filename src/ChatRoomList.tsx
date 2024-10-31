import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from './firebaseConfig';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import './ChatRoomList.css';

interface RoomInfo {
  id: string;
  userCount: number;
  matchingRate?: number;
  users?: Array<{ name: string; gender: string }>;
}

const ChatRoomList: React.FC = () => {
  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const roomNames = ['1', '2', '3', '4', '5', '6'];
    const unsubscribers = roomNames.map((roomId) => {
      const activeUsersRef = collection(db, 'chatroom', roomId, 'activeUsers');

      return onSnapshot(activeUsersRef, async (snapshot) => {
        // 各ユーザーのドキュメントIDを取得し、詳細情報を取得する
        const users = await Promise.all(
          snapshot.docs.map(async (userDoc) => {
            const userData = userDoc.data() as { name: string; gender: string };
            return userData;
          })
        );

        setRooms((prevRooms) => {
          const userCount = snapshot.size;
          const matchingRate = userCount === 1 ? Math.floor(Math.random() * 100) : undefined;
          const newRoomData = {
            id: roomId,
            userCount,
            matchingRate,
            users,
          };
          return [...prevRooms.filter((r) => r.id !== roomId), newRoomData];
        });

        setIsLoading(false);
      });
    });

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>ルームを読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="chatroom-container">
      <h1 className="chatroom-title">チャットルーム一覧</h1>
      <div className="chatroom-list">
        {rooms.map((room) => (
          <div key={room.id} className={`room-link ${room.userCount >= 2 ? 'room-full' : ''}`}>
            {room.userCount < 2 ? (
              <Link to={`/chat/${room.id}`} className="room-button">
                Room {room.id} ({room.userCount} 人)
                {room.userCount === 1 && room.matchingRate && (
                  <span className="matching-rate-heart">
                    ❤️ {room.matchingRate}%
                  </span>
                )}
                {/* ユーザーの名前と性別を表示 */}
                {room.users?.map((user, index) => (
                  <div key={index}>
                    {user.name} - {user.gender}
                  </div>
                ))}
              </Link>
            ) : (
              <div className="room-button disabled">
                Room {room.id} - 満室
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatRoomList;
