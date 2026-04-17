function ItemList({ selectedStore, items }) {
  return (
    <div className="item-list">
      <h2>
        {selectedStore ? `${selectedStore.name} Items` : "Items"}
      </h2>

      {!selectedStore ? (
        <p>Select a store to view its items.</p>
      ) : items.length === 0 ? (
        <p>No items for this store yet.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <span>
                {item.name} - Qty: {item.quantity} -{" "}
                {item.checked ? "Checked" : "Not Checked"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ItemList;