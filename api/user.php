<?php
header('Content-Type: application/json');

session_start();

if ( !isset( $_SESSION["id_uti"] ) )
{    
    echo json_encode("error");
    exit;
}  

include("database.php");


$req = null;

if( $_SERVER["REQUEST_METHOD"] === "GET" )
{
    try{
        $req = $pdo->prepare("SELECT * FROM Utilisateur WHERE id = :id_uti");
        $req->execute([
            "id_uti" => $_SESSION["id_uti"]
        ]);
    
    }catch(PDOException $e){
        echo json_encode($e->getMessage());
        exit;
    }

    echo json_encode($req->fetch(PDO::FETCH_ASSOC));

}else json_encode("error");
