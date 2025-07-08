<?php 
session_start();

include "../database.php";

header('Content-Type: application/json');

$req = null;

// Vérifier tous les champs nécessaires
if ( 
    !empty($_POST['nom']) &&
    !empty($_POST['prenom']) &&
    !empty($_POST['role']) &&
    !empty($_POST['sexe']) &&
    !empty($_POST['email']) &&
    !empty($_POST['motdepasse']) &&
    isset($_FILES['send_img']) &&
    $_FILES['send_img']['error'] === 0
) 
{
    // Récupération des données (sans trim)
    $nom = $_POST['nom'];
    $prenom = $_POST['prenom'];
    $role = $_POST['role'];
    $email = $_POST['email'];
    $sexe = $_POST["sexe"];
    $motdepasse_brut = $_POST['motdepasse'];

    $motdepasse = password_hash($motdepasse_brut, PASSWORD_DEFAULT);


    // Use output buffering to catch any accidental output
    ob_start();
    include("./code_de_gestion_d_image.php");
    ob_end_clean();

    try{
        $req = $pdo->prepare("INSERT INTO Utilisateur(nom, prenom, role, image, sexe, email, mdp ) VALUES (:nom, :prenom, :role, :img, :sexe, :email, :mdp);");
        $req->execute([ 
            "nom"=>$_POST["nom"],
            "prenom"=>$_POST["prenom"],
            "role"=>$_POST["role"],
            "img"=>$filename,
            "sexe"=>$_POST["sexe"],
            "email"=>$_POST["email"],
            "mdp"=>$motdepasse
            
        ]);

        $lastId = $pdo->lastInsertId();
        $_SESSION["id_uti"] = $lastId;

    }catch(PDOException $e){
        echo json_encode($e->getMessage());
        exit;
    }
    $req = $pdo->prepare("SELECT * FROM Utilisateur WHERE id = :id");

    $req->execute([
        "id" => $lastId 
    ]);

    echo json_encode( $req->fetch(PDO::FETCH_ASSOC) );
    exit;

} else {
    echo json_encode([
        "success" => false,
        "error" => "Champs manquants ou image non valide",
        "debug" => [
            "post" => $_POST,
            "files" => $_FILES
        ]
    ]);
    exit;
}
exit;