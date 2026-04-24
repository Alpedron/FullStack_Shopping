import { useEffect, useState } from "react";

// Modal component for adding a new item to the shopping list
function AddItemModal({ isOpen, onClose, onSave }) {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!isOpen) {
      setItemName("");
      setQuantity(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // validation and call onSave with item name and quantity
  function handleSubmit(event) {
    event.preventDefault();
    onSave(itemName, quantity);
  }

  // close modal if clicking outside the modal box
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