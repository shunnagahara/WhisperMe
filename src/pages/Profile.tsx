import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as MaleIcon } from './../assets/icons/male.svg';
import { ReactComponent as FemaleIcon } from './../assets/icons/female.svg';
import { ageRangeOptions, personalityOptions, maleAppearanceOptions, femaleAppearanceOptions } from './../constants/common';
import { User } from './../constants/types/user';
import { loadProfileData, handleNext, handleSkipModalClose } from './../service/presentation/profileService';
import { calculateProgress } from './../service/model/profileService';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { updateProfileField, selectProfile } from '../store/slices/profileSlice';
import Modal from './../components/Modal';
import ProgressBar from './../components/ProgressBar';
import './../css/profile.css';


const Profile: React.FC = () => {

  const profile = useAppSelector(selectProfile);
  const [progress, setProgress]   = useState(0);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [errors, setErrors]       = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const updateProfile = (key: keyof User, value: any) => {
    dispatch(updateProfileField({ key, value }));
  };

  useEffect(() => {
    loadProfileData(dispatch, setShowSkipModal);
  }, [dispatch]);

  useEffect(() => {
    const progressValue = calculateProgress(profile);
    setProgress(progressValue);
  }, [profile]);

  return (
    <div className="profile-container">

      <Modal
        show={showSkipModal}
        handleClose={() => handleSkipModalClose(setShowSkipModal, navigate, false)}
        title="プロフィールが保存されています"
        message="保存されたプロフィールでチャットルームに移動しますか？"
      >
        <button className="modal-button modal-button-confirm" onClick={() => handleSkipModalClose(setShowSkipModal, navigate, true)}>はい</button>
        <button className="modal-button modal-button-cancel" onClick={() => handleSkipModalClose(setShowSkipModal, navigate, false)}>いいえ</button>
      </Modal>

      <ProgressBar progress={progress} />

      <div className="profile-card">

        <div className="profile-input-container input-name">
          <input
            type="text"
            value={profile.name}
            onChange={(e) => updateProfile("name", e.target.value)}
            placeholder="あなたの名前を入力してください"
            className="profile-input"
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>

        <div className="profile-input-container">
          <div className="profile-input-title-div">
            <p>あなたの性別を選択してください</p>
          </div>
          <div className="gender-selection">
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={profile.gender === 'male'}
                onChange={() => updateProfile("gender", 'male')}
                className="hidden-radio"
              />
              <MaleIcon className={`icon ${profile.gender === 'male' ? 'selected' : ''}`} />
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={profile.gender === 'female'}
                onChange={() => updateProfile("gender", 'female')}
                className="hidden-radio"
              />
              <FemaleIcon className={`icon ${profile.gender === 'female' ? 'selected' : ''}`} />
            </label>
          </div>
          {errors.gender && <p className="error-text">{errors.gender}</p>}
        </div>

        <div className="profile-input-container">
          <div className="personality-container">
            <div className="profile-input-title-div">
              <p>あなたの年代を選択してください</p>
            </div>
            <div className="personality-options">
              {ageRangeOptions.map((ageGroup) => (
                <div
                  key={ageGroup}
                  className={`personality-tag ${profile.ageRange === ageGroup ? 'selected' : ''}`}
                  onClick={() => updateProfile('ageRange', ageGroup)}
                >
                  {ageGroup}
                </div>
              ))}
            </div>
            {errors.ageGroup && <p className="error-text">{errors.ageGroup}</p>}
          </div>
        </div>

        <div className="profile-input-container">
          <div className="personality-container">
            <div className="profile-input-title-div">
              <p>あなたの性格を選択してください</p>
            </div>
            <div className="personality-options">
              {personalityOptions.map((personality) => (
                <div
                  key={personality}
                  className={`personality-tag ${Array.isArray(profile.personalities) && profile.personalities.includes(personality) ? 'selected' : ''}`}
                  onClick={() => updateProfile('personalities', personality)}
                >
                  {personality}
                </div>
              ))}
            </div>
            {errors.personalities && <p className="error-text">{errors.personalities}</p>}
          </div>
        </div>

        <div className="profile-input-container">
          {profile.gender && (
            <div className="personality-container">
              <div className="profile-input-title-div">
                <p>あなたの見ためを選択してください</p>
              </div>
              <div className="personality-options">
                {(profile.gender === 'male' ? maleAppearanceOptions : femaleAppearanceOptions).map((myAppearance) => (
                  <div
                    key={myAppearance}
                    className={`personality-tag ${profile.appearance === myAppearance ? 'selected' : ''}`}
                    onClick={() => updateProfile('appearance', myAppearance)}
                  >
                    {myAppearance}
                  </div>
                ))}
              </div>
              {errors.appearance && <p className="error-text">{errors.appearance}</p>}
            </div>
          )}
        </div>

        <div className="profile-input-container">
          <div className="profile-input-title-div">
            <p>相手の性別を選択してください</p>
          </div>
          <div className="gender-selection">
            <label>
              <input
                type="radio"
                name="targetGender"
                value="male"
                checked={profile.targetGender === 'male'}
                onChange={() => updateProfile('targetGender', 'male')}
                className="hidden-radio"
              />
              <MaleIcon className={`icon ${profile.targetGender === 'male' ? 'selected' : ''}`} />
            </label>
            <label>
              <input
                type="radio"
                name="targetGender"
                value="female"
                checked={profile.targetGender === 'female'}
                onChange={() => updateProfile('targetGender', 'female')}
                className="hidden-radio"
              />
              <FemaleIcon className={`icon ${profile.targetGender === 'female' ? 'selected' : ''}`} />
            </label>
          </div>
          {errors.targetGender && <p className="error-text">{errors.targetGender}</p>}
        </div>

        <div className="profile-input-container">
          <div className="personality-container">
            <div className="profile-input-title-div">
              <p>好きな年代を選択してください</p>
            </div>
            <div className="personality-options">
              {ageRangeOptions.map((ageGroup) => (
                <div
                  key={ageGroup}
                  className={`personality-tag ${profile.favoriteAgeRange === ageGroup ? 'selected' : ''}`}
                  onClick={() => updateProfile('favoriteAgeRange', ageGroup)}
                >
                  {ageGroup}
                </div>
              ))}
            </div>
            {errors.favoriteAgeGroup && <p className="error-text">{errors.favoriteAgeGroup}</p>}
          </div>
        </div>

        <div className="profile-input-container">
          {profile.targetGender && (
            <div className="personality-container">
              <div className="profile-input-title-div">
                <p>好きな見ためを選択してください</p>
              </div>
              <div className="personality-options">
                {(profile.targetGender === 'male' ? maleAppearanceOptions : femaleAppearanceOptions).map((appearance) => (
                  <div
                    key={appearance}
                    className={`personality-tag ${profile.favoriteAppearance === appearance ? 'selected' : ''}`}
                    onClick={() => updateProfile('favoriteAppearance', appearance)}
                  >
                    {appearance}
                  </div>
                ))}
              </div>
              {errors.favoriteAppearance && <p className="error-text">{errors.favoriteAppearance}</p>}
            </div>
          )}
        </div>

        <div className="profile-input-container">
          <div className="personality-container">
            <div className="profile-input-title-div">
              <p>好きな性格を選択してください</p>
            </div>
            <div className="personality-options">
              {personalityOptions.map((personality) => (
                <div
                  key={personality}
                  className={`personality-tag ${Array.isArray(profile.selectedPersonalities) && profile.selectedPersonalities.includes(personality) ? 'selected' : ''}`}
                  onClick={() => updateProfile('selectedPersonalities', personality)}
                >
                  {personality}
                </div>
              ))}
            </div>
            {errors.selectedPersonalities && <p className="error-text">{errors.selectedPersonalities}</p>}
          </div>
        </div>

        <button onClick={() => handleNext(profile, setErrors, navigate)} className="profile-button">次へ</button>
      </div>
    </div>
  );
};

export default Profile;
