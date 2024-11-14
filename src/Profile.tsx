import React, { useState, useEffect } from 'react';
import { ReactComponent as MaleIcon } from './icons/male.svg'; // 男性アイコンのSVG
import { ReactComponent as FemaleIcon } from './icons/female.svg'; // 女性アイコンのSVG
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import ProgressBar from './ProgressBar';
import './Modal.css';
import './Profile.css';

const personalityOptions = ["やさしい", "オラオラ", "しずか", "おもしろい"];
const ageRangeOptions = ["18 - 25", "25 - 30", "30 - 40", "40 - 50", "50 - 60"];

const Profile: React.FC = () => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [targetGender, setTargetGender] = useState('');
  const [favoriteAppearance, setFavoriteAppearance] = useState('');
  const [selectedPersonalities, setSelectedPersonalities] = useState<string[]>([]);
  const [favoriteAgeRange, setFavoriteAgeRange] = useState('');
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // 男性・女性による「好きな外見」の選択肢
  const maleAppearanceOptions = ['爽やか系', 'ワイルド系', '韓国系'];
  const femaleAppearanceOptions = ['かわいい系', 'キレイ系', 'かわキレイ系'];

  const navigate = useNavigate();

  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = '名前を入力してください。';
    if (!gender) newErrors.gender = '性別を選択してください。';
    if (!targetGender) newErrors.targetGender = '対象性別を選択してください。';
    if (gender && !favoriteAppearance) newErrors.favoriteAppearance = '好きな外見を選択してください。';
    if (!favoriteAgeRange) newErrors.favoriteAgeRange = '好きな年代を選択してください。';
    if (selectedPersonalities.length === 0) newErrors.selectedPersonalities = '好きな性格を選択してください。';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isUserDataComplete = () => {
    const storedUserData = localStorage.getItem('lovyu-user');
    if (storedUserData) {
      const { name, gender, targetGender, favoriteAppearance, selectedPersonalities, favoriteAgeRange } = JSON.parse(storedUserData);
      return name && gender && targetGender && favoriteAppearance && selectedPersonalities && favoriteAgeRange;
    }
    return false;
  };

  const handleNext = () => {
    if (validateInputs()) {
      const userData = { name, gender, targetGender, favoriteAppearance, selectedPersonalities, favoriteAgeRange };
      localStorage.setItem('lovyu-user', JSON.stringify(userData));
      navigate('/list');
    }
  };

  const togglePersonality = (personality: string) => {
    setSelectedPersonalities((prev) =>
      prev.includes(personality) ? prev.filter((p) => p !== personality) : [...prev, personality]
    );
  };

  useEffect(() => {
    if (isUserDataComplete()) {
      setShowModal(true); // Show modal if user data is complete
    }
  }, []);

 // 各項目が入力されたかを確認し、進捗率を計算
 useEffect(() => {
    const totalItems = 6;
    let completedItems = 0;

    if (name) completedItems++;
    if (gender) completedItems++;
    if (targetGender) completedItems++;
    if (favoriteAppearance) completedItems++;
    if (Object.keys(selectedPersonalities).length > 0) completedItems++;
    if (favoriteAgeRange) completedItems++;

    setProgress(Math.floor((completedItems / totalItems) * 100));
  }, [name, gender, targetGender, favoriteAppearance, selectedPersonalities, favoriteAgeRange]);

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

      <div className="profile-card">
        {/* <h1>プロフィール登録</h1> */}
        <ProgressBar progress={progress} />

        <div className="profile-input-container">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
                checked={gender === 'male'}
                onChange={() => setGender('male')}
                className="hidden-radio"
              />
              <MaleIcon className={`icon ${gender === 'male' ? 'selected' : ''}`} />
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={gender === 'female'}
                onChange={() => setGender('female')}
                className="hidden-radio"
              />
              <FemaleIcon className={`icon ${gender === 'female' ? 'selected' : ''}`} />
            </label>
          </div>
          {errors.gender && <p className="error-text">{errors.gender}</p>}
        </div>

        <div className="profile-input-container">
          <div className="profile-input-title-div">
            <p>対象の性別を選択:</p>
          </div>
          <div className="gender-selection">
            <label>
              <input
                type="radio"
                name="targetGender"
                value="male"
                checked={targetGender === 'male'}
                onChange={() => setTargetGender('male')}
                className="hidden-radio"
              />
              <MaleIcon className={`icon ${targetGender === 'male' ? 'selected' : ''}`} />
            </label>
            <label>
              <input
                type="radio"
                name="targetGender"
                value="female"
                checked={targetGender === 'female'}
                onChange={() => setTargetGender('female')}
                className="hidden-radio"
              />
              <FemaleIcon className={`icon ${targetGender === 'female' ? 'selected' : ''}`} />
            </label>
          </div>
          {errors.targetGender && <p className="error-text">{errors.targetGender}</p>}
        </div>

        <div className="profile-input-container">
          {targetGender && (
            <div className="personality-container">
              <div className="profile-input-title-div">
                <p>好きな外見を選択してください</p>
              </div>
              <div className="personality-options">
                {(targetGender === 'male' ? maleAppearanceOptions : femaleAppearanceOptions).map((appearance) => (
                  <div
                    key={appearance}
                    className={`personality-tag ${favoriteAppearance === appearance ? 'selected' : ''}`}
                    onClick={() => setFavoriteAppearance(appearance)}
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
                  className={`personality-tag ${selectedPersonalities.includes(personality) ? 'selected' : ''}`}
                  onClick={() => togglePersonality(personality)}
                >
                  {personality}
                </div>
              ))}
            </div>
            {errors.selectedPersonalities && <p className="error-text">{errors.selectedPersonalities}</p>}
          </div>
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
                  className={`personality-tag ${favoriteAgeRange === ageGroup ? 'selected' : ''}`}
                  onClick={() => setFavoriteAgeRange(ageGroup)}
                >
                  {ageGroup}
                </div>
              ))}
            </div>
            {errors.favoriteAgeGroup && <p className="error-text">{errors.favoriteAgeGroup}</p>}
          </div>
        </div>

        <button onClick={handleNext} className="profile-button">次へ</button>
      </div>
    </div>
  );
};

export default Profile;
