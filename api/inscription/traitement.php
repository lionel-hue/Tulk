<?php
// Connexion à la base de données
$conn = new mysqli("localhost", "root", "", "instaconn");
if ($conn->connect_error) {
    die("❌ Échec de la connexion : " . $conn->connect_error);
}

// Vérifier tous les champs nécessaires
if (
    isset($_POST['nom']) && isset($$_POST['prenom']) && isset ($_POST['role']) && isset($_POST['sexe'])
     && isset( $_POST['email']) && isset($_POST['motdepasse']) &&
    isset($_FILES['image']) && $_FILES['image']['error'] === 0
) {
    // Récupération des données
    $nom = $_POST['nom'];
    $prenom = $_POST['prenom'];
    $role = $_POST['role'];
    $day = $_POST['birth_day'];
    $month = $_POST['birth_month'];
    $year = $_POST['birth_year'];
    $sexe = $_POST['sexe'];
    $email = $_POST['email'];
    $motdepasse_brut = $_POST['motdepasse'];

    // Vérification du mot de passe : 6 caractères min, lettres et chiffres
    if (strlen($motdepasse_brut) < 6 || !preg_match('/[A-Za-z]/', $motdepasse_brut) || !preg_match('/[0-9]/', $motdepasse_brut)) {
        echo "❌ Le mot de passe doit contenir au moins 6 caractères, des lettres et des chiffres.";
        $conn->close();
        exit;
    }
    $motdepasse = password_hash($motdepasse_brut, PASSWORD_DEFAULT);

    // Conversion mois texte vers chiffre
    $mois_map = [
        "Jan" => "01", "Feb" => "02", "Mar" => "03", "Apr" => "04",
        "May" => "05", "Jun" => "06", "Jul" => "07", "Aug" => "08",
        "Sep" => "09", "Oct" => "10", "Nov" => "11", "Dec" => "12"
    ];
    $month_num = $mois_map[$month] ?? "01";
    $date_naissance = "$year-$month_num-$day";

    // Traitement de l’image
    $image = $_FILES['image'];
    $tmp_name = $image['tmp_name'];
    $nom_image = time() . "_" . basename($image['name']);
    $dossier = "../uploads/";
    $chemin_image = $dossier . $nom_image;

    // Vérifie si c’est bien une image
    if (getimagesize($tmp_name)) {
        // Crée le dossier s’il n’existe pas
        if (!is_dir($dossier)) {
            mkdir($dossier, 0777, true);
        }
        // Déplace l'image
        if (move_uploaded_file($tmp_name, $chemin_image)) {
            // Insertion dans la base de données
            $stmt = $conn->prepare("INSERT INTO users (nom, prenom, role, date_naissance, sexe, email, motdepasse, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            if ($stmt) {
                $stmt->bind_param("ssssssss", $nom, $prenom, $role, $date_naissance, $sexe, $email, $motdepasse, $nom_image);
                if ($stmt->execute()) {
                    echo "✅ Inscription réussie !";
                } else {
                    echo "❌ Erreur lors de l'inscription : " . $stmt->error;
                }
                $stmt->close();
            } else {
                echo "❌ Erreur de préparation de la requête : " . $conn->error;
            }
        } else {
            echo "❌ Erreur lors du téléchargement de l'image.";
        }
    } else {
        echo "❌ Le fichier n'est pas une image valide.";
    }
} else {
    echo "❌ Tous les champs sont obligatoires.";
}
$conn->close();
?>