<?php
session_start();
include("../database.php");

header('Content-Type: application/json');


if( isset($_POST["nom"] && isset($_POST["prenom"] ) &&  ) )

$filename = include("../code_de_gestion_d_image.php");

if ($_SERVER["REQUEST_METHOD"] === "POST") {;
    try {
        $req = $pdo->prepare("UPDATE Utilisateur SET nom=:nom, prenom=:prenom, image=:image WHERE id=:id");
        $req->execute([
            ':nom' => $nom,
            ':prenom' => $prenom,
            ':image' => $filename,
            ':id' => 14 //$_SESSION["id_uti"]
        ]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} else echo json_encode("error");

echo json_encode($req->fetch(PDO::FETCH_ASSOC));