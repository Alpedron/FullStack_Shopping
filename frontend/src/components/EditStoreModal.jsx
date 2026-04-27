import { useEffect, useState } from "react";

// Modal for editing an existing store/list name.
function EditStoreModal({ store, onClose, onSave }) {
  // Local copy of the name so the user can edit before saving.
  const [storeName, setStoreName] = useState("");

  // When a store is selected for editing, prefill the input with its current name.
  useEffect(() => {
    if (store) {
      setStoreName(store.name);
    }
  }, [store]);

  if (!store) return null;

  // Send the edited name back to App.jsx, where the API update happens.
  function handleSubmit(event) {
    event.preventDefault();
    onSave(store.id, storeName);
  }

  // Close only when clicking the overlay behind the modal.
  function handleOverlayClick(event) {
    if (event.target.classList.contains("modal-overlay")) {
      onClose();
    }
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-box">
        <h2>Edit list</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Store name"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            autoFocus
          />

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditStoreModal;
