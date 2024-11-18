import React from 'react';
import NameIcon from './NameIcon'; // Ensure the path to NameIcon is correct.

type BalloonProps = {
  userName: string;
  message: string;
  isCurrentUser: boolean;
};

const Balloon: React.FC<BalloonProps> = ({ userName, message, isCurrentUser }) => {
  return (
    <div className={`balloon_${isCurrentUser ? 'r' : 'l'}`}>
      <div className="faceicon">
        <NameIcon
          userName={userName}
          option={{ foreColor: isCurrentUser ? '#69C' : '#969' }}
        />
      </div>
      <div style={{ marginLeft: '3px' }}>
        <p className="says">{message}</p>
      </div>
    </div>
  );
};

export default Balloon;
