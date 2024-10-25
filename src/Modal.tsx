import React, { ReactNode }  from 'react';
import './App.css'; // 必要に応じてスタイルを調整

interface ModalProps {
    show: boolean;
    handleClose: () => void;
    children?: ReactNode;
  }

const Modal: React.FC<ModalProps> = ({ show, handleClose, children }) => {
    if (!show) return null;
    return (
      <div className="modal" onClick={handleClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <span className="close" onClick={handleClose}>
            &times;
          </span>
          {children}
        </div>
      </div>
    );
  };
  

export default Modal;