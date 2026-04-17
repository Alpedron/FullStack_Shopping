function StoreList({ stores, selectedStore, onSelectStore }) {
  return (
    <div className="store-list">
      <h2>Stores</h2>
      {stores.length === 0 ? (
        <p>No stores yet.</p>
      ) : (
        <ul>
          {stores.map((store) => (
            <li key={store.id}>
              <button
                className={selectedStore && selectedStore.id === store.id ? "active-store" : ""}
                onClick={() => onSelectStore(store)}
              >
                {store.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StoreList;