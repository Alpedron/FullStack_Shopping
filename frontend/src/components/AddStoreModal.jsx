import { useEffect, useState } from "react";

// Modal for creating a new store/list.
function AddStoreModal({ isOpen, onClose, onSave }) {
  // Tracks the text typed into the store name input.
  const [storeName, setStoreName] = useState("");

  // Reset the input whenever the modal closes so it opens clean next time.
  useEffect(() => {
    if (!isOpen) {
      setStoreName("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Stop the browser form refresh and pass the store name up to App.jsx.
  function handleSubmit(event) {
    event.preventDefault();
    onSave(storeName);
  }

  // Close only when the dark overlay is clicked, not when clicking inside the modal box.
  function handleOverlayClick(event) {
    if (event.target.classList.contains("modal-overlay")) {
      onClose();
    }
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-box">
        <h2>Create a new list</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="New list"
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

export default AddStoreModal;
