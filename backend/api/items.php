<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
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

        if (!isset($data["name"]) || trim($data["name"]) === "") {
            http_response_code(400);
            echo json_encode(["error" => "Store name is required"]);
            exit;
        }

        $name = trim($data["name"]);

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

    if ($method === "DELETE") {
        if (!isset($_GET["id"]) || !is_numeric($_GET["id"])) {
            http_response_code(400);
            echo json_encode(["error" => "Valid store id is required"]);
            exit;
        }

        $id = (int) $_GET["id"];

        $stmt = $pdo->prepare("DELETE FROM stores WHERE id = :id");
        $stmt->execute([":id" => $id]);

        echo json_encode(["message" => "Store deleted successfully"]);
        exit;
    }

    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Server error", "details" => $e->getMessage()]);
}