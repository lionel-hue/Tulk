<?php
header("Access-Control-Allow-Origin:*");
try {
    $pdo = new
        PDO(
            'mysql:host=127.0.0.1;dbname=Instaconn;charset=utf8',
            'root',
            ''
        );

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    exit;
}
