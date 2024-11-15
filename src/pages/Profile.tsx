import React, { useState, useEffect } from 'react';
import { ReactComponent as MaleIcon } from './../assets/icons/male.svg';
import { ReactComponent as FemaleIcon } from './../assets/icons/female.svg';
import { useNavigate } from 'react-router-dom';
import { ageRangeOptions, personalityOptions, maleAppearanceOptions, femaleAppearanceOptions } from './../constants/common';
import { User } from './../constants/types/user'
import Modal from './../components/Modal';
import ProgressBar from './../components/ProgressBar';
import './../css/Modal.css';
import './../css/Profile.css';

const Profile: React.FC = () => {

  const [profile, setProfile] = useState<User>({
    name: '',
    gender: '',
    ageRange: '',
    personalities: [],
    appearance: '',
    targetGender: '',
    favoriteAppearance: '',
    selectedPersonalities: [],
    favoriteAgeRange: ''
  });

  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const updateProfile = (key: keyof User, value: any) => {
    setProfile((prevProfile) => ({
        ...prevProfile,
        [key]: Array.isArray(prevProfile[key])
            ? [...(prevProfile[key] as string[]), value]
            : value,
    }));
  };

  const navigate = useNavigate();

  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {};

    if (!profile.name.trim()) newErrors.name = '名前を入力してください。';
    if (!profile.gender) newErrors.gender = '性別を選択してください。';
    if (!profile.ageRange) newErrors.gender = '年代を選択してください。';
    if (Object.keys(profile.personalities).length === 0) newErrors.personalities = '性格を選択してください。';
    if (profile.gender && !profile.appearance) newErrors.appearance = '見ためを選択してください。';
    if (!profile.targetGender) newErrors.targetGender = '相手の性別を選択してください。';
    if (!profile.favoriteAgeRange) newErrors.favoriteAgeRange = '好きな年代を選択してください。';
    if (Object.keys(profile.selectedPersonalities).length === 0) newErrors.selectedPersonalities = '好きな性格を選択してください。';
    if (profile.gender && !profile.favoriteAppearance) newErrors.favoriteAppearance = '好きな見ためを選択してください。';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isUserDataComplete = () => {
    const storedUserData = localStorage.getItem('lovyu-user');
    if (storedUserData) {
      const { name, gender, ageRange, personalities, appearance, targetGender, favoriteAppearance, selectedPersonalities, favoriteAgeRange } = JSON.parse(storedUserData);
      return name && gender && ageRange && personalities && appearance && targetGender && favoriteAppearance && selectedPersonalities && favoriteAgeRange;
    }
    return false;
  };

  const handleNext = () => {
    if (validateInputs()) {
      localStorage.setItem('lovyu-user', JSON.stringify(profile));
      navigate('/list');
    }
  };

  useEffect(() => {
    if (isUserDataComplete()) {
      setShowModal(true); // Show modal if user data is complete
    }
  }, []);

 // 各項目が入力されたかを確認し、進捗率を計算
 useEffect(() => {
    const totalItems = 9;
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

    setProgress(Math.floor((completedItems / totalItems) * 100));
  }, [profile.name, profile.gender, profile.ageRange, profile.personalities, profile.appearance, profile.targetGender, profile.favoriteAppearance, profile.selectedPersonalities, profile.favoriteAgeRange]);

  const handleModalClose = (navigateToChat: boolean) => {
    setShowModal(false);
    if (navigateToChat) {
      navigate('/list'); // Navigate to chat room list if user agrees
    }
  };

  return (
    <div className="profile-container">

      <Modal
        show={showModal}
        handleClose={() => handleModalClose(false)}
        title="プロフィールが保存されています"
        message="保存されたプロフィールでチャットルームに移動しますか？"
      >
        <button className="modal-button modal-button-confirm" onClick={() => handleModalClose(true)}>はい</button>
        <button className="modal-button modal-button-cancel" onClick={() => handleModalClose(false)}>いいえ</button>
      </Modal>
      <ProgressBar progress={progress} />
      <div className="profile-card">

        <div className="profile-input-container">
          <input
            type="text"
            value={profile.name}
            onChange={(e) => updateProfile("name", e.target.value)}
            placeholder="あなたの名前"
            className="profile-input"
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>

        <div className="profile-input-container">
          <div className="profile-input-title-div">
            <p>あなたの性別を選択:</p>
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
              <p>性格を選択</p>
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
                <p>見ためを選択してください</p>
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
            <p>相手の性別を選択:</p>
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
              <p>好きな性格を選択</p>
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

        <button onClick={handleNext} className="profile-button">次へ</button>
      </div>
    </div>
  );
};

export default Profile;
