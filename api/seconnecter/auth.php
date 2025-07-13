<?php 
require_once __DIR__."/../vendor/autoload.php";
session_start();

include "../database.php";

header('Content-Type: application/json');

$req = null;

// Vérifier tous les champs nécessaires
if( isset($_POST["email"]) && isset($_POST["password"] ) )
{
    if( !empty($_POST["email"]) && !empty($_POST["password"]) )
    {
        $email = strip_tags($_POST["email"]);
        $password = $_POST["password"];

        try
        {
            $req = $pdo->prepare("SELECT * FROM Utilisateur WHERE email = :email");
            $req->execute(['email' => $email]);
            $user = $req->fetch(PDO::FETCH_ASSOC);
            
            //si user n'existe pas
            if( !$user )
            {
                header("Location: ../../views/clients/seconnecter.html");
            }else{
                //user existe - ok, verifions mot de passe :
                $est_mdpasse_vrai = password_verify( $password, $user["mdp"]);

                if( $est_mdpasse_vrai == true )
                {
                    $_SESSION["id_uti"] = $user["id"];
                    echo json_encode(['success' => true, 'redirect' => '../../index.html']);
                    header("Location: ../../index.html");
                    exit;
                }else{
                    echo json_encode(['success' => false, 'error' => 'Mot de passe incorrect']);
                    header("Location: ../../index.html");
                    exit;
                }
            }
        }catch(PDOException $e){
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
            exit;
        }

    }else{
        echo json_encode(['success' => false, 'error' => 'Erreur lors du login! Réessayez plus tard!']);
        exit;
    }

}else header("Location: ../../views/clients/seconnecter.html");
