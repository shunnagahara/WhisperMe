import React from "react";

type LoadingProps = {
  message?: string; // ローディング中のメッセージ
};

const Loading: React.FC<LoadingProps> = ({ message = "読み込み中..." }) => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
};

export default Loading;
