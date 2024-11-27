import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { handleUserCountChange } from '../service/presentation/chatRoomListService';
import './../css/chatRoomCard.css'

type ChatRoomCardProps = {
    title: string;
    description: string;
    image: string;
    link: string;
    matchingRate?: string;
    showHeart: boolean;
    userCount: number;
}

const ChatRoomCard: React.FC<ChatRoomCardProps> = ({ title, description, image, link, matchingRate, showHeart, userCount }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);
  const [animateChange, setAnimateChange] = useState<boolean>(false);
  const prevUserCountRef = useRef(userCount);

  const handleTooltipToggle = (event: React.MouseEvent | React.TouchEvent) => {
      event.preventDefault();
      setIsTooltipVisible(!isTooltipVisible);
  };

  useEffect(() => {
    const cleanup = handleUserCountChange(userCount, prevUserCountRef.current, setAnimateChange);
    prevUserCountRef.current = userCount;
    return cleanup;
  }, [userCount]);

  return (
    <Link to={link} className="card-link">
        <div className={`card pic-image ${animateChange ? 'user-change' : ''}`}>
            {showHeart ? (
                <div 
                className="card-heart-container"
                onClick={handleTooltipToggle}
                >
                    <div className="card-heart">❤️</div>
                    <div 
                     className="card-heart-tooltip"
                     style={{ display: isTooltipVisible ? 'block' : 'none' }}
                    >
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
