import React, { ReactNode } from 'react';
import './../css/modal.css';

interface ModalProps {
  show: boolean;
  handleClose: () => void;
  title: string;
  message: string;
  subMessage?: string;
  countdown?: string;
  children?: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, handleClose, title, message, subMessage, countdown, children }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="modal-close" onClick={handleClose}>
          &times;
        </span>
        <div className="modal-header">{title}</div>
        <div className="modal-text">{message}</div>
        <div className="modal-text">{subMessage}</div>
        <div className="modal-countdown-text">{countdown}</div>
        {children}
      </div>
    </div>
  );
};

export default Modal;