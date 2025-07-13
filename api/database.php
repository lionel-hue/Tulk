<?php
header("Access-Control-Allow-Origin:*");
try {
    $pdo = new
        PDO(
            "mysql:host=".$_ENV['DB_HOST'].";dbname=".$_ENV['DB_NAME'].";charset=utf8",
            $_ENV["DB_USER"],
            $_ENV["DB_PASSWORD"]
        );

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    exit;
}
