import { User } from "../../constants/types/user";

/**
 * ユーザープロフィールの入力進捗率を計算します。
 *
 * @param {User} profile - 進捗を計算する対象のユーザープロフィールオブジェクト。
 * 
 * @returns {number} 入力進捗率（0〜100の整数値）。
 *
 */
export const calculateProgress = (profile: User): number => {
  const totalItems = Object.keys(profile).length;

  let completedItems = 0;

  if (profile.name) completedItems++;
  if (profile.gender) completedItems++;
  if (profile.ageRange) completedItems++;
  if (Object.keys(profile.personalities).length > 0) completedItems++;
  if (profile.appearance) completedItems++;
  if (profile.targetGender) completedItems++;
  if (profile.favoriteAppearance) completedItems++;
  if (Object.keys(profile.selectedPersonalities).length > 0) completedItems++;
  if (profile.favoriteAgeRange) completedItems++;

  return Math.floor((completedItems / totalItems) * 100);
};
