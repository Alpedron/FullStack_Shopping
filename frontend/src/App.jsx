import { useEffect, useState } from "react";
import "./App.css";
import {
  getStores,
  getItems,
  addStore,
  addItem,
  updateItem,
  deleteStore,
  deleteItem,
  updateStore,
} from "./services/api";
import AddStoreModal from "./components/AddStoreModal";
import EditStoreModal from "./components/EditStoreModal";
import DeleteStoreModal from "./components/DeleteStoreModal";

function App() {
  const [screen, setScreen] = useState("lists"); 
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [deletingStore, setDeletingStore] = useState(null);

  useEffect(() => {
    loadStores();
  }, []);

  async function loadStores() {
    try {
      const data = await getStores();
      setStores(data);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function loadItems(storeId) {
    try {
      const data = await getItems(storeId);
      setItems(data);
      setError("");
    } catch (err) {
      setItems([]);
      setError(err.message);
    }
  }

  function handleOpenAddStoreModal() {
    setShowAddStoreModal(true);
  }

  function handleCloseAddStoreModal() {
    setShowAddStoreModal(false);
  }

  async function handleSaveStore(storeName) {
    if (!storeName || !storeName.trim()) {
      setError("Please enter a store name.");
      return;
    }

    try {
      await addStore(storeName.trim());
      setError("");
      setShowAddStoreModal(false);
      await loadStores();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSaveStoreEdit(id, newName) {
    if (!newName || !newName.trim()) {
      setError("Please enter a store name.");
      return;
    }

    try {
      await updateStore(id, newName.trim());
      setError("");
      setEditingStore(null);
      await loadStores();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEditStore(store) {
    setEditingStore(store);
  }

  async function handleOpenStore(store) {
    setSelectedStore(store);
    setScreen("storeDetail");
    await loadItems(store.id);
  }

  function handleBackToLists() {
    setSelectedStore(null);
    setItems([]);
    setScreen("lists");
    setError("");
  }

  async function handleAddItem() {
    if (!selectedStore) return;

    const itemName = window.prompt("Enter item name:");

    if (!itemName || !itemName.trim()) return;

    try {
      await addItem(selectedStore.id, itemName.trim(), 1);
      setError("");
      await loadItems(selectedStore.id);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggleChecked(item) {
    try {
      const nextChecked = Number(item.checked) === 1 ? 0 : 1;

      await updateItem(
        item.id,
        nextChecked,
        item.name,
        Number(item.quantity)
      );

      setError("");
      await loadItems(selectedStore.id);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleEditItem(item) {
    const quantityInput = window.prompt(
      `Update quantity for ${item.name}:`,
      item.quantity
    );

    if (quantityInput === null) return;

    const quantityValue = Number(quantityInput);

    if (!Number.isInteger(quantityValue) || quantityValue <= 0) {
      setError("Please enter a valid quantity greater than 0.");
      return;
    }

    try {
      await updateItem(
        item.id,
        Number(item.checked),
        item.name,
        quantityValue
      );

      setError("");
      await loadItems(selectedStore.id);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleDeleteStore(store) {
    setDeletingStore(store);
  }

  async function confirmDeleteStore(store) {
    try {
      await deleteStore(store.id);
      setError("");
      setDeletingStore(null);
      await loadStores();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteItem(item) {
    const confirmed = window.confirm(`Delete ${item.name}?`);
    if (!confirmed) return;

    try {
      await deleteItem(item.id);
      setError("");
      await loadItems(selectedStore.id);
    } catch (err) {
      setError(err.message);
    }
  }

  function renderListsScreen() {
    return (
      <div className="mobile-screen">
        <div className="screen-header">
          <h1>Shopping List</h1>
        </div>

        {error && <p className="error-message">{error}</p>}

        {stores.length === 0 ? (
          <div className="empty-state">
            <p>No store list yet.</p>
            <p>Tap the add button to create your first store list.</p>
          </div>
        ) : (
          <div className="store-list-mobile">
            {stores.map((store) => (
             <div key={store.id} className="store-card-row">
              <button
                className="store-card"
                onClick={() => handleOpenStore(store)}
              >
                {store.name}
              </button>

              <button
                className="edit-btn"
                onClick={() => handleEditStore(store)}
                aria-label={`Edit ${store.name}`}
              >
                ✏️
              </button>

              <button
                className="trash-btn"
                onClick={() => handleDeleteStore(store)}
                aria-label={`Delete ${store.name}`}
              >
                🗑
              </button>
            </div>
            ))}
          </div>
        )}

        <button className="floating-add-btn" onClick={handleOpenAddStoreModal}>
          + Add Store
        </button>
      </div>
    );
  }

  function renderStoreDetailScreen() {
    return (
      <div className="mobile-screen">
        <div className="screen-header detail-header">
          <button className="back-btn" onClick={handleBackToLists}>
            ←
          </button>
          <h1>{selectedStore?.name}</h1>
        </div>

        {error && <p className="error-message">{error}</p>}

        {items.length === 0 ? (
          <div className="empty-state">
            <p>Let&apos;s plan your shopping.</p>
            <p>Tap the add button to start adding products.</p>
          </div>
        ) : (
          <div className="item-list-mobile">
            {items.map((item) => (
              <div key={item.id} className="item-card">
                <button
                  className={`item-radio ${Number(item.checked) === 1 ? "checked" : ""}`}
                  onClick={() => handleToggleChecked(item)}
                >
                  {Number(item.checked) === 1 ? "✓" : ""}
                </button>

                <button
                  className={`item-name-btn ${Number(item.checked) === 1 ? "crossed-out" : ""}`}
                  onClick={() => handleEditItem(item)}
                >
                  {item.name}
                  <span className="item-qty">Qty: {item.quantity}</span>
                </button>

                <button
                  className="trash-btn"
                  onClick={() => handleDeleteItem(item)}
                  aria-label={`Delete ${item.name}`}
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        )}

        <button className="floating-add-btn" onClick={handleAddItem}>
          + Add
        </button>
      </div>
    );
  }

  return (
    <>
      {screen === "lists" ? renderListsScreen() : renderStoreDetailScreen()}

      <AddStoreModal
        isOpen={showAddStoreModal}
        onClose={handleCloseAddStoreModal}
        onSave={handleSaveStore}
      />
      <EditStoreModal
        store={editingStore}
        onClose={() => setEditingStore(null)}
        onSave={handleSaveStoreEdit}
      />
      <DeleteStoreModal
        store={deletingStore}
        onClose={() => setDeletingStore(null)}
        onConfirm={confirmDeleteStore}
      />
    </>
  );
}

export default App;