<?php
session_start();
header('Content-Type: application/json');

include("../database.php");

// Vérifier si l'utilisateur est connecté
if (!isset($_SESSION['id_uti'])) {
    echo json_encode(['error' => 'Non autorisé']);
    exit;
}

$id_uti = $_SESSION['id_uti'];
$conversation_id = $_GET['conversation_id'] ?? null;

if (!$conversation_id) {
    echo json_encode(['error' => 'ID de conversation manquant']);
    exit;
}


try {
    
    // Récupérer les messages entre l'utilisateur actuel et l'utilisateur sélectionné
    $sql = "
        SELECT m.*, u.nom, u.prenom, u.image
        FROM Message m
        JOIN Utilisateur u ON m.id_uti_1 = u.id
        WHERE (m.id_uti_1 = ? AND m.id_uti_2 = ?) 
           OR (m.id_uti_1 = ? AND m.id_uti_2 = ?)
        ORDER BY m.date ASC
    ";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id_uti, $conversation_id, $conversation_id, $id_uti]);
    
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($messages);
    
} catch (PDOException $e) {
    echo json_encode(['error' => 'Erreur de base de données: ' . $e->getMessage()]);
}
?>