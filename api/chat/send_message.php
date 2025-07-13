<?php
require_once __DIR__."/../vendor/autoload.php";
session_start();

header('Content-Type: application/json');

// Vérifier si l'utilisateur est connecté
if (!isset($_SESSION['id_uti'])) {
    echo json_encode(['error' => 'Non autorisé']);
    exit;
}

$id_uti = $_SESSION['id_uti'];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Méthode non autorisée']);
    exit;
}

$texte = $_POST['texte'] ?? '';
$id_uti_2 = $_POST['id_uti_2'] ?? null;
$image = '';

// Gérer l'upload d'image si présent
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = '../../assets/images/messages/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    
    $fileName = uniqid() . '_' . $_FILES['image']['name'];
    $uploadPath = $uploadDir . $fileName;
    
    if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadPath)) {
        $image = './assets/images/messages/' . $fileName;
    }
}


if (empty($texte) && empty($image)) {
    echo json_encode(['error' => 'Message vide']);
    exit;
}

if (!$id_uti_2) {
    echo json_encode(['error' => 'Destinataire manquant']);
    exit;
}

try {
    // Connexion à la base de données
    $pdo = new PDO("mysql:host=localhost;dbname=Instaconn", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Insérer le message
    $sql = "INSERT INTO Message (texte, image, id_uti_1, id_uti_2, date) VALUES (?, ?, ?, ?, NOW())";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$texte, $image, $id_uti, $id_uti_2]);
    
    echo json_encode(['success' => true, 'message_id' => $pdo->lastInsertId()]);
    
} catch (PDOException $e) {
    echo json_encode(['error' => 'Erreur de base de données: ' . $e->getMessage()]);
}
?>