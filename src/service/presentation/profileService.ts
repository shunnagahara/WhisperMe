import { User } from "../../constants/types/user";
import { fetchProfile, saveProfile } from "../../repository/webstorage/user";
import { errorMessages } from "../../constants/common";
import { NavigateFunction } from 'react-router-dom';
import { CHATROOM_LIST_PAGE_PATH } from "../../constants/common";
import { AppDispatch } from '../../store/store';
import { loadStoredProfile } from '../../store/slices/profileSlice';
import { resetProfile } from "../../store/slices/profileSlice";

/**
 * ユーザープロフィールの入力値を検証します。
 *
 * @param {User} profile - 検証対象のユーザープロフィールオブジェクト。
 * 
 * @returns {{ [key: string]: string }} エラーのオブジェクト。プロパティごとにエラーメッセージを格納します。
 * 
 * ### 検証内容:
 * - `name`: 空白が含まれていないかを確認。
 * - `gender`: 性別が選択されているかを確認。
 * - `ageRange`: 年齢範囲が設定されているかを確認。
 * - `personalities`: 性格リストが空でないかを確認。
 * - `appearance`: 性別が選択されている場合、外見が設定されているかを確認。
 * - `targetGender`: 対象の性別が設定されているかを確認。
 * - `favoriteAgeRange`: 好みの年齢範囲が設定されているかを確認。
 * - `selectedPersonalities`: 選択した性格が空でないかを確認。
 * - `favoriteAppearance`: 性別が選択されている場合、好みの外見が設定されているかを確認。
 */
  export const validateProfileInputs = (profile: User) => {
    const newErrors: { [key: string]: string } = {};

    if (!profile.name.trim()) newErrors.name                                        = errorMessages.name.required;
    if (!profile.gender) newErrors.gender                                           = errorMessages.gender.required;
    if (!profile.ageRange) newErrors.ageRange                                       = errorMessages.ageRange.required;
    if (Object.keys(profile.personalities).length                                   === 0) newErrors.personalities = errorMessages.personalities.required;
    if (profile.gender && !profile.appearance) newErrors.appearance                 = errorMessages.appearance.required;
    if (!profile.targetGender) newErrors.targetGender                               = errorMessages.targetGender.required;
    if (!profile.favoriteAgeRange) newErrors.favoriteAgeRange                       = errorMessages.favoriteAgeRange.required;
    if (Object.keys(profile.selectedPersonalities).length                           === 0) newErrors.selectedPersonalities = errorMessages.selectedPersonalities.required;
    if (profile.gender && !profile.favoriteAppearance) newErrors.favoriteAppearance = errorMessages.favoriteAppearance.required;

    return newErrors;
  };


/**
 * ユーザーデータが既に存在するかをチェックします。
 *
 * @returns {boolean} ユーザーデータが完全に揃っている場合は `true` を返します。それ以外は `false`。
 *
 */
  export const isUserProfileExists = () => {
    const storedUserData = fetchProfile();
    if (storedUserData) {
      return storedUserData.name && storedUserData.gender && storedUserData.ageRange && storedUserData.personalities && storedUserData.appearance && storedUserData.targetGender && storedUserData.favoriteAppearance && storedUserData.selectedPersonalities && storedUserData.favoriteAgeRange;
    }
    return false;
  };

/**
 * ユーザーデータの初期ロード処理
 */
export const loadProfileData = (
  dispatch: AppDispatch,
  setShowSkipModal: (show: boolean) => void
) => {
  const storedUserData = fetchProfile();
  if (storedUserData) {
    dispatch(loadStoredProfile(storedUserData));
    setShowSkipModal(true);
  }
  return !!storedUserData;
};


/**
 * 入力値を検証し、次のページへ遷移する処理を実行します。
 *
 * @param {User} profile - ユーザープロフィールオブジェクト。
 * @param {(errors: { [key: string]: string }) => void} setErrors - エラーを設定する関数。
 * @param {(path: string) => void} navigate - ページ遷移を実行する関数。
 * 
 * ### 処理内容:
 * 1. 入力値を `validateInputs` 関数で検証します。
 * 2. 検証エラーがある場合は `setErrors` でエラーを設定します。
 * 3. 検証エラーがない場合:
 *    - プロフィールをローカルストレージに保存。
 *    - `/list` ページへ遷移。
 */
export const handleNext = (
  profile: User,
  setErrors: (errors: { [key: string]: string }) => void,
  navigate: (path: string) => void
) => {
  const validationErrors = validateProfileInputs(profile);
  setErrors(validationErrors);

  if (Object.keys(validationErrors).length === 0) {
    saveProfile(profile)
    navigate(CHATROOM_LIST_PAGE_PATH);
  }
};

/**
 * スキップモーダルを閉じ、必要に応じてチャットルーム一覧ページに遷移します。
 *
 * @param {(show: boolean) => void} setShowSkipModal - スキップモーダル表示状態を設定する関数。
 * @param {NavigateFunction} navigate - ページ遷移を実行する関数。
 * @param {boolean} navigateToChat - チャットルーム一覧ページに遷移するかどうかを指定するフラグ。
 * @param {AppDispatch} [dispatch] - Reduxのディスパッチ関数（オプショナル）。
 * 
 * ### 処理内容:
 * 1. モーダルを非表示に設定。
 * 2. `navigateToChat` が `true` の場合、`/list` ページへ遷移。
 * 3. `navigateToChat` が `false` の場合:
 *    - プロフィール情報をリセット。
 *    - ページトップへスクロール。
 */
export const handleSkipModalClose = (
  setShowSkipModal: (show: boolean) => void,
  navigate: NavigateFunction,
  navigateToChat: boolean,
  dispatch?: AppDispatch
) => {
  setShowSkipModal(false);
  if (navigateToChat) {
    navigate(CHATROOM_LIST_PAGE_PATH);
  } else {
    if (dispatch) {
      dispatch(resetProfile());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
};

/**
 * 入力フィールドにフォーカスが当たった時の処理を行います。
 * ビューポートのスケールを縮小し、モバイルでの入力を容易にします。
 */
export const handleInputFocus = () => {
  const viewport = document.querySelector('meta[name=viewport]');
  viewport?.setAttribute('content', 'width=device-width, initial-scale=0.8, maximum-scale=0.8');
};

/**
 * 入力フィールドからフォーカスが外れた時の処理を行います。
 * ビューポートのスケールを元の大きさに戻します。
 */
export const handleInputBlur = () => {
  const viewport = document.querySelector('meta[name=viewport]');
  viewport?.setAttribute('content', 'width=device-width, initial-scale=1.0');
};