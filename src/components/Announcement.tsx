import React from 'react';

type AnnouncementProps = {
  message: string;
};

const Announcement: React.FC<AnnouncementProps> = ({ message }) => {
  return (
    <div className="chatroom-logs-announce-container">
      <p className="chatroom-logs-announce-message">{message}</p>
    </div>
  );
};

export default Announcement;
