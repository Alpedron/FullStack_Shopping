import { useEffect, useState } from "react";

// Modal for editing an existing shopping item's name and quantity.
function EditItemModal({ item, onClose, onSave }) {
  // Local form values let the user make changes before committing them.
  const [quantity, setQuantity] = useState("");
  const [name, setName] = useState("");

  // When an item is selected for editing, prefill the form with its current values.
  useEffect(() => {
    if (item) {
      setQuantity(item.quantity);
      setName(item.name);
    }
  }, [item]);

  if (!item) return null;

  // Send the updated values back to App.jsx, where validation and API saving happen.
  function handleSubmit(event) {
    event.preventDefault();
    onSave(item, name, quantity);
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
        <h2>Edit item</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="number"
            min="1"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
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

export default EditItemModal;
