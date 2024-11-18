import { User } from './../../constants/types/user'

/**
 * チャットルームが利用可能かどうかを判定します。
 *
 * @param {number} userCount - 現在のチャットルーム内のユーザー数。
 * @param {User} storedUser - 現在のユーザー情報。
 * @param {string} [userGenger] - チャットルーム内の既存ユーザーの性別（オプショナル）。
 * @param {string} [userTargetGenger] - チャットルーム内の既存ユーザーの希望する対象性別（オプショナル）。
 *
 * @returns {boolean} チャットルームが利用可能な場合は `true` を返します。それ以外の場合は `false`。
 *
 */
export const isRoomAvailable = (userCount:number, storedUser:User, userGenger?:string, userTargetGenger?:string) => {
  if (userCount === 0) return true
  if (userCount === 1 && (userGenger === storedUser.targetGender) && (userTargetGenger === storedUser.gender)) return true
  return false
}