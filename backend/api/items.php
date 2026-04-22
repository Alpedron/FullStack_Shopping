<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

require_once __DIR__ . "/../db.php";

$method = $_SERVER["REQUEST_METHOD"];

try {
    // GET ITEMS FOR A STORE
    if ($method === "GET") {
        $store_id = filter_var($_GET["store_id"] ?? null, FILTER_VALIDATE_INT);

        if ($store_id === false || $store_id <= 0) {
            http_response_code(400);
            echo json_encode(["error" => "Valid store_id is required"]);
            exit;
        }

        $stmt = $pdo->prepare("SELECT id, name, quantity, checked, created_at FROM items WHERE store_id = :store_id ORDER BY created_at DESC");
        $stmt->execute([":store_id" => $store_id]);

        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($items);
        exit;
    }

    // ADD ITEM TO STORE
    if ($method === "POST") {
        $data = json_decode(file_get_contents("php://input"), true);

        if ($data === null) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid JSON body"]);
            exit;
        }

        // Support store_id from either the JSON body or the rewritten route /stores/{id}/items.
        $store_id = filter_var($data["store_id"] ?? ($_GET["store_id"] ?? null), FILTER_VALIDATE_INT);
        if ($store_id === false || $store_id <= 0) {
            http_response_code(400);
            echo json_encode(["error" => "Valid store_id is required"]);
            exit;
        }

        if (!isset($data["name"]) || trim($data["name"]) === "") {
            http_response_code(400);
            echo json_encode(["error" => "Item name is required"]);
            exit;
        }

        $name = trim($data["name"]);
        $quantity = isset($data["quantity"]) ? (int)$data["quantity"] : 1;

        // Validate that quantity is a positive integer.
        if ($quantity <= 0) {
            http_response_code(400);
            echo json_encode(["error" => "Quantity must be greater than 0"]);
            exit;
        }

        // Validate if store exists before adding an item to it.
        $checkStmt = $pdo->prepare("SELECT id FROM stores WHERE id = :id");
        $checkStmt->execute([":id" => $store_id]);

        if (!$checkStmt->fetch()) {
            http_response_code(404);
            echo json_encode(["error" => "Store not found"]);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO items (store_id, name, quantity) VALUES (:store_id, :name, :quantity)");
        $stmt->execute([
            ":store_id" => $store_id,
            ":name" => $name,
            ":quantity" => $quantity
        ]);

        http_response_code(201);
        echo json_encode([
            "message" => "Item added successfully",
            "id" => $pdo->lastInsertId(),
            "store_id" => $store_id,
            "name" => $name,
            "quantity" => $quantity
        ]);
        exit;
    }

    // UPDATE ITEM (CHECK / EDIT)
    if ($method === "PUT") {
        $data = json_decode(file_get_contents("php://input"), true);

        // avoids null entry if client sends invalid JSON or no body at all
        if ($data === null) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid JSON body"]);
            exit;
        }

        // Support id from either the JSON body or the rewritten route /items/{id}.
        $id = filter_var($_GET["id"] ?? ($data["id"] ?? null), FILTER_VALIDATE_INT);
        // Validate that the id is a positive integer.
        if ($id === false || $id <= 0) {
            http_response_code(400);
            echo json_encode(["error" => "Valid item id is required"]);
            exit;
        }

        $checkStmt = $pdo->prepare("SELECT * FROM items WHERE id = :id");
        $checkStmt->execute([":id" => $id]);
        $existing = $checkStmt->fetch(PDO::FETCH_ASSOC);

        // Check if the item exists before trying to update it.
        if (!$existing) {
            http_response_code(404);
            echo json_encode(["error" => "Item not found"]);
            exit;
        }

        $name = isset($data["name"]) ? trim($data["name"]) : $existing["name"];
        $quantity = isset($data["quantity"]) ? (int)$data["quantity"] : $existing["quantity"];
        $checked = isset($data["checked"]) ? (int)$data["checked"] : $existing["checked"];

        if ($name === "") {
            http_response_code(400);
            echo json_encode(["error" => "Item name is required"]);
            exit;
        }

        if ($quantity <= 0) {
            http_response_code(400);
            echo json_encode(["error" => "Quantity must be greater than 0"]);
            exit;
        }

        // Normalize checked to only 0 or 1.
        $checked = $checked === 1 ? 1 : 0;

        $stmt = $pdo->prepare("UPDATE items SET name = :name, quantity = :quantity, checked = :checked WHERE id = :id");
        $stmt->execute([
            ":name" => $name,
            ":quantity" => $quantity,
            ":checked" => $checked,
            ":id" => $id
        ]);

        echo json_encode([
            "message" => "Item updated successfully",
            "id" => $id,
            "checked" => $checked
        ]);
        exit;
    }


    // DELETE ITEM
    if ($method === "DELETE") {
        $id = filter_var($_GET["id"] ?? null, FILTER_VALIDATE_INT);

        // Validate that the id is a positive integer.
        if ($id === false || $id <= 0) {
            http_response_code(400);
            echo json_encode(["error" => "Valid item id is required"]);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM items WHERE id = :id");
        $stmt->execute([":id" => $id]);
        // Check if any row was actually deleted to determine if the item existed.
        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(["error" => "Item not found"]);
            exit;
        }

        echo json_encode(["message" => "Item deleted successfully"]);
        exit;
    }

    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Server error", "details" => $e->getMessage()]);
}