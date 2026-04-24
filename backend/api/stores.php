<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
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
    if ($method === "GET") {
        $stmt = $pdo->query("SELECT id, name, created_at FROM stores ORDER BY created_at DESC");
        $stores = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($stores);
        exit;
    }

    if ($method === "POST") {
        $data = json_decode(file_get_contents("php://input"), true);

        // avoids null entry if client sends invalid JSON or no body at all
        if ($data === null) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid JSON body"]);
            exit;
        }

        // Validate that the name is provided and not just whitespace.
        if (!isset($data["name"]) || trim($data["name"]) === "") {
            http_response_code(400);
            echo json_encode(["error" => "Store name is required"]);
            exit;
        }

        $name = trim($data["name"]);

        //validate name length to prevent database errors and ensure good UX
        if (strlen($name) > 255) {
            http_response_code(400);
            echo json_encode(["error" => "Store name must be 255 characters or less"]);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO stores (name) VALUES (:name)");
        $stmt->execute([":name" => $name]);

        http_response_code(201);
        echo json_encode([
            "message" => "Store created successfully",
            "id" => $pdo->lastInsertId(),
            "name" => $name
        ]);
        exit;
    }

    if ($method === "PUT") {
        $data = json_decode(file_get_contents("php://input"), true);

        // avoids null entry if client sends invalid JSON or no body at all
        if ($data === null) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid JSON body"]);
            exit;
        }
        $id = filter_var($_GET["id"] ?? ($data["id"] ?? null), FILTER_VALIDATE_INT);

        // Validate that the id is a positive integer.
        if ($id === false || $id <= 0) {
            http_response_code(400);
            echo json_encode(["error" => "Valid store id is required"]);
            exit;
        }

        // Validate that the name is provided and not just whitespace.
        if (!isset($data["name"]) || trim($data["name"]) === "") {
            http_response_code(400);
            echo json_encode(["error" => "Store name is required"]);
            exit;
        }

        $name = trim($data["name"]);

        //validate name length to prevent database errors and ensure good UX
        if (strlen($name) > 255) {
            http_response_code(400);
            echo json_encode(["error" => "Store name must be 255 characters or less"]);
            exit;
        }

        // Check if the store exists before trying to update it.
        $checkStmt = $pdo->prepare("SELECT id FROM stores WHERE id = :id");
        $checkStmt->execute([":id" => $id]);
        $existingStore = $checkStmt->fetch(PDO::FETCH_ASSOC);

        if (!$existingStore) {
            http_response_code(404);
            echo json_encode(["error" => "Store not found"]);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE stores SET name = :name WHERE id = :id");
        $stmt->execute([
            ":name" => $name,
            ":id" => $id
        ]);

        echo json_encode([
            "message" => "Store updated successfully",
            "id" => $id,
            "name" => $name
        ]);
        exit;
    }


    if ($method === "DELETE") {
        $id = filter_var($_GET["id"] ?? null, FILTER_VALIDATE_INT);
        // Validate that the id is a positive integer.
        if ($id === false || $id <= 0) {
            http_response_code(400);
            echo json_encode(["error" => "Valid store id is required"]);
            exit;
        }
        
        // Check if the store exists before trying to delete it.
        $checkStmt = $pdo->prepare("SELECT id FROM stores WHERE id = :id");
        $checkStmt->execute([":id" => $id]);
        $existingStore = $checkStmt->fetch(PDO::FETCH_ASSOC);

        if (!$existingStore) {
            http_response_code(404);
            echo json_encode(["error" => "Store not found"]);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM stores WHERE id = :id");
        $stmt->execute([":id" => $id]);

        echo json_encode(["message" => "Store deleted successfully"]);
        exit;
    }

    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
} catch (PDOException $e) {
    // MySQL duplicate entry error for UNIQUE store names.
    if ($e->getCode() == 23000) {
        http_response_code(409);
        echo json_encode(["error" => "Store name already exists"]);
        exit;
    }

    http_response_code(500);
    echo json_encode(["error" => "Server error", "details" => $e->getMessage()]);
}