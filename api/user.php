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


if
( 
    $_SERVER["REQUEST_METHOD"] === "GET" && 
    isset($_GET["id_ami"] ) && 
    $_GET["id_ami"] != $_SESSION["id_uti"] 
)
{
    try
    {
        $req = $pdo->prepare("SELECT * FROM Utilisateur WHERE id = :id_ami");
        $req->execute([
            "id_ami" => $_GET["id_ami"]
        ]);
    
    }catch(PDOException $e){
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        exit;
    }
    echo json_encode( $req->fetch(PDO::FETCH_ASSOC) );


}else if
( 
    (
        $_SERVER["REQUEST_METHOD"] === "GET" && 
        isset($_GET["id_ami"] ) && 
        $_GET["id_ami"] == $_SESSION["id_uti"]    
    ) 
    || 
    (
        !isset($_GET["id_ami"]) &&
        $_SERVER["REQUEST_METHOD"] === "GET"
    )
)
{
    try
    {
        $req = $pdo->prepare("SELECT * FROM Utilisateur WHERE id = :id_uti");
        $req->execute([
            "id_uti" => $_SESSION["id_uti"]
        ]);
    
    }catch(PDOException $e){
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        exit;
    }
    echo json_encode( $req->fetch(PDO::FETCH_ASSOC) );

}else echo json_encode("error"); 
