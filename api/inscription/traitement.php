<?php 
require_once "../envloader.php";
loadEnvFile(__DIR__.'/../.env');
session_start();

include "../database.php";

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

    $filename = include("../code_de_gestion_d_image.php");

    //include "auth.php"; en train d'etre teste a l'instant... 

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

        $_SESSION["id_uti"] = $lastId = $pdo->lastInsertId(); 

    }catch(PDOException $e){
        echo json_encode($e->getMessage());
        exit;
    }
    $req = $pdo->prepare("SELECT * FROM Utilisateur WHERE id = :id");

    $req->execute([
        "id" => $lastId 
    ]);

    header("Location: ../../index.html");
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
