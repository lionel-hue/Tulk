<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code de vérification 2FA – Tulk</title>
</head>
<body style="margin:0;padding:0;background-color:#060606;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#060606;padding:40px 16px;">
    <tr>
        <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

                <!-- HERO BANNER -->
                <tr>
                    <td style="border-radius:28px 28px 0 0;overflow:hidden;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg,#0f112a 0%,#05071a 40%,#090a1f 100%);border-radius:28px 28px 0 0;border:1px solid rgba(79,70,229,0.2);border-bottom:none;">
                            <tr>
                                <td style="padding:48px 48px 40px;text-align:center;">
                                    <!-- Brand -->
                                    <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
                                        <tr>
                                            <td align="center" valign="middle" style="width:44px;height:44px;background:linear-gradient(135deg,#6366f1,#a855f7);border-radius:13px;font-size:22px;font-weight:900;color:#ffffff;line-height:44px;text-align:center;">
                                                T
                                            </td>
                                            <td style="padding-left:10px;">
                                                <span style="font-size:20px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">Tulk</span>
                                                <span style="display:block;font-size:10px;font-weight:600;color:rgba(255,255,255,0.4);letter-spacing:3px;text-transform:uppercase;margin-top:2px;">Vérification en 2 étapes</span>
                                            </td>
                                        </tr>
                                    </table>

                                    <div style="display:inline-block;width:80px;height:80px;background:rgba(99,102,241,0.15);border:1.5px solid rgba(99,102,241,0.3);border-radius:24px;line-height:80px;font-size:36px;text-align:center;margin-bottom:24px;box-shadow:0 0 40px rgba(99,102,241,0.2);">
                                        🛡️
                                    </div>

                                    <h1 style="margin:0 0 12px;font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;line-height:1.2;">
                                        Code de vérification
                                    </h1>
                                    <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.55);line-height:1.6;">
                                        Bonjour <strong style="color:#818cf8;">{{ $userName }}</strong>, voici votre code de connexion à usage unique.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- BODY CARD -->
                <tr>
                    <td style="background-color:#0f0f0f;border-left:1px solid rgba(255,255,255,0.06);border-right:1px solid rgba(255,255,255,0.06);padding:40px 48px 0;">
                        <p style="margin:0 0 32px;font-size:15px;color:rgba(255,255,255,0.45);line-height:1.8;text-align:center;">
                            Saisissez ce code sur la page de connexion pour accéder à votre compte.
                        </p>

                        <!-- OTP CODE -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
                            <tr>
                                <td align="center">
                                    <div style="display:inline-block;background:#0a0a0a;border:1px solid rgba(99,102,241,0.3);border-radius:24px;padding:32px 52px;text-align:center;box-shadow:0 0 48px rgba(99,102,241,0.12);">
                                        <p style="margin:0 0 10px;font-size:10px;font-weight:700;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:3px;">
                                            Code à 6 chiffres
                                        </p>
                                        <div style="font-size:52px;font-weight:900;letter-spacing:14px;color:#ffffff;font-family:'Courier New',Courier,monospace;">
                                            {{ $otp }}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </table>

                        <!-- EXPIRY WARNING -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:36px;">
                            <tr>
                                <td style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:14px;padding:14px 20px;text-align:center;">
                                    <p style="margin:0;font-size:13px;color:rgba(239,68,68,0.9);font-weight:600;">
                                        ⏱&nbsp; Ce code expire dans <strong>10 minutes</strong>
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- SECURITY NOTE -->
                <tr>
                    <td style="background-color:#0f0f0f;border-left:1px solid rgba(255,255,255,0.06);border-right:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06);border-radius:0 0 28px 28px;padding:0 48px 40px;">
                        <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent);margin-bottom:28px;"></div>
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="background:rgba(255,255,255,0.02);border-radius:20px;padding:20px 24px;">
                                    <p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#ffffff;">⚠️ Conseil de sécurité</p>
                                    <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.4);line-height:1.6;">
                                        Si vous n'avez pas tenté de vous connecter, modifiez immédiatement votre mot de passe. Ne partagez jamais ce code.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- FOOTER -->
                <tr>
                    <td style="padding:36px 0 0;text-align:center;">
                        <p style="margin:0 0 6px;font-size:12px;color:rgba(255,255,255,0.15);">
                            Cet email a été envoyé automatiquement pour la sécurité de votre compte Tulk.
                        </p>
                        <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.1);">
                            © {{ date('Y') }} Tulk — L'univers connecté
                        </p>
                    </td>
                </tr>

            </table>
        </td>
    </tr>
</table>

</body>
</html>
