import { useEffect, useState } from "react";
import "./App.css";
import StoreList from "./components/StoreList";
import ItemList from "./components/ItemList";
import { getStores, getItems } from "./services/api";

function App() {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

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

  async function handleSelectStore(store) {
    setSelectedStore(store);

    try {
      const data = await getItems(store.id);
      setItems(data);
      setError("");
    } catch (err) {
      setError(err.message);
      setItems([]);
    }
  }

  return (
    <div className="app-container">
      <h1>Shopping List App</h1>

      {error && <p className="error-message">{error}</p>}

      <div className="main-layout">
        <StoreList
          stores={stores}
          selectedStore={selectedStore}
          onSelectStore={handleSelectStore}
        />
        <ItemList selectedStore={selectedStore} items={items} />
      </div>
    </div>
  );
}

export default App;