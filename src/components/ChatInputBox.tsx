import React, { useState } from 'react';

type ChatInputBoxProps = {
  userName: string;
  onSendMessage: (message: string) => Promise<void>;
};

const ChatInputBox: React.FC<ChatInputBoxProps> = ({ userName, onSendMessage }) => {
  const [inputMsg, setInputMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputMsg.trim() !== '') {
      await onSendMessage(inputMsg);
      setInputMsg('');
    }
  };

  return (
    <div className="chatbox">
      <form className="chatform" onSubmit={handleSubmit}>
        <div>{userName}</div>
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder=""
        />
        <input
          type="image"
          src="../img/airplane.png"
          alt="Send Button"
        />
      </form>
    </div>
  );
};

export default ChatInputBox;
