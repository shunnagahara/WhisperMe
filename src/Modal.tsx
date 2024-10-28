import React, { ReactNode } from 'react';
import './Modal.css';

interface ModalProps {
  show: boolean;
  handleClose: () => void;
  children?: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, handleClose, children }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="modal-close" onClick={handleClose}>
          &times;
        </span>
        {children}
      </div>
    </div>
  );
};

export default Modal;