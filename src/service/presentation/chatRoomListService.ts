import { User } from './../../constants/types/user'

export const isRoomAvailable = (userCount:number, storedUser:User, userGenger?:string, userTargetGenger?:string) => {
  if (userCount === 0) return true
  if (userCount === 1 && (userGenger === storedUser.targetGender) && (userTargetGenger === storedUser.gender)) return true
  return false
}