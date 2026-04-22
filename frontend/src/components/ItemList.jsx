function ItemList({
  selectedStore,
  items,
  editingQuantities = {},
  onToggleChecked,
  onQuantityInputChange,
  onUpdateQuantity,
  onDeleteItem,
}) {
  return (
    <div className="item-list">
      <h2>{selectedStore ? `${selectedStore.name} Items` : "Items"}</h2>

      {!selectedStore ? (
        <p>Select a store to view its items.</p>
      ) : items.length === 0 ? (
        <p>No items for this store yet.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id} className="item-row">
              <div className="item-main">
                <label className="item-check">
                  <input
                    type="checkbox"
                    checked={Boolean(Number(item.checked))}
                    onChange={() => onToggleChecked?.(item)}
                  />
                  <span
                    className={Boolean(Number(item.checked)) ? "checked-item" : ""}
                  >
                    {item.name}
                  </span>
                </label>

                <div className="item-actions">
                  <div className="quantity-editor">
                    <label htmlFor={`qty-${item.id}`} className="sr-only">
                      Quantity for {item.name}
                    </label>
                    <input
                      id={`qty-${item.id}`}
                      type="number"
                      min="1"
                      value={editingQuantities[item.id] ?? item.quantity}
                      onChange={(e) => onQuantityInputChange?.(item.id, e.target.value)}
                    />
                    <button
                      type="button"
                      className="update-btn"
                      onClick={() => onUpdateQuantity?.(item)}
                    >
                      Update
                    </button>
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() => onDeleteItem?.(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ItemList;