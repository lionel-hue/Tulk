{{-- back/resources/views/emails/notification.blade.php --}}
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $notification->title }} – Tulk</title>
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
                                    <td align="center" style="width:52px;height:52px;background-color:#ffffff;border-radius:14px;font-size:26px;font-weight:900;color:#000000;line-height:52px;">
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

                            <!-- Top Gradient Accent -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="height:4px;background:linear-gradient(90deg,#8b5cf6,#a855f7,#ec4899,#f97316);border-radius:28px 28px 0 0;"></td>
                                </tr>
                            </table>

                            <!-- Header Section -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding:48px 48px 32px;text-align:center;">

                                        <!-- Notification Icon -->
                                        <div style="display:inline-block;width:72px;height:72px;background-color:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.2);border-radius:20px;line-height:72px;font-size:32px;margin-bottom:24px;">
                                            {{ $icon }}
                                        </div>

                                        <!-- Type Badge -->
                                        <div style="display:inline-block;padding:6px 16px;background-color:{{ $color }}22;border:1px solid {{ $color }}44;border-radius:100px;font-size:11px;font-weight:700;color:{{ $color }};text-transform:uppercase;letter-spacing:2px;margin-bottom:24px;">
                                            {{ str_replace('_', ' ', $notification->type) }}
                                        </div>

                                        <!-- Notification Title -->
                                        <h1 style="margin:0 0 16px;font-size:26px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;line-height:1.3;">
                                            {{ $notification->title }}
                                        </h1>

                                        <!-- Notification Message -->
                                        <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.45);line-height:1.8;max-width:440px;margin:0 auto;">
                                            {{ $notification->message }}
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Sender Info (if applicable) -->
                            @if ($sender)
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding:0 48px 32px;">
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a0a0a;border:1px solid rgba(255,255,255,0.07);border-radius:18px;padding:20px 24px;">
                                            <tr>
                                                <!-- Avatar -->
                                                <td width="52" valign="middle" style="padding-right:16px;">
                                                    @if ($sender->image)
                                                        <img src="{{ $appUrl }}/storage/{{ $sender->image }}" 
                                                             alt="{{ $sender->prenom }}" 
                                                             width="48" height="48"
                                                             style="width:48px;height:48px;border-radius:14px;object-fit:cover;display:block;">
                                                    @else
                                                        <div style="width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#8b5cf6,#ec4899);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;color:#ffffff;line-height:48px;text-align:center;">
                                                            {{ strtoupper(substr($sender->prenom, 0, 1) . substr($sender->nom, 0, 1)) }}
                                                        </div>
                                                    @endif
                                                </td>
                                                <!-- Info -->
                                                <td valign="middle">
                                                    <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#ffffff;">
                                                        {{ $sender->prenom }} {{ $sender->nom }}
                                                    </p>
                                                    <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.35);font-weight:500;">
                                                        @switch($notification->type)
                                                            @case('like') a aimé votre publication @break
                                                            @case('comment') a commenté votre publication @break
                                                            @case('friend')
                                                                @if ($notification->subtype === 'friend_request')
                                                                    souhaite devenir votre ami
                                                                @elseif($notification->subtype === 'friend_accepted')
                                                                    a accepté votre demande d'ami
                                                                @endif
                                                            @break
                                                            @case('mention') vous a mentionné @break
                                                            @default a interagi avec vous
                                                        @endswitch
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            @endif

                            <!-- Details (if any) -->
                            @if ($notification->data && count($notification->data) > 0)
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding:0 48px 32px;">
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a0a0a;border:1px solid rgba(255,255,255,0.07);border-radius:18px;overflow:hidden;">
                                            @if (isset($notification->data['comment_preview']))
                                            <tr>
                                                <td style="padding:14px 20px;border-bottom:1px solid rgba(255,255,255,0.05);">
                                                    <span style="font-size:12px;color:rgba(255,255,255,0.3);font-weight:600;text-transform:uppercase;letter-spacing:1px;">Aperçu</span>
                                                    <span style="float:right;font-size:13px;color:rgba(255,255,255,0.7);font-style:italic;">"{{ $notification->data['comment_preview'] }}..."</span>
                                                </td>
                                            </tr>
                                            @endif
                                            @if (isset($notification->data['post_description']))
                                            <tr>
                                                <td style="padding:14px 20px;border-bottom:1px solid rgba(255,255,255,0.05);">
                                                    <span style="font-size:12px;color:rgba(255,255,255,0.3);font-weight:600;text-transform:uppercase;letter-spacing:1px;">Publication</span>
                                                    <span style="float:right;font-size:13px;color:rgba(255,255,255,0.7);font-style:italic;">"{{ $notification->data['post_description'] }}..."</span>
                                                </td>
                                            </tr>
                                            @endif
                                            <tr>
                                                <td style="padding:14px 20px;">
                                                    <span style="font-size:12px;color:rgba(255,255,255,0.3);font-weight:600;text-transform:uppercase;letter-spacing:1px;">Date</span>
                                                    <span style="float:right;font-size:13px;color:rgba(255,255,255,0.6);">{{ $notification->created_at->format('d/m/Y à H:i') }}</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            @endif

                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding:0 48px 16px;text-align:center;">
                                        <a href="{{ $appUrl }}/notifications"
                                           style="display:inline-block;background-color:#ffffff;color:#000000;padding:16px 40px;text-decoration:none;border-radius:14px;font-size:14px;font-weight:700;letter-spacing:0.5px;box-shadow:0 4px 24px rgba(0,0,0,0.4);">
                                            Voir la notification →
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Tip Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding:0 48px 48px;">
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:rgba(139,92,246,0.06);border:1px solid rgba(139,92,246,0.15);border-radius:14px;padding:16px 20px;">
                                            <tr>
                                                <td>
                                                    <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.4);line-height:1.6;">
                                                        💡 <strong style="color:rgba(255,255,255,0.6);">Astuce :</strong> Gérez vos préférences de notification dans les 
                                                        <a href="{{ $appUrl }}/settings" style="color:#a78bfa;text-decoration:none;font-weight:600;">paramètres de votre compte</a>.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding:32px 0 0;text-align:center;">
                            <p style="margin:0 0 12px;font-size:12px;color:rgba(255,255,255,0.2);">
                                Cet email a été envoyé à <strong style="color:rgba(255,255,255,0.35);">{{ $recipient->email }}</strong>
                            </p>
                            <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
                                <tr>
                                    <td style="padding:0 8px;">
                                        <a href="{{ $appUrl }}/settings" style="font-size:12px;color:rgba(255,255,255,0.3);text-decoration:none;font-weight:500;">Paramètres</a>
                                    </td>
                                    <td style="color:rgba(255,255,255,0.15);font-size:12px;">·</td>
                                    <td style="padding:0 8px;">
                                        <a href="{{ $appUrl }}/settings/notifications" style="font-size:12px;color:rgba(255,255,255,0.3);text-decoration:none;font-weight:500;">Se désabonner</a>
                                    </td>
                                    <td style="color:rgba(255,255,255,0.15);font-size:12px;">·</td>
                                    <td style="padding:0 8px;">
                                        <a href="{{ $appUrl }}/privacy" style="font-size:12px;color:rgba(255,255,255,0.3);text-decoration:none;font-weight:500;">Confidentialité</a>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.12);">
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
