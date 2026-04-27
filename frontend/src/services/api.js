// Base path for all backend API requests.
const BASE_URL = "/ShoppingList/backend/api";

// Reads the server response, converts it from JSON, and throws clear errors
// when the backend sends invalid JSON or a failed HTTP status.
async function handleResponse(response) {
  const text = await response.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Server did not return valid JSON.");
  }

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

// Fetches every saved store from the backend.
export async function getStores() {
  const response = await fetch(`${BASE_URL}/stores.php`);
  return handleResponse(response);
}

// Fetches all shopping items that belong to one store.
export async function getItems(storeId) {
  const response = await fetch(`${BASE_URL}/items.php?store_id=${storeId}`);
  return handleResponse(response);
}

// Creates a new store with the provided name.
export async function addStore(name) {
  const response = await fetch(`${BASE_URL}/stores.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  return handleResponse(response);
}

// Updates an existing store's name.
export async function updateStore(id, name) {
  const response = await fetch(`${BASE_URL}/stores.php?id=${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, name }),
  });

  return handleResponse(response);
}

// Deletes a store by its id.
export async function deleteStore(id) {
  const response = await fetch(`${BASE_URL}/stores.php?id=${id}`, {
    method: "DELETE",
  });

  return handleResponse(response);
}

// Adds a shopping item to a specific store.
export async function addItem(storeId, name, quantity) {
  const response = await fetch(`${BASE_URL}/items.php?store_id=${storeId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, quantity }),
  });

  return handleResponse(response);
}

// Updates an item's checked state, name, and quantity.
export async function updateItem(id, checked, name, quantity) {
  const response = await fetch(`${BASE_URL}/items.php?id=${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, checked, name, quantity }),
  });

  return handleResponse(response);
}

// Deletes a shopping item by its id.
export async function deleteItem(id) {
  const response = await fetch(`${BASE_URL}/items.php?id=${id}`, {
    method: "DELETE",
  });

  return handleResponse(response);
}
