// Confirmation modal for deleting one shopping item.
function DeleteItemModal({ item, onClose, onConfirm }) {
  // No selected item means there is nothing to confirm, so do not render a modal.
  if (!item) return null;

  // Close only when clicking the overlay behind the modal.
  function handleOverlayClick(event) {
    if (event.target.classList.contains("modal-overlay")) {
      onClose();
    }
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-box">
        <h2>Delete item</h2>

        <p className="modal-warning-text">
          Are you sure you want to delete <strong>{item.name}</strong>?
        </p>

        <div className="modal-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>

          <button
            type="button"
            className="danger-modal-btn"
            onClick={() => onConfirm(item)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteItemModal;
