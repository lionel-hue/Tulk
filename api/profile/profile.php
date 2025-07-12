<?php
session_start();
include("../database.php");

header('Content-Type: application/json');

$req = "";


if ($_SERVER["REQUEST_METHOD"] === "POST" && !empty($_POST['nom']) && !empty($_POST['prenom'])) {

    $nom = $_POST['nom'];
    $prenom = $_POST['prenom'];
    $id_uti = $_SESSION["id_uti"];

    $filename = include "../code_de_gestion_d_image.php";

    if ($filename) 
    {
        // Update with new image
        $req = $pdo->prepare("UPDATE Utilisateur SET nom=:nom, prenom=:prenom, image=:image WHERE id=:id");
        $req->execute([
            'nom' => $nom,
            'prenom' => $prenom,
            'image' => $filename,
            'id' => $id_uti
        ]);
    } else 
    {
        // Update without changing image
        $req = $pdo->prepare("UPDATE Utilisateur SET nom=:nom, prenom=:prenom WHERE id=:id");
        $req->execute([
            'nom' => $nom,
            'prenom' => $prenom,
            'id' => $id_uti
        ]);
    }

    echo json_encode("success");
    
} else echo json_encode("eror");
