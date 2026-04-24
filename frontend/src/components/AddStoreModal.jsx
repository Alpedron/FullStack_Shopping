import { useEffect, useState } from "react";

// Modal component for adding a new store (list)
function AddStoreModal({ isOpen, onClose, onSave }) {
  const [storeName, setStoreName] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setStoreName("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle form submission to save the new store
  function handleSubmit(event) {
    event.preventDefault();
    onSave(storeName);
  }

  // Close modal when clicking outside the modal box
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