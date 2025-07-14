<?php
require_once "../envloader.php";
loadEnvFile(__DIR__.'/../.env');
session_start();

include("../database.php");
header('Content-Type: application/json');

// Vérifier si l'utilisateur est connecté
if (!isset($_SESSION['id_uti'])) {
    echo json_encode(['error' => 'Non autorisé']);
    exit;
}

$id_uti = $_SESSION['id_uti'];

try {
    // Récupérer les conversations de l'utilisateur avec le dernier message
    $sql = "
        SELECT DISTINCT 
            u.id,
            u.nom,
            u.prenom,
            u.image,
            (SELECT m.texte 
             FROM Message m 
             WHERE (m.id_uti_1 = ? AND m.id_uti_2 = u.id) 
                OR (m.id_uti_1 = u.id AND m.id_uti_2 = ?) 
             ORDER BY m.date DESC 
             LIMIT 1) as dernierMessage,
            (SELECT m.date 
             FROM Message m 
             WHERE (m.id_uti_1 = ? AND m.id_uti_2 = u.id) 
                OR (m.id_uti_1 = u.id AND m.id_uti_2 = ?) 
             ORDER BY m.date DESC 
             LIMIT 1) as derniereDate
        FROM Utilisateur u
        WHERE u.id IN (
            SELECT DISTINCT 
                CASE 
                    WHEN m.id_uti_1 = ? THEN m.id_uti_2 
                    ELSE m.id_uti_1 
                END as contact_id
            FROM Message m 
            WHERE m.id_uti_1 = ? OR m.id_uti_2 = ?
        )
        ORDER BY derniereDate DESC
    ";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id_uti, $id_uti, $id_uti, $id_uti, $id_uti, $id_uti, $id_uti]);
    
    $conversations = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($conversations);
    
} catch (PDOException $e) {
    echo json_encode(['error' => 'Erreur de base de données: ' . $e->getMessage()]);
}
?>