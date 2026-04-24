const BASE_URL = "/ShoppingList/backend/api";

export async function getStores() {
  const response = await fetch(`${BASE_URL}/stores`);
  if (!response.ok) {
    throw new Error("Failed to fetch stores");
  }
  return response.json();
}

export async function getItems(storeId) {
  const response = await fetch(`${BASE_URL}/stores/${storeId}/items`);
  if (!response.ok) {
    throw new Error("Failed to fetch items");
  }
  return response.json();
}

export async function addStore(name) {
  const response = await fetch(`${BASE_URL}/stores`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to add store");
  }

  return response.json();
}

export async function updateStore(id, name) {
  const response = await fetch(`${BASE_URL}/stores/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, name }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update store");
  }

  return response.json();
}

export async function addItem(storeId, name, quantity) {
  const response = await fetch(`${BASE_URL}/stores/${storeId}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, quantity }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to add item");
  }

  return response.json();
}

export async function updateItem(id, checked, name, quantity) {
  const response = await fetch(`${BASE_URL}/items/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ checked, name, quantity }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update item");
  }

  return response.json();
}

export async function deleteItem(id) {
  const response = await fetch(`${BASE_URL}/items/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to delete item");
  }

  return response.json();
}

export async function deleteStore(id) {
  const response = await fetch(`${BASE_URL}/stores/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to delete store");
  }

  return response.json();
}