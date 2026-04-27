// React hooks, page styles, backend API helpers, and modal components.
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
import AddItemModal from "./components/AddItemModal";
import EditItemModal from "./components/EditItemModal";
import DeleteItemModal from "./components/DeleteItemModal";
import EmptyState from "./components/EmptyState";

// Main App component
function App() {
  // Controls which screen is visible: the store list or one store's item detail view.
  const [screen, setScreen] = useState("lists");

  // Data loaded from the backend.
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [items, setItems] = useState([]);

  // Shared error message shown near the top of the current screen.
  const [error, setError] = useState("");

  // Store modal state. A true/null value tells React which modal should be open.
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [deletingStore, setDeletingStore] = useState(null);

  // Item modal state for adding, editing, and confirming delete actions.
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  // Load the store list once when the app first opens.
  useEffect(() => {
    loadStores();
  }, []);

  // Load stores from the API and save them in component state.
  async function loadStores() {
    try {
      const data = await getStores();
      setStores(data);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  // Load all items for the selected store. If loading fails, clear stale items.
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

  // Open the add-store modal.
  function handleOpenAddStoreModal() {
    setShowAddStoreModal(true);
  }

  // Close the add-store modal without saving.
  function handleCloseAddStoreModal() {
    setShowAddStoreModal(false);
  }

  // Validate and save a new store, then refresh the store list.
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

  // Validate and save an edited store name, then refresh the store list.
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

  // Store the selected store in state so the edit modal opens with its values.
  function handleEditStore(store) {
    setEditingStore(store);
  }

  // Switch to a store's detail screen and load the items that belong to it.
  async function handleOpenStore(store) {
    setSelectedStore(store);
    setScreen("storeDetail");
    await loadItems(store.id);
  }

  // Reset detail-screen state and return to the main store list.
  function handleBackToLists() {
    setSelectedStore(null);
    setItems([]);
    setScreen("lists");
    setError("");
  }

  // Validate and save a new item for the selected store, then refresh the item list.
  async function handleSaveItem(itemName, quantityInput) {
    if (!selectedStore) return;

    const quantityValue = Number(quantityInput);

    if (!itemName || !itemName.trim()) {
      setError("Please enter an item name.");
      return;
    }

    if (!Number.isInteger(quantityValue) || quantityValue <= 0) {
      setError("Please enter a valid quantity greater than 0.");
      return;
    }

    try {
      await addItem(selectedStore.id, itemName.trim(), quantityValue);
      setError("");
      setShowAddItemModal(false);
      await loadItems(selectedStore.id);
    } catch (err) {
      setError(err.message);
    }
  }

  // Toggle an item's checked value in the backend, then reload the item list.
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

  // Store the selected item in state so the edit modal opens with its values.
  function handleEditItem(item) {
    setEditingItem(item);
  }

  // Validate and save item edits while keeping the current checked state.
  async function handleSaveItemEdit(item, nameInput, quantityInput) {
    const quantityValue = Number(quantityInput);

    if (!nameInput || !nameInput.trim()) {
      setError("Item name is required.");
      return;
    }

    if (!Number.isInteger(quantityValue) || quantityValue <= 0) {
      setError("Please enter a valid quantity greater than 0.");
      return;
    }

    try {
      await updateItem(
        item.id,
        Number(item.checked),
        nameInput.trim(),
        quantityValue
      );

      setError("");
      setEditingItem(null);
      await loadItems(selectedStore.id);
    } catch (err) {
      setError(err.message);
    }
  }

  // Store the selected store in state so the delete confirmation modal opens.
  function handleDeleteStore(store) {
    setDeletingStore(store);
  }

  // Delete the confirmed store from the backend, then refresh the store list.
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

  // Store the selected item in state so the delete confirmation modal opens.
  function handleDeleteItem(item) {
    setDeletingItem(item);
  }

  // Delete the confirmed item from the backend, then refresh the item list.
  async function confirmDeleteItem(item) {
    try {
      await deleteItem(item.id);
      setError("");
      setDeletingItem(null);
      await loadItems(selectedStore.id);
    } catch (err) {
      setError(err.message);
    }
  }

  // Render the main shopping list screen with store cards and an add-store button.
  function renderListsScreen() {
    return (
      <div className="mobile-screen">
        <div className="screen-header">
          <h1>Adrianna's Shopping List</h1>
        </div>

        {error && <p className="error-message">{error}</p>}

        {/* Show a friendly empty state until the first store is added. */}
        {stores.length === 0 ? (
          <EmptyState
            title="No store list yet."
            message="Tap the add button to create your first store list."
          />
        ) : (
          <div className="store-list-mobile">
            {stores.map((store) => (
             <div key={store.id} className="store-card-row">
              {/* Opens this store's item list. */}
              <button
                className="store-card"
                onClick={() => handleOpenStore(store)}
              >
                {store.name}
              </button>

             {/* Opens the edit-store modal for this store. */}
             <button
                className="edit-btn icon-btn"
                onClick={() => handleEditStore(store)}
                aria-label={`Edit ${store.name}`}
              >
                <svg
                  className="action-icon"
                  viewBox="0 0 528.899 528.899"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z M518.113,63.177l-47.981-47.981 c-18.543-18.543-48.653-18.543-67.259,0l-45.961,45.961l107.59,107.59l53.611-53.611 C532.495,100.753,532.495,77.559,518.113,63.177z M0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069 L27.473,390.597L0.3,512.69z" />
                </svg>
              </button>

              {/* Opens the delete-store confirmation modal for this store. */}
              <button
                className="trash-btn icon-btn"
                onClick={() => handleDeleteStore(store)}
                aria-label={`Delete ${store.name}`}
              >
                <svg
                  className="action-icon"
                  viewBox="0 0 20 20"
                  fill="transparent"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 3h6m-9 3h12M8 6v12m4-12v12m4-12v12M5 6l1 14h12l1-14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
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


  // Render the selected store's item screen with check, edit, delete, and add actions.
  function renderStoreDetailScreen() {
    return (
      <div className="mobile-screen">
        <div className="screen-header detail-header">
          <button className="back-btn" onClick={handleBackToLists}>
            ←
          </button>
          <h1>{selectedStore?.name}</h1>
        </div>

        <p className="screen-helper-text">
          Click on item to edit name/quantity
        </p>

        {error && <p className="error-message">{error}</p>}

        {/* Show a different empty state when this store has no items yet. */}
        {items.length === 0 ? (
          <EmptyState
            title="Let's plan your shopping."
            message="Tap the add button to start adding products."
          />
        ) : (
          <div className="item-list-mobile">
            {items.map((item) => (
              <div key={item.id} className="item-card">
                {/* Marks the item complete/incomplete. */}
                <button
                  className={`item-radio ${Number(item.checked) === 1 ? "checked" : ""}`}
                  onClick={() => handleToggleChecked(item)}
                >
                  {Number(item.checked) === 1 ? "✓" : ""}
                </button>

                {/* Opens the edit-item modal when the item text is clicked. */}
                <button
                  className={`item-name-btn ${Number(item.checked) === 1 ? "crossed-out" : ""}`}
                  onClick={() => handleEditItem(item)}
                >
                  {item.name}
                  <span className="item-qty">Qty: {item.quantity}</span>
                </button>

               {/* Opens the edit-item modal from the pencil icon. */}
               <button
                  className="edit-btn icon-btn"
                  onClick={() => handleEditItem(item)}
                  aria-label={`Edit ${item.name}`}
                >
                  <svg
                    className="action-icon"
                    viewBox="0 0 528.899 528.899"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z M518.113,63.177l-47.981-47.981 c-18.543-18.543-48.653-18.543-67.259,0l-45.961,45.961l107.59,107.59l53.611-53.611 C532.495,100.753,532.495,77.559,518.113,63.177z M0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069 L27.473,390.597L0.3,512.69z" />
                  </svg>
                </button>

                {/* Opens the delete-item confirmation modal. */}
                <button
                  className="trash-btn icon-btn"
                  onClick={() => handleDeleteItem(item)}
                  aria-label={`Delete ${item.name}`}
                >
                  <svg
                    className="action-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M9 3h6m-9 3h12M8 6v12m4-12v12m4-12v12M5 6l1 14h12l1-14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <button className="floating-add-btn" onClick={() => setShowAddItemModal(true)}>
          + Add
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Pick which main screen to show based on the current screen state. */}
      {screen === "lists" ? renderListsScreen() : renderStoreDetailScreen()}

      {/* Modals live here so they can appear over either main screen. */}
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
      <AddItemModal
        isOpen={showAddItemModal}
        onClose={() => setShowAddItemModal(false)}
        onSave={handleSaveItem}
      />
      <EditItemModal
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSave={handleSaveItemEdit}
      />
      <DeleteItemModal
        item={deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={confirmDeleteItem}
      />
    </>
  );
}

export default App;
