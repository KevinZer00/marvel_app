import React from 'react';

function Modal({ isOpen, children, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
    <div className="modal-wrapper">
        <div className="modal-content" onClick={e => e.stopPropagation()}>
            {children}
        </div>
        <button onClick={onClose} className="close-button">X</button>
    </div>
</div>
    );
}

export default Modal;
