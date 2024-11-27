import { RoomInfo } from './../../constants/types/roomInfo';
import { User } from './../../constants/types/user'
import { ROOM_AVAILABLE_IMAGE_PATH, ROOM_SOMEBODY_IN_IMAGE_PATH, ROOM_DISABLE_IMAGE_PATH } from './../../constants/common'

/**
 * チャットルームが利用可能かどうかを判定します。
 *
 * @param {number} userCount - 現在のチャットルーム内のユーザー数。
 * @param {User} profile - 現在のユーザー情報。
 * @param {string} [userGenger] - チャットルーム内の既存ユーザーの性別（オプショナル）。
 * @param {string} [userTargetGenger] - チャットルーム内の既存ユーザーの希望する対象性別（オプショナル）。
 *
 * @returns {boolean} チャットルームが利用可能な場合は `true` を返します。それ以外の場合は `false`。
 *
 */
export const isRoomAvailable = (userCount:number, profile:User, userGenger?:string, userTargetGenger?:string) => {
  if (userCount === 0) return true
  if (userCount === 1 && (userGenger === profile.targetGender) && (userTargetGenger === profile.gender)) return true
  return false
}

/**
 * ルームのイメージを取得します。
 *
 * @param {number} userCount - 現在のチャットルーム内のユーザー数。
 *
 * @returns {string} ルームのイメージパス。
 *
 */
export const fetchRoomImage = (userCount:number) => {
  if (userCount === 0) return ROOM_AVAILABLE_IMAGE_PATH
  if (userCount === 1)  return ROOM_SOMEBODY_IN_IMAGE_PATH
  if (userCount === 2)  return ROOM_DISABLE_IMAGE_PATH
}

/**
 * ルーム情報を部屋番号順にソートします。
 *
 * @param {RoomInfo[]} rooms - ソートする部屋情報の配列。
 * @returns {RoomInfo[]} 部屋番号順にソートされた新しい配列。
 */
export const sortRoomsByNumber = (rooms: RoomInfo[]): RoomInfo[] => {
  return [...rooms].sort((a, b) => Number(a.id) - Number(b.id));
};

/**
 * ユーザー数の変更を検知し、アニメーション状態を制御します。
 * 
 * @param {number} currentUserCount - 現在のユーザー数
 * @param {number} prevUserCount - 以前のユーザー数
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setAnimateChange - アニメーション状態を更新する関数
 * @returns {() => void} クリーンアップ関数
 */
export const handleUserCountChange = (
  currentUserCount: number,
  prevUserCount: number,
  setAnimateChange: React.Dispatch<React.SetStateAction<boolean>>
): (() => void) => {
  if (prevUserCount !== currentUserCount) {
    setAnimateChange(true);
    const timer = setTimeout(() => setAnimateChange(false), 500);
    return () => clearTimeout(timer);
  }
  return () => {};
};