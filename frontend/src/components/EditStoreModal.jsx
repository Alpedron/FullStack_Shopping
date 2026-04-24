import { useEffect, useState } from "react";

function EditStoreModal({ store, onClose, onSave }) {
  const [storeName, setStoreName] = useState("");

  useEffect(() => {
    if (store) {
      setStoreName(store.name);
    }
  }, [store]);

  if (!store) return null;

  function handleSubmit(event) {
    event.preventDefault();
    onSave(store.id, storeName);
  }

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