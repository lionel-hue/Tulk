<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vérification de votre email – Tulk</title>
</head>
<body style="margin:0;padding:0;background-color:#060606;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">

<!-- ═══════════════════════════════════════════════
     OUTER WRAPPER
═══════════════════════════════════════════════ -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#060606;padding:40px 16px;">
    <tr>
        <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

                <!-- ─────────────────────────────────────────────
                     HERO BANNER
                ───────────────────────────────────────────── -->
                <tr>
                    <td style="border-radius:28px 28px 0 0;overflow:hidden;">
                        <!-- Full-width gradient hero -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg,#1a0533 0%,#0f0a1f 40%,#160824 100%);border-radius:28px 28px 0 0;border:1px solid rgba(139,92,246,0.2);border-bottom:none;">
                            <tr>
                                <td style="padding:48px 48px 40px;text-align:center;">

                                    <!-- Brand pill -->
                                    <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
                                        <tr>
                                            <td align="center" valign="middle" style="width:44px;height:44px;background:linear-gradient(135deg,#8b5cf6,#ec4899);border-radius:13px;font-size:22px;font-weight:900;color:#ffffff;line-height:44px;text-align:center;">
                                                T
                                            </td>
                                            <td style="padding-left:10px;">
                                                <span style="font-size:20px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">Tulk</span>
                                                <span style="display:block;font-size:10px;font-weight:600;color:rgba(255,255,255,0.4);letter-spacing:3px;text-transform:uppercase;margin-top:2px;">L'univers connecté</span>
                                            </td>
                                        </tr>
                                    </table>

                                    <!-- Icon glow -->
                                    <div style="display:inline-block;width:80px;height:80px;background:rgba(139,92,246,0.15);border:1.5px solid rgba(139,92,246,0.3);border-radius:24px;line-height:80px;font-size:36px;text-align:center;margin-bottom:24px;box-shadow:0 0 40px rgba(139,92,246,0.2);">
                                        ✉️
                                    </div>

                                    <!-- Heading -->
                                    <h1 style="margin:0 0 12px;font-size:30px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;line-height:1.2;">
                                        Vérification de votre email
                                    </h1>

                                    @if($userName)
                                    <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.55);line-height:1.6;">
                                        Bienvenue sur Tulk, <strong style="color:#c4b5fd;">{{ $userName }}</strong> ! Vous y êtes presque.
                                    </p>
                                    @else
                                    <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.55);line-height:1.6;">
                                        Bienvenue sur Tulk ! Vous y êtes presque.
                                    </p>
                                    @endif
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
                            Utilisez le code ci-dessous pour vérifier votre adresse email et activer votre compte.
                        </p>

                        <!-- ─── OTP CODE ─── -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
                            <tr>
                                <td align="center">
                                    <div style="display:inline-block;background:#0a0a0a;border:1px solid rgba(139,92,246,0.25);border-radius:24px;padding:32px 52px;text-align:center;box-shadow:0 0 48px rgba(139,92,246,0.12);">
                                        <p style="margin:0 0 10px;font-size:10px;font-weight:700;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:3px;">
                                            Code de vérification
                                        </p>
                                        <div style="font-size:48px;font-weight:900;letter-spacing:12px;color:#ffffff;font-family:'Courier New',Courier,monospace;">
                                            {{ $verificationCode }}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </table>

                        <!-- ─── EXPIRY WARNING ─── -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:36px;">
                            <tr>
                                <td style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);border-radius:14px;padding:14px 20px;text-align:center;">
                                    <p style="margin:0;font-size:13px;color:rgba(245,158,11,0.9);font-weight:600;">
                                        ⏱&nbsp; Ce code expire dans <strong>10 minutes</strong>
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- ─────────────────────────────────────────────
                     3-STEP GUIDE
                ───────────────────────────────────────────── -->
                <tr>
                    <td style="background-color:#0f0f0f;border-left:1px solid rgba(255,255,255,0.06);border-right:1px solid rgba(255,255,255,0.06);padding:0 48px 36px;">

                        <!-- Separator -->
                        <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent);margin-bottom:32px;"></div>

                        <p style="margin:0 0 20px;font-size:10px;font-weight:700;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:2.5px;text-align:center;">
                            Comment ça marche
                        </p>

                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <!-- Step 1 -->
                                <td width="33%" style="text-align:center;padding:0 8px;vertical-align:top;">
                                    <div style="width:40px;height:40px;background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.2);border-radius:12px;line-height:40px;font-size:16px;text-align:center;margin:0 auto 10px;">
                                        📋
                                    </div>
                                    <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#ffffff;">Copiez</p>
                                    <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.3);line-height:1.5;">Copiez le code ci-dessus</p>
                                </td>
                                <!-- Arrow -->
                                <td width="0" style="color:rgba(255,255,255,0.15);font-size:18px;text-align:center;vertical-align:middle;padding-top:8px;">→</td>
                                <!-- Step 2 -->
                                <td width="33%" style="text-align:center;padding:0 8px;vertical-align:top;">
                                    <div style="width:40px;height:40px;background:rgba(236,72,153,0.1);border:1px solid rgba(236,72,153,0.2);border-radius:12px;line-height:40px;font-size:16px;text-align:center;margin:0 auto 10px;">
                                        📲
                                    </div>
                                    <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#ffffff;">Collez</p>
                                    <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.3);line-height:1.5;">Collez-le dans le champ prévu</p>
                                </td>
                                <!-- Arrow -->
                                <td width="0" style="color:rgba(255,255,255,0.15);font-size:18px;text-align:center;vertical-align:middle;padding-top:8px;">→</td>
                                <!-- Step 3 -->
                                <td width="33%" style="text-align:center;padding:0 8px;vertical-align:top;">
                                    <div style="width:40px;height:40px;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.2);border-radius:12px;line-height:40px;font-size:16px;text-align:center;margin:0 auto 10px;">
                                        ✅
                                    </div>
                                    <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#ffffff;">Confirmez</p>
                                    <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.3);line-height:1.5;">Votre compte est activé !</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- ─────────────────────────────────────────────
                     SAFETY NOTICE + BOTTOM BORDER
                ───────────────────────────────────────────── -->
                <tr>
                    <td style="background-color:#0f0f0f;border-left:1px solid rgba(255,255,255,0.06);border-right:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06);border-radius:0 0 28px 28px;padding:28px 48px 40px;">
                        <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent);margin-bottom:24px;"></div>
                        <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.2);line-height:1.8;text-align:center;">
                            Si vous n'avez pas demandé ce code, ignorez simplement cet email.<br>
                            Votre compte ne sera pas créé sans confirmation.
                        </p>
                    </td>
                </tr>

                <!-- ─────────────────────────────────────────────
                     FOOTER
                ───────────────────────────────────────────── -->
                <tr>
                    <td style="padding:36px 0 0;text-align:center;">
                        <!-- Brand -->
                        <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
                            <tr>
                                <td align="center" valign="middle" style="width:24px;height:24px;background:linear-gradient(135deg,#8b5cf6,#ec4899);border-radius:7px;font-size:12px;font-weight:900;color:#ffffff;line-height:24px;text-align:center;">T</td>
                                <td style="padding-left:8px;font-size:13px;font-weight:700;color:rgba(255,255,255,0.2);">Tulk</td>
                            </tr>
                        </table>
                        <p style="margin:0 0 6px;font-size:12px;color:rgba(255,255,255,0.15);">
                            Cet email a été envoyé automatiquement. Merci de ne pas y répondre.
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