import React, { useState } from 'react';
import './../css/chatRoomCard.css'

// 型定義
// interface ChatRoom {
//     id: string;
//     title: string;
//     description: string;
//     image: string;
// }

type ChatRoomCardProps = {
    title: string;
    description: string;
    image: string;
    link: string;
}

// カードコンポーネント
const ChatRoomCard: React.FC<ChatRoomCardProps> = ({ title, description, image, link }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);

  const handleTooltipToggle = (event: React.MouseEvent | React.TouchEvent) => {
      event.preventDefault(); // タップ時にリンクが発動しないように防止
      setIsTooltipVisible(!isTooltipVisible);
  };

  return (
    <a href={link} className="card-link">
        <div className="card pic-image">
            <div 
            className="card-heart-container"
            onClick={handleTooltipToggle}
            >
                <div className="card-heart">❤️</div>
                <div className="card-heart-tooltip">
                    マッチ率: 99%
                </div>
            </div>
            <img className="card-image" src={image} alt={title} />
            <div className="card-box">
                <h2 className="card-title">{title}</h2>
                <p className="card-description">{description}</p>
            </div>
        </div>
    </a>
)};

export default ChatRoomCard;
