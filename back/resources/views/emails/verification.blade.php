<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vérification de votre email – Tulk</title>
</head>
<body style="margin:0;padding:0;background-color:#060606;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">

    <!-- Email Wrapper -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#060606;padding:40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

                    <!-- Logo / Brand Bar -->
                    <tr>
                        <td align="center" style="padding-bottom:32px;">
                            <table cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center" style="width:52px;height:52px;background-color:#ffffff;border-radius:14px;font-size:26px;font-weight:900;color:#000000;letter-spacing:-1px;line-height:52px;">
                                        T
                                    </td>
                                    <td style="padding-left:12px;">
                                        <span style="font-size:22px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">Tulk</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Main Card -->
                    <tr>
                        <td style="background-color:#0f0f0f;border:1px solid rgba(255,255,255,0.07);border-radius:28px;overflow:hidden;">

                            <!-- Card Top Accent -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="height:4px;background:linear-gradient(90deg,#8b5cf6,#a855f7,#ec4899,#f97316);border-radius:28px 28px 0 0;"></td>
                                </tr>
                            </table>

                            <!-- Card Content -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding:52px 48px 48px;text-align:center;">

                                        <!-- Icon -->
                                        <div style="display:inline-block;width:72px;height:72px;background-color:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.2);border-radius:20px;line-height:72px;font-size:32px;margin-bottom:28px;">
                                            ✉️
                                        </div>

                                        <!-- Heading -->
                                        <h1 style="margin:0 0 12px;font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;line-height:1.2;">
                                            Vérification de votre email
                                        </h1>

                                        @if($userName)
                                        <p style="margin:0 0 28px;font-size:15px;color:rgba(255,255,255,0.5);font-weight:500;">
                                            Bonjour <strong style="color:#ffffff;">{{ $userName }}</strong>, bienvenue sur Tulk !
                                        </p>
                                        @else
                                        <p style="margin:0 0 28px;font-size:15px;color:rgba(255,255,255,0.5);font-weight:500;">
                                            Bienvenue sur Tulk !
                                        </p>
                                        @endif

                                        <p style="margin:0 0 36px;font-size:15px;color:rgba(255,255,255,0.45);line-height:1.7;">
                                            Utilisez le code ci-dessous pour vérifier votre adresse email et compléter votre inscription.
                                        </p>

                                        <!-- Verification Code -->
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td align="center" style="padding:0 0 36px;">
                                                    <div style="display:inline-block;background-color:#0a0a0a;border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:28px 48px;">
                                                        <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:3px;">
                                                            Code de vérification
                                                        </p>
                                                        <span style="font-size:44px;font-weight:900;letter-spacing:10px;color:#ffffff;font-family:monospace;">
                                                            {{ $verificationCode }}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>

                                        <!-- Expiry Notice -->
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
                                            <tr>
                                                <td style="background-color:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.15);border-radius:14px;padding:16px 20px;">
                                                    <p style="margin:0;font-size:13px;color:rgba(245,158,11,0.9);font-weight:600;text-align:center;">
                                                        ⏱ Ce code expire dans <strong>10 minutes</strong>
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>

                                        <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.25);line-height:1.7;">
                                            Si vous n'avez pas demandé ce code, ignorez simplement cet email.<br>
                                            Votre compte ne sera pas créé sans confirmation.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding:32px 0 0;text-align:center;">
                            <p style="margin:0 0 8px;font-size:12px;color:rgba(255,255,255,0.2);font-weight:500;">
                                © {{ date('Y') }} Tulk — L'univers connecté
                            </p>
                            <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.15);">
                                Cet email a été envoyé automatiquement. Merci de ne pas y répondre.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>
</html>