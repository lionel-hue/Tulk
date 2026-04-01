{{-- back/resources/views/emails/notification.blade.php --}}
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $notification->title }} – Tulk</title>
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
                     BRAND BAR
                ───────────────────────────────────────────── -->
                <tr>
                    <td align="center" style="padding-bottom:28px;">
                        <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td align="center" valign="middle" style="width:44px;height:44px;background:linear-gradient(135deg,#8b5cf6,#ec4899);border-radius:12px;font-size:22px;font-weight:900;color:#ffffff;line-height:44px;text-align:center;">
                                    T
                                </td>
                                <td style="padding-left:10px;">
                                    <span style="font-size:20px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">Tulk</span>
                                    <span style="display:block;font-size:10px;font-weight:600;color:rgba(255,255,255,0.3);letter-spacing:3px;text-transform:uppercase;margin-top:1px;">L'univers connecté</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- ─────────────────────────────────────────────
                     HERO / HEADER CARD
                ───────────────────────────────────────────── -->
                <tr>
                    <td style="border-radius:28px 28px 0 0;overflow:hidden;">
                        <!-- Top rainbow bar -->
                        <div style="height:4px;background:linear-gradient(90deg,#8b5cf6,#a855f7,#ec4899,#f97316);border-radius:28px 28px 0 0;"></div>

                        <!-- Hero inner -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0f0f0f;border:1px solid rgba(255,255,255,0.06);border-top:none;border-radius:0;">
                            <tr>
                                <td style="padding:52px 48px 40px;text-align:center;">

                                    <!-- Glow orb behind icon -->
                                    <div style="display:inline-block;position:relative;margin-bottom:28px;">
                                        <div style="width:80px;height:80px;background:{{ $color }}18;border:1.5px solid {{ $color }}33;border-radius:24px;line-height:80px;font-size:36px;text-align:center;">
                                            {{ $icon }}
                                        </div>
                                    </div>

                                    <!-- Type pill badge -->
                                    <div style="margin-bottom:20px;">
                                        <span style="display:inline-block;padding:5px 18px;background:{{ $color }}18;border:1px solid {{ $color }}33;border-radius:100px;font-size:10px;font-weight:700;color:{{ $color }};text-transform:uppercase;letter-spacing:2.5px;">
                                            {{ str_replace('_', ' ', $notification->type) }}
                                        </span>
                                    </div>

                                    <!-- Title -->
                                    <h1 style="margin:0 0 16px;font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;line-height:1.25;">
                                        {{ $notification->title }}
                                    </h1>

                                    <!-- Message -->
                                    <p style="margin:0 auto;font-size:15px;color:rgba(255,255,255,0.45);line-height:1.85;max-width:420px;">
                                        {{ $notification->message }}
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- ─────────────────────────────────────────────
                     DIVIDER LINE
                ───────────────────────────────────────────── -->
                <tr>
                    <td style="background-color:#0f0f0f;border-left:1px solid rgba(255,255,255,0.06);border-right:1px solid rgba(255,255,255,0.06);">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="padding:0 48px;">
                                    <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent);"></div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- ─────────────────────────────────────────────
                     SENDER CARD (conditional)
                ───────────────────────────────────────────── -->
                @if ($sender)
                <tr>
                    <td style="background-color:#0f0f0f;border-left:1px solid rgba(255,255,255,0.06);border-right:1px solid rgba(255,255,255,0.06);padding:32px 48px 0;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:20px;padding:22px 24px;">
                            <tr>
                                <!-- Avatar -->
                                <td width="60" valign="middle" style="padding-right:18px;">
                                    @if ($sender->image)
                                        <img src="{{ $appUrl }}/storage/{{ $sender->image }}"
                                             alt="{{ $sender->prenom }}"
                                             width="52" height="52"
                                             style="width:52px;height:52px;border-radius:16px;object-fit:cover;display:block;border:2px solid rgba(139,92,246,0.3);">
                                    @else
                                        <div style="width:52px;height:52px;border-radius:16px;background:linear-gradient(135deg,#8b5cf6,#ec4899);font-size:20px;font-weight:900;color:#ffffff;line-height:52px;text-align:center;">
                                            {{ strtoupper(substr($sender->prenom, 0, 1) . substr($sender->nom, 0, 1)) }}
                                        </div>
                                    @endif
                                </td>
                                <!-- Info -->
                                <td valign="middle">
                                    <p style="margin:0 0 2px;font-size:15px;font-weight:700;color:#ffffff;">
                                        {{ $sender->prenom }} {{ $sender->nom }}
                                    </p>
                                    <p style="margin:0 0 6px;font-size:12px;color:rgba(255,255,255,0.3);font-weight:500;">
                                        @switch($notification->type)
                                            @case('like') a aimé votre publication @break
                                            @case('comment') a commenté votre publication @break
                                            @case('friend')
                                                @if ($notification->subtype === 'friend_request')
                                                    souhaite vous rejoindre en ami
                                                @elseif($notification->subtype === 'friend_accepted')
                                                    a accepté votre demande d'ami
                                                @endif
                                            @break
                                            @case('mention') vous a mentionné dans une publication @break
                                            @case('follow') a commencé à vous suivre @break
                                            @default a interagi avec vous
                                        @endswitch
                                    </p>
                                    <span style="display:inline-block;padding:3px 10px;background:{{ $color }}15;border:1px solid {{ $color }}25;border-radius:100px;font-size:10px;font-weight:600;color:{{ $color }};text-transform:uppercase;letter-spacing:1.5px;">
                                        {{ str_replace('_', ' ', $notification->type) }}
                                    </span>
                                </td>
                                <!-- Arrow -->
                                <td valign="middle" style="padding-left:12px;color:rgba(255,255,255,0.15);font-size:22px;">
                                    →
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                @endif

                <!-- ─────────────────────────────────────────────
                     CONTENT PREVIEW (conditional)
                ───────────────────────────────────────────── -->
                @if ($notification->data && count($notification->data) > 0)
                <tr>
                    <td style="background-color:#0f0f0f;border-left:1px solid rgba(255,255,255,0.06);border-right:1px solid rgba(255,255,255,0.06);padding:20px 48px 0;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0a0a0a;border:1px solid rgba(255,255,255,0.06);border-radius:16px;overflow:hidden;">

                            @if (isset($notification->data['comment_preview']))
                            <tr>
                                <td style="padding:14px 20px;border-bottom:1px solid rgba(255,255,255,0.04);">
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                            <td>
                                                <span style="font-size:10px;color:rgba(255,255,255,0.3);font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">Commentaire</span>
                                            </td>
                                            <td align="right">
                                                <span style="font-size:13px;color:rgba(255,255,255,0.65);font-style:italic;">"{{ $notification->data['comment_preview'] }}…"</span>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            @endif

                            @if (isset($notification->data['post_description']))
                            <tr>
                                <td style="padding:14px 20px;border-bottom:1px solid rgba(255,255,255,0.04);">
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                            <td>
                                                <span style="font-size:10px;color:rgba(255,255,255,0.3);font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">Publication</span>
                                            </td>
                                            <td align="right">
                                                <span style="font-size:13px;color:rgba(255,255,255,0.65);font-style:italic;">"{{ $notification->data['post_description'] }}…"</span>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            @endif

                            <tr>
                                <td style="padding:14px 20px;">
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                            <td>
                                                <span style="font-size:10px;color:rgba(255,255,255,0.3);font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">Date</span>
                                            </td>
                                            <td align="right">
                                                <span style="font-size:13px;color:rgba(255,255,255,0.5);">{{ $notification->created_at->format('d/m/Y à H:i') }}</span>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                @endif

                <!-- ─────────────────────────────────────────────
                     CTA BUTTON
                ───────────────────────────────────────────── -->
                <tr>
                    <td style="background-color:#0f0f0f;border-left:1px solid rgba(255,255,255,0.06);border-right:1px solid rgba(255,255,255,0.06);padding:32px 48px 12px;text-align:center;">
                        <a href="{{ $appUrl }}/notifications"
                           style="display:inline-block;background:linear-gradient(135deg,#8b5cf6,#ec4899);color:#ffffff;padding:16px 44px;text-decoration:none;border-radius:16px;font-size:14px;font-weight:800;letter-spacing:0.5px;box-shadow:0 8px 32px rgba(139,92,246,0.35);">
                            Voir la notification &nbsp;→
                        </a>
                    </td>
                </tr>

                <!-- ─────────────────────────────────────────────
                     INFO STRIP
                ───────────────────────────────────────────── -->
                <tr>
                    <td style="background-color:#0f0f0f;border-left:1px solid rgba(255,255,255,0.06);border-right:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06);border-radius:0 0 28px 28px;padding:16px 48px 40px;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(139,92,246,0.06);border:1px solid rgba(139,92,246,0.15);border-radius:14px;padding:14px 20px;">
                            <tr>
                                <td>
                                    <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.4);line-height:1.7;">
                                        💡 <strong style="color:rgba(255,255,255,0.6);">Astuce :</strong> Gérez vos préférences de notification dans les
                                        <a href="{{ $appUrl }}/settings" style="color:#a78bfa;text-decoration:none;font-weight:600;">paramètres de votre compte</a>.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- ─────────────────────────────────────────────
                     FOOTER
                ───────────────────────────────────────────── -->
                <tr>
                    <td style="padding:36px 0 0;text-align:center;">
                        <p style="margin:0 0 14px;font-size:12px;color:rgba(255,255,255,0.2);">
                            Cet email a été envoyé à <strong style="color:rgba(255,255,255,0.35);">{{ $recipient->email }}</strong>
                        </p>
                        <!-- Footer links -->
                        <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
                            <tr>
                                <td style="padding:0 10px;">
                                    <a href="{{ $appUrl }}/settings" style="font-size:12px;color:rgba(255,255,255,0.3);text-decoration:none;font-weight:500;">Paramètres</a>
                                </td>
                                <td style="color:rgba(255,255,255,0.12);font-size:12px;">·</td>
                                <td style="padding:0 10px;">
                                    <a href="{{ $appUrl }}/settings/notifications" style="font-size:12px;color:rgba(255,255,255,0.3);text-decoration:none;font-weight:500;">Se désabonner</a>
                                </td>
                                <td style="color:rgba(255,255,255,0.12);font-size:12px;">·</td>
                                <td style="padding:0 10px;">
                                    <a href="{{ $appUrl }}/privacy" style="font-size:12px;color:rgba(255,255,255,0.3);text-decoration:none;font-weight:500;">Confidentialité</a>
                                </td>
                            </tr>
                        </table>
                        <!-- Brand line -->
                        <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:6px;">
                            <tr>
                                <td align="center" valign="middle" style="width:24px;height:24px;background:linear-gradient(135deg,#8b5cf6,#ec4899);border-radius:7px;font-size:12px;font-weight:900;color:#ffffff;line-height:24px;text-align:center;">T</td>
                                <td style="padding-left:8px;font-size:13px;font-weight:700;color:rgba(255,255,255,0.2);">Tulk</td>
                            </tr>
                        </table>
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
