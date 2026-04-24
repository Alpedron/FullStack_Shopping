import { useEffect, useState } from "react";

// Modal component for editing an item - shows a form with name and quantity inputs, and save/cancel buttons
function EditItemModal({ item, onClose, onSave }) {
  const [quantity, setQuantity] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (item) {
      setQuantity(item.quantity);
      setName(item.name);
    }
  }, [item]);

  if (!item) return null;

  // handle form submission - call onSave with the updated item details
  function handleSubmit(event) {
    event.preventDefault();
    onSave(item, name, quantity);
  }

  // close the modal if the user clicks outside the modal box
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