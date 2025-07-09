<?php
header('Content-Type: application/json');

// Simule la mise à jour (remplace par ta logique)
$nom = $_POST['nom'] ?? '';
$prenom = $_POST['prenom'] ?? '';
$photo_url = null;

// Si une photo est uploadée, traite-la et donne le chemin
if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
    $ext = pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION);
    $photo_url = 'uploads/' . uniqid() . '.' . $ext;
    move_uploaded_file($_FILES['photo']['tmp_name'], $photo_url);
}

// Retourne la réponse
echo json_encode([
    'success' => true,
    'nom' => $nom,
    'prenom' => $prenom,
    'photo_url' => $photo_url
]);
exit;
?>