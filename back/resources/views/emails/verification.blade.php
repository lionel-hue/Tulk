<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vérification de votre email</title>
    <style>
        /* Your provided CSS converted for email compatibility */
        body {
            margin: 0;
            padding: 0;
            background-color: #0a0a0a;
            color: #ffffff;
            font-family: Arial, sans-serif;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #141414;
            border: 1px solid #262626;
            border-radius: 10px;
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(to bottom right, #ffffff, #a0a0a0);
            padding: 40px 20px;
            text-align: center;
        }
        
        .logo {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: #000;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            font-weight: bold;
            color: #000;
        }
        
        .content {
            padding: 40px 30px;
            text-align: center;
        }
        
        .verification-code {
            font-size: 48px;
            font-weight: bold;
            letter-spacing: 8px;
            background: #262626;
            padding: 20px;
            border-radius: 10px;
            margin: 30px 0;
            color: #ffffff;
        }
        
        .message {
            color: #a0a0a0;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        
        .footer {
            padding: 20px;
            background-color: #0a0a0a;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
        
        .button {
            display: inline-block;
            background: #ffffff;
            color: #000000;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">T</div>
        </div>
        
        <div class="content">
            <h1 style="margin: 0 0 20px 0; color: #ffffff;">Vérification de votre email</h1>
            
            @if($userName)
            <p style="color: #a0a0a0; margin-bottom: 20px;">Bonjour {{ $userName }},</p>
            @endif
            
            <p class="message">
                Utilisez le code suivant pour vérifier votre adresse email et compléter votre inscription sur Tulk:
            </p>
            
            <div class="verification-code">
                {{ $verificationCode }}
            </div>
            
            <p class="message">
                Ce code expirera dans 10 minutes. Si vous n'avez pas demandé ce code, veuillez ignorer cet email.
            </p>
            
            <p class="message" style="font-size: 14px;">
                Merci de nous rejoindre sur Tulk !<br>
                L'équipe Tulk
            </p>
        </div>
        
        <div class="footer">
            <p>&copy; {{ date('Y') }} Tulk. Tous droits réservés.</p>
            <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
        </div>
    </div>
</body>
</html>