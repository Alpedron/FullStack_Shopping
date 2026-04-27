// Confirmation modal for deleting a store/list and all of its items.
function DeleteStoreModal({ store, onClose, onConfirm }) {
  // No selected store means there is nothing to confirm, so do not render a modal.
  if (!store) return null;

  // Close only when clicking the overlay behind the modal.
  function handleOverlayClick(event) {
    if (event.target.classList.contains("modal-overlay")) {
      onClose();
    }
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-box">
        <h2>Delete list</h2>

        <p className="modal-warning-text">
          Are you sure you want to delete{" "}
          <strong>{store.name}</strong>?
        </p>

        <p className="modal-danger-text">
          This will also delete all items in this list.
        </p>

        <div className="modal-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>

          <button
            type="button"
            className="danger-modal-btn"
            onClick={() => onConfirm(store)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteStoreModal;
