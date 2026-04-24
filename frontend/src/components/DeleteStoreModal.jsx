// modal component for confirming deletion of a store and all its items
function DeleteStoreModal({ store, onClose, onConfirm }) {
  if (!store) return null;

  // close modal if user clicks outside the modal box
  function handleOverlayClick(event) {
    if (event.target.classList.contains("modal-overlay")) {
      onClose();
    }
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-box">
        <h2>Delete list</h2>

        <p style={{ color: "#ccc", marginTop: "0.5rem" }}>
          Are you sure you want to delete{" "}
          <strong>{store.name}</strong>?
        </p>

        <p style={{ color: "#ff8a80", fontSize: "0.9rem", marginTop: "0.5rem" }}>
          This will also delete all items in this list.
        </p>

        <div className="modal-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>

          <button
            type="button"
            style={{ background: "#ff6b6b", color: "white" }}
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