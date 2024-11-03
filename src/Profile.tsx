import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const personalityOptions = ["やさしい", "オラオラ", "しずか", "おもしろい"];

const Profile: React.FC = () => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [favoriteAppearance, setFavoriteAppearance] = useState('');
  const [selectedPersonalities, setSelectedPersonalities] = useState<string[]>([]);

  // 男性・女性による「好きな外見」の選択肢
  const maleAppearanceOptions = ['爽やか系', 'ワイルド系', '韓国系'];
  const femaleAppearanceOptions = ['かわいい系', 'キレイ系', 'かわキレイ系'];

  const navigate = useNavigate();

  const handleNext = () => {
    if (name.trim() && gender) {
      // 名前と性別をlocalStorageに保存
      const userData = { name, gender };
      localStorage.setItem('whisper-me-username', JSON.stringify(userData));
      
      // チャットルームリストページにリダイレクト
      navigate('/list');
    } else {
      alert('名前と性別を入力してください。');
    }
  };

  const togglePersonality = (personality: string) => {
    setSelectedPersonalities((prev) =>
      prev.includes(personality) ? prev.filter((p) => p !== personality) : [...prev, personality]
    );
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>プロフィール登録</h1>
        <p>名前と性別を入力してください</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="あなたの名前"
          className="profile-input"
        />
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="profile-select"
        >
          <option value="">性別を選択</option>
          <option value="male">男性</option>
          <option value="female">女性</option>
        </select>
        {gender && (
          <label className="profile-label">
            好きな外見:
            <select 
              className="profile-select" 
              value={favoriteAppearance} 
              onChange={(e) => setFavoriteAppearance(e.target.value)}
            >
              <option value="">選択してください</option>
              {(gender === 'male' ? maleAppearanceOptions : femaleAppearanceOptions).map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
        )}

        <div className="personality-container">
          <p>好きな性格を選択してください</p>
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
        </div>
        <button onClick={handleNext} className="profile-button">次へ</button>
      </div>
    </div>
  );
};

export default Profile;
