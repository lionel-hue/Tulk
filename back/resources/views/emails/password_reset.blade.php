<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation de votre mot de passe – Tulk</title>
</head>
<body style="margin:0;padding:0;background-color:#060606;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">

<!-- ═══════════════════════════════════════════════
     OUTER WRAPPER
     Enhanced for high-end feel
═══════════════════════════════════════════════ -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#060606;padding:40px 16px;">
    <tr>
        <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

                <!-- ─────────────────────────────────────────────
                     HERO BANNER - SECURITY FOCUS
                ───────────────────────────────────────────── -->
                <tr>
                    <td style="border-radius:28px 28px 0 0;overflow:hidden;">
                        <!-- Deep indigo security gradient -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg,#0f112a 0%,#05071a 40%,#090a1f 100%);border-radius:28px 28px 0 0;border:1px solid rgba(79,70,229,0.2);border-bottom:none;">
                            <tr>
                                <td style="padding:48px 48px 40px;text-align:center;">

                                    <!-- Brand pill -->
                                    <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
                                        <tr>
                                            <td align="center" valign="middle" style="width:44px;height:44px;background:linear-gradient(135deg,#6366f1,#a855f7);border-radius:13px;font-size:22px;font-weight:900;color:#ffffff;line-height:44px;text-align:center;">
                                                T
                                            </td>
                                            <td style="padding-left:10px;">
                                                <span style="font-size:20px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">Tulk</span>
                                                <span style="display:block;font-size:10px;font-weight:600;color:rgba(255,255,255,0.4);letter-spacing:3px;text-transform:uppercase;margin-top:2px;">Sécurité du compte</span>
                                            </td>
                                        </tr>
                                    </table>

                                    <!-- Icon glow -->
                                    <div style="display:inline-block;width:80px;height:80px;background:rgba(99,102,241,0.15);border:1.5px solid rgba(99,102,241,0.3);border-radius:24px;line-height:80px;font-size:36px;text-align:center;margin-bottom:24px;box-shadow:0 0 40px rgba(99,102,241,0.2);">
                                        🔒
                                    </div>

                                    <!-- Heading -->
                                    <h1 style="margin:0 0 12px;font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;line-height:1.2;">
                                        Réinitialisation du mot de passe
                                    </h1>

                                    <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.55);line-height:1.6;">
                                        Bonjour <strong style="color:#818cf8;">{{ $userName }}</strong>, vous avez demandé à réinitialiser votre accès à Tulk.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- ─────────────────────────────────────────────
                     BODY CARD
                ───────────────────────────────────────────── -->
                <tr>
                    <td style="background-color:#0f0f0f;border-left:1px solid rgba(255,255,255,0.06);border-right:1px solid rgba(255,255,255,0.06);padding:40px 48px 0;">

                        <p style="margin:0 0 32px;font-size:15px;color:rgba(255,255,255,0.45);line-height:1.8;text-align:center;">
                            Saisissez le code de sécurité confidentiel suivant sur la page de réinitialisation pour définir un nouveau mot de passe.
                        </p>

                        <!-- ─── RESET CODE ─── -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
                            <tr>
                                <td align="center">
                                    <div style="display:inline-block;background:#0a0a0a;border:1px solid rgba(99,102,241,0.3);border-radius:24px;padding:32px 52px;text-align:center;box-shadow:0 0 48px rgba(99,102,241,0.12);">
                                        <p style="margin:0 0 10px;font-size:10px;font-weight:700;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:3px;">
                                            Code de sécurité
                                        </p>
                                        <div style="font-size:48px;font-weight:900;letter-spacing:12px;color:#ffffff;font-family:'Courier New',Courier,monospace;">
                                            {{ $resetCode }}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </table>

                        <!-- ─── EXPIRY WARNING ─── -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:36px;">
                            <tr>
                                <td style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:14px;padding:14px 20px;text-align:center;">
                                    <p style="margin:0;font-size:13px;color:rgba(239,68,68,0.9);font-weight:600;">
                                        ⏱&nbsp; Ce code expire dans <strong>30 minutes</strong>
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- ─────────────────────────────────────────────
                     SAFETY TIPS
                ───────────────────────────────────────────── -->
                <tr>
                    <td style="background-color:#0f0f0f;border-left:1px solid rgba(255,255,255,0.06);border-right:1px solid rgba(255,255,255,0.06);padding:0 48px 36px;">

                        <!-- Separator -->
                        <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent);margin-bottom:32px;"></div>

                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="padding:0 24px;">
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(255,255,255,0.02);border-radius:20px;padding:24px;">
                                        <tr>
                                            <td style="vertical-align:top;padding-top:2px;width:24px;">
                                                🛡️
                                            </td>
                                            <td style="padding-left:16px;">
                                                <p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#ffffff;">Conseil de sécurité</p>
                                                <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.4);line-height:1.6;">
                                                    Ne partagez jamais ce code avec qui que ce soit. L'équipe Tulk ne vous demandera jamais votre code ou votre mot de passe par email ou par téléphone.
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- ─────────────────────────────────────────────
                     DISCLAIMER + BOTTOM BORDER
                ───────────────────────────────────────────── -->
                <tr>
                    <td style="background-color:#0f0f0f;border-left:1px solid rgba(255,255,255,0.06);border-right:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06);border-radius:0 0 28px 28px;padding:28px 48px 40px;">
                        <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent);margin-bottom:24px;"></div>
                        <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.2);line-height:1.8;text-align:center;">
                            Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité. Votre mot de passe actuel restera inchangé.
                        </p>
                    </td>
                </tr>

                <!-- ─────────────────────────────────────────────
                     FOOTER
                ───────────────────────────────────────────── -->
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
