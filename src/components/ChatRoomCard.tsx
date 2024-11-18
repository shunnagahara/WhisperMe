import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './../css/chatRoomCard.css'

type ChatRoomCardProps = {
    title: string;
    description: string;
    image: string;
    link: string;
    matchingRate?: string;
    showHeart: boolean;
}

const ChatRoomCard: React.FC<ChatRoomCardProps> = ({ title, description, image, link, matchingRate, showHeart }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);

  const handleTooltipToggle = (event: React.MouseEvent | React.TouchEvent) => {
      event.preventDefault(); // タップ時にリンクが発動しないように防止
      setIsTooltipVisible(!isTooltipVisible);
  };

  return (
    <Link to={link} className="card-link">
        <div className="card pic-image">
            {showHeart ? (
                <div 
                className="card-heart-container"
                onClick={handleTooltipToggle}
                >
                    <div className="card-heart">❤️</div>
                    <div className="card-heart-tooltip">
                        {matchingRate}
                    </div>
                </div>
            ) : null}
            <img className="card-image" src={image} alt={title} />
            <div className="card-box">
                <h2 className="card-title">{title}</h2>
                <p className="card-description">{description}</p>
            </div>
        </div>
    </Link>
)};

export default ChatRoomCard;
