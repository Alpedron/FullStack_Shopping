import { useEffect, useState } from "react";

// Modal for adding a new shopping item to the selected store/list.
function AddItemModal({ isOpen, onClose, onSave }) {
  // Local form values for the item being created.
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Reset the form whenever the modal closes.
  useEffect(() => {
    if (!isOpen) {
      setItemName("");
      setQuantity(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // App.jsx handles validation and saving; this only sends the entered values up.
  function handleSubmit(event) {
    event.preventDefault();
    onSave(itemName, quantity);
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
        <h2>Add item</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Item name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            autoFocus
          />

          <input
            type="number"
            min="1"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
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

export default AddItemModal;
