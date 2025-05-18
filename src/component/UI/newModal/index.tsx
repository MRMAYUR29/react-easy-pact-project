// components/Modal.tsx
import { ReactNode } from "react";

interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: IModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>{title}</h3>
          <button onClick={onClose} className="modal-close">
            &times;
          </button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};