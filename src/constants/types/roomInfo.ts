import { User } from './user';

export type RoomInfo = {
  id: string;
  userCount: number;
  matchingRate?: number;
  user?: User;
}