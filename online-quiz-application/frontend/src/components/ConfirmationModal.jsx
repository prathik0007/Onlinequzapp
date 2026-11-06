import React from 'react';

/**
 * ConfirmationModal - Stateless Component
 * Reusable modal for confirming quiz submission
 */
const ConfirmationModal = ({
  isOpen,
  title = 'Confirm Submission',
  message = 'Are you sure you want to submit your quiz? You cannot change your answers after submission.',
  onConfirm,
  onCancel,
  confirmText = 'Yes, Submit',
  cancelText = 'Cancel'
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

