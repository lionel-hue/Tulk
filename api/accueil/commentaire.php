<?php
session_start();

include("../database.php");

header('Content-Type: application/json');

$req = null;

if ($_SERVER["REQUEST_METHOD"] === "GET") 
{
    if ($_GET["type"] == "set_profile") 
    {
        try 
        {
            $req = $pdo->prepare("SELECT image FROM Utilisateur WHERE id = :id");

            $req->execute([
                "id" => 13
            ]);
        } catch (PDOException $e) 
        {
            echo json_encode($e->getMessage());
        }
        
        echo json_encode($req->fetch(PDO::FETCH_ASSOC));
    } else if ($_GET["type"] === "show_commentaire" && isset($_GET["id_arti"])) 
    {
        $req = $pdo->prepare("SELECT nom, prenom, U.image as profile_pic, C.texte as commentaire, C.date as date FROM Utilisateur U INNER JOIN Commentaire C ON U.id = C.id_uti INNER JOIN Article A on A.id = C.id_arti WHERE A.id = :id_arti");

        $req->execute([
            "id_arti" => $_GET["id_arti"]
        ]);

        echo json_encode($req->fetchAll(PDO::FETCH_ASSOC));
    }
} else if ($_SERVER["REQUEST_METHOD"] === "POST") 
{
    $input = file_get_contents("php://input");

    $data = json_decode($input, true);

    if (json_last_error() !== JSON_ERROR_NONE) 
    {
        echo json_encode(["status" => "error", "message" => "Invalid JSON received."]);
        exit();
    }

    $texte = strip_tags($data["texte"]);
    $id_arti =  strip_tags($data["id_arti"]);

    $req = $pdo->prepare("INSERT INTO Commentaire(texte, id_arti, id_uti) VALUES(:texte, :id_arti, :id_uti)");

    $req->execute([
        "texte" => $texte,
        "id_arti" => $id_arti,
        "id_uti" => $_SESSION["id_uti"]
    ]);

    echo json_encode($req->fetch(PDO::FETCH_ASSOC));

} else echo json_encode(["status" => "error", "message" => "Invalid JSON received."]);
