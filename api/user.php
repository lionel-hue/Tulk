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
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        exit;
    }

    $user = $req->fetch(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'user' => $user]);

}else{
    echo json_encode(['success' => false, 'error' => 'Requête non supportée']);
}
