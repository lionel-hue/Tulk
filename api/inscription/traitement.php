<?php
// Connexion à la base de données
$conn = new mysqli("localhost", "root", "", "instaconn");

if ($conn->connect_error) {
    die("❌ Connexion échouée : " . $conn->connect_error);
}

// Récupérer les données du formulaire
$nom = $_POST['nom'];
$prenom = $_POST['prenom'];
$role = $_POST['role'];

// Gestion de l'image
$target_dir = "uploads/"; // dossier où stocker les images
$nom_fichier = basename($_FILES["image"]["name"]);
$chemin_image = $target_dir . time() . "_" . $nom_fichier; // nom unique

// Créer le dossier s’il n’existe pas
if (!is_dir($target_dir)) {
    mkdir($target_dir, 0777, true);
}

// Déplacer le fichier image
if (move_uploaded_file($_FILES["image"]["tmp_name"], $chemin_image)) {

    // Insertion dans la base
    $sql = "INSERT INTO utilisateur (nom, prenom, role, image) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $nom, $prenom, $role, $chemin_image);

    if ($stmt->execute()) {
        echo "✅ Inscription réussie !";
    } else {
        echo "❌ Erreur SQL : " . $stmt->error;
    }

    $stmt->close();

} else {
    echo "❌ Erreur lors de l'upload de l'image.";
}

$conn->close();
?>
