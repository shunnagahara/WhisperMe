import { User } from './../../constants/types/user';
import { WEB_STORAGE_KEY } from '../../constants/common';

/**
 * ローカルストレージからユーザープロフィールを取得します。
 *
 * @returns {User | null} ユーザープロフィールオブジェクト。ユーザー情報が存在しない場合は `null` を返します。
 *
 * ### プロパティ構造:
 * - `name` (string): ユーザー名。
 * - `gender` (string): ユーザーの性別。
 * - `ageRange` (string): ユーザーの年齢範囲。
 * - `personalities` (string[]): ユーザーの性格リスト。
 * - `appearance` (string): ユーザーの外見タイプ。
 * - `targetGender` (string): ユーザーが対象とする性別。
 * - `favoriteAppearance` (string): ユーザーの好みの外見。
 * - `selectedPersonalities` (string[]): ユーザーが選択した性格。
 * - `favoriteAgeRange` (string): ユーザーの好みの年齢範囲。
 */
  export const fetchProfile = (): User | null => {
    const user = JSON.parse(localStorage.getItem(WEB_STORAGE_KEY));
    if (!user) return null
    return {
      name: user.name,
      gender: user.gender,
      ageRange: user.ageRange,
      personalities: user.personalities,
      appearance: user.appearance,
      targetGender: user.targetGender,
      favoriteAppearance: user.favoriteAppearance,
      selectedPersonalities: user.selectedPersonalities,
      favoriteAgeRange: user.favoriteAgeRange,
    };
  };

/**
 * ユーザープロフィールをローカルストレージに保存します。
 *
 * @param {User} profile - 保存するユーザープロフィールオブジェクト。
 *
 * ### プロパティ構造:
 * - `name` (string): ユーザー名。
 * - `gender` (string): ユーザーの性別。
 * - `ageRange` (string): ユーザーの年齢範囲。
 * - `personalities` (string[]): ユーザーの性格リスト。
 * - `appearance` (string): ユーザーの外見タイプ。
 * - `targetGender` (string): ユーザーが対象とする性別。
 * - `favoriteAppearance` (string): ユーザーの好みの外見。
 * - `selectedPersonalities` (string[]): ユーザーが選択した性格。
 * - `favoriteAgeRange` (string): ユーザーの好みの年齢範囲。
 *
 * @returns {void} なし。
 */
  export const saveProfile = (profile:User) => {
    return localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(profile));
  };