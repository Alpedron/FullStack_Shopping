function DeleteItemModal({ item, onClose, onConfirm }) {
  if (!item) return null;

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