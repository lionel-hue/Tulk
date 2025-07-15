<?php
header("Access-Control-Allow-Origin:*");
require_once "envloader.php";
loadEnvFile(__DIR__ . '/../.env');

try {

    $pdo = new PDO(
        "pgsql:host=" . $_ENV['DB_HOST'] . ";port=" . $_ENV["DB_PORT"] . ";dbname=" . $_ENV['DB_NAME'] . ";sslmode=require",
        $_ENV["DB_USER"],
        $_ENV["DB_PASS"]
    );

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    exit;
}
