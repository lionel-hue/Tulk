<?php
session_start();
include("../database.php");
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

function image_error($msg) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => $msg]);
    exit;
}

$nom = $_POST['nom'] ?? '';
$prenom = $_POST['prenom'] ?? '';
$photo_url = null;

// Gestion de la photo

    $filename = include("../code_de_gestion_d_image.php");
    $photo_url = $filename;


// Récupère l'ID utilisateur connecté depuis la session
$user_id = $_SESSION['id_uti'] ?? null;

if ($user_id) {
    try {
        if ($photo_url != null) {
            // Mise à jour avec image
            $stmt = $pdo->prepare("UPDATE utilisateur SET nom=:nom, prenom=:prenom, image=:image WHERE id=:id");
            $stmt->execute([
                ':nom' => $nom,
                ':prenom' => $prenom,
                ':image' => $photo_url,
                ':id' => $user_id
            ]);
        } else {
            // Mise à jour sans image
            $stmt = $pdo->prepare("UPDATE utilisateur SET nom=:nom, prenom=:prenom WHERE id=:id");
            $stmt->execute([
                ':nom' => $nom,
                ':prenom' => $prenom,
                ':id' => $user_id
            ]);
        }

        echo json_encode([
            'success' => true,
            'nom' => $nom,
            'prenom' => $prenom,
            'photo_url' => $photo_url // Attention, ici c'est $photo_url et pas $filename
        ]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Utilisateur non connecté']);
}   


































exit;
?>