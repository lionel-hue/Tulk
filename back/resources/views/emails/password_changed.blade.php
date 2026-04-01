<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mot de passe modifié – Tulk</title>
</head>
<body style="margin:0;padding:0;background-color:#060606;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#060606;padding:40px 16px;">
    <tr>
        <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

                <!-- HERO BANNER -->
                <tr>
                    <td style="border-radius:28px 28px 0 0;overflow:hidden;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg,#0f112a 0%,#05071a 40%,#090a1f 100%);border-radius:28px 28px 0 0;border:1px solid rgba(16,185,129,0.2);border-bottom:none;">
                            <tr>
                                <td style="padding:48px 48px 40px;text-align:center;">
                                    <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
                                        <tr>
                                            <td align="center" valign="middle" style="width:44px;height:44px;background:linear-gradient(135deg,#6366f1,#a855f7);border-radius:13px;font-size:22px;font-weight:900;color:#ffffff;line-height:44px;text-align:center;">
                                                T
                                            </td>
                                            <td style="padding-left:10px;">
                                                <span style="font-size:20px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">Tulk</span>
                                                <span style="display:block;font-size:10px;font-weight:600;color:rgba(255,255,255,0.4);letter-spacing:3px;text-transform:uppercase;margin-top:2px;">Alerte de sécurité</span>
                                            </td>
                                        </tr>
                                    </table>

                                    <div style="display:inline-block;width:80px;height:80px;background:rgba(16,185,129,0.15);border:1.5px solid rgba(16,185,129,0.3);border-radius:24px;line-height:80px;font-size:36px;text-align:center;margin-bottom:24px;box-shadow:0 0 40px rgba(16,185,129,0.2);">
                                        🔐
                                    </div>

                                    <h1 style="margin:0 0 12px;font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;line-height:1.2;">
                                        Mot de passe modifié
                                    </h1>
                                    <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.55);line-height:1.6;">
                                        Bonjour <strong style="color:#34d399;">{{ $userName }}</strong>, votre mot de passe a été modifié avec succès.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- BODY CARD -->
                <tr>
                    <td style="background-color:#0f0f0f;border-left:1px solid rgba(255,255,255,0.06);border-right:1px solid rgba(255,255,255,0.06);padding:40px 48px;">

                        <!-- SUCCESS NOTICE -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
                            <tr>
                                <td style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:16px;padding:20px 24px;text-align:center;">
                                    <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#34d399;">✅ Changement confirmé</p>
                                    <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.45);line-height:1.6;">
                                        Le {{ now()->format('d/m/Y à H:i') }} — Compte : {{ $userEmail }}
                                    </p>
                                </td>
                            </tr>
                        </table>

                        <!-- SECURITY WARNING -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.2);border-radius:16px;padding:20px 24px;">
                                    <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#f87171;">⚠️ Ce n'était pas vous ?</p>
                                    <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.4);line-height:1.6;">
                                        Si vous n'êtes pas à l'origine de ce changement, votre compte est peut-être compromis. Connectez-vous immédiatement et changez votre mot de passe, ou contactez le support Tulk.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- FOOTER BORDER -->
                <tr>
                    <td style="background-color:#0f0f0f;border-left:1px solid rgba(255,255,255,0.06);border-right:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06);border-radius:0 0 28px 28px;padding:0 48px 36px;">
                        <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent);margin-bottom:24px;"></div>
                        <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.2);line-height:1.8;text-align:center;">
                            Cet email de sécurité est envoyé automatiquement à chaque modification de mot de passe sur votre compte Tulk.
                        </p>
                    </td>
                </tr>

                <!-- FOOTER -->
                <tr>
                    <td style="padding:36px 0 0;text-align:center;">
                        <p style="margin:0 0 6px;font-size:12px;color:rgba(255,255,255,0.15);">
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
