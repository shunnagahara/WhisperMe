import { collection, onSnapshot } from "firebase/firestore";
import { db } from './../../firebaseConfig';
import { User } from './../../constants/types/user';
import { RoomInfo } from '../../constants/types/roomInfo';
import { roomNumbers } from './../../constants/common';
import { fetchActiveUserFromFirestore } from '../../repository/firestore/activeUser';


type RoomSubscriptionArgs = {
  storedUser: User;
  setRooms: React.Dispatch<React.SetStateAction<RoomInfo[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const subscribeToRooms = ({
  storedUser,
  setRooms,
  setIsLoading,
}: RoomSubscriptionArgs) => {

  const unsubscribers = roomNumbers.map((roomId) => {
    const activeUsersRef = collection(db, "chatroom", roomId, "activeUsers");

    return onSnapshot(activeUsersRef, async (snapshot) => {
      const user: User | null = await fetchActiveUserFromFirestore(snapshot);

      setRooms((prevRooms) => {
        const userCount = snapshot.size;
        const matchingRate = userCount === 1 && user ? calculateMatchingRate(user, storedUser) : undefined;

        const newRoomData = {
          id: roomId,
          userCount,
          matchingRate,
          user,
        };
        return [...prevRooms.filter((r) => r.id !== roomId), newRoomData];
      });

      setIsLoading(false);
    });
  });
  return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
};

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