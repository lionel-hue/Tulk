<?php 
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
                    header("Location: ../../index.html");
                }else echo $error;
            }
        }catch(PDOException $e){
            echo "<script>alert(\"".$e->getMessage()."\")</script>";
        }

    }else echo "Erreur lors du login! ressayer plustard!";

}else header("Location: ../../views/clients/seconnecter.html");