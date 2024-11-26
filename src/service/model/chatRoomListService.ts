import { collection, onSnapshot } from "firebase/firestore";
import { db } from './../../firebaseConfig';
import { User } from './../../constants/types/user';
import { RoomInfo } from '../../constants/types/roomInfo';
import { roomNumbers } from './../../constants/common';
import { fetchActiveUser } from '../../repository/firestore/activeUser';
import { sortRoomsByNumber } from '../presentation/chatRoomListService';


type RoomSubscriptionArgs = {
  profile: User;
  setRooms: React.Dispatch<React.SetStateAction<RoomInfo[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};


/**
 * チャットルームの情報をリアルタイムで更新します。
 *
 * @param {RoomSubscriptionArgs} args - 監視に必要な引数。
 * @param {User} args.profile - 現在のユーザー情報。
 * @param {React.Dispatch<React.SetStateAction<RoomInfo[]>>} args.setRooms - ルーム情報を更新するための関数。
 * @param {React.Dispatch<React.SetStateAction<boolean>>} args.setIsLoading - ローディング状態を更新するための関数。
 *
 * @returns {() => void} 監視を停止するための関数。
 *
 */
export const subscribeToRooms = ({
  profile,
  setRooms,
  setIsLoading,
}: RoomSubscriptionArgs) => {

  const unsubscribers = roomNumbers.map((roomId) => {
    const activeUsersRef = collection(db, "chatroom", roomId, "activeUsers");

    return onSnapshot(activeUsersRef, async (snapshot) => {
      const user: User | null = await fetchActiveUser(snapshot);

      setRooms((prevRooms) => {
        const userCount = snapshot.size;
        const matchingRate = userCount === 1 && user ? calculateMatchingRate(user, profile) : undefined;

        const newRoomData = {
          id: roomId,
          userCount,
          matchingRate,
          user,
        };

        const updatedRooms = [
          ...prevRooms.filter((r) => r.id !== roomId),
          newRoomData
        ];

        return sortRoomsByNumber(updatedRooms);
      });

      setIsLoading(false);
    });
  });
  return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
};

/**
 * 2人のユーザー間のマッチング率を計算します。
 *
 * @param {User} user - 比較対象のユーザー情報。
 * @param {User} storedUser - 現在のユーザー情報。
 * 
 * @returns {number} マッチング率（0〜100の整数値）。
 *
 */
export const calculateMatchingRate = (user: User, storedUser: User): number => {
  let matchCount = 0;
  let totalAttributes = 0;

  if (user.appearance === storedUser.favoriteAppearance) matchCount++;
  totalAttributes++;

  if (user.ageRange === storedUser.favoriteAgeRange) matchCount++;
  totalAttributes++;

  for (const key in user.personalities) {
    if (user.personalities[key] === storedUser.selectedPersonalities[key]) {
      matchCount++;
    }
    totalAttributes++;
  }
  return Math.floor((matchCount / totalAttributes) * 100);
};