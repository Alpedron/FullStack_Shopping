const BASE_URL = "/ShoppingList/backend/api";

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

export async function getStores() {
  const response = await fetch(`${BASE_URL}/stores.php`);
  return handleResponse(response);
}

export async function getItems(storeId) {
  const response = await fetch(`${BASE_URL}/items.php?store_id=${storeId}`);
  return handleResponse(response);
}

export async function addStore(name) {
  const response = await fetch(`${BASE_URL}/stores.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  return handleResponse(response);
}

export async function updateStore(id, name) {
  const response = await fetch(`${BASE_URL}/stores.php?id=${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, name }),
  });

  return handleResponse(response);
}

export async function deleteStore(id) {
  const response = await fetch(`${BASE_URL}/stores.php?id=${id}`, {
    method: "DELETE",
  });

  return handleResponse(response);
}

export async function addItem(storeId, name, quantity) {
  const response = await fetch(`${BASE_URL}/items.php?store_id=${storeId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, quantity }),
  });

  return handleResponse(response);
}

export async function updateItem(id, checked, name, quantity) {
  const response = await fetch(`${BASE_URL}/items.php?id=${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, checked, name, quantity }),
  });

  return handleResponse(response);
}

export async function deleteItem(id) {
  const response = await fetch(`${BASE_URL}/items.php?id=${id}`, {
    method: "DELETE",
  });

  return handleResponse(response);
}