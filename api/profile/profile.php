<?php
session_start();
include("../database.php");

header('Content-Type: application/json');

// Initialize response array
$response = ['success' => false, 'error' => ''];

try {
    // Check if request is POST
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        throw new Exception("Invalid request method");
    }

    // Validate required fields
    if (empty($_POST['nom']) || empty($_POST['prenom'])) {
        throw new Exception("Nom and prenom are required");
    }

    // Get form data
    $nom = $_POST['nom'];
    $prenom = $_POST['prenom'];
    $id_uti = 14; // Should be $_SESSION["id_uti"] in production

    // Handle file upload if present
    $filename = include "../code_de_gestion_d_image.php";

    // Prepare the update query
    if ($filename) {
        // Update with new image
        $req = $pdo->prepare("UPDATE Utilisateur SET nom=:nom, prenom=:prenom, image=:image WHERE id=:id");
        $req->execute([
            'nom' => $nom,
            'prenom' => $prenom,
            'image' => $filename,
            'id' => $id_uti
        ]);
    } else {
        // Update without changing image
        $req = $pdo->prepare("UPDATE Utilisateur SET nom=:nom, prenom=:prenom WHERE id=:id");
        $req->execute([
            'nom' => $nom,
            'prenom' => $prenom,
            'id' => $id_uti
        ]);
    }

    // Success response
    $response = [
        'success' => true,
        'nom' => $nom,
        'prenom' => $prenom,
        'photo_url' => $filename
    ];

} catch (PDOException $e) {
    $response['error'] = "Database error: " . $e->getMessage();
} catch (Exception $e) {
    $response['error'] = $e->getMessage();
}

// Send JSON response
echo json_encode($response);
exit;