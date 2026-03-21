{{-- back/resources/views/emails/notification.blade.php --}}
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $notification->title }} - Tulk</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #0a0a0a;
            color: #ffffff;
            line-height: 1.6;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #141414;
            border: 1px solid #262626;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
        }

        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></svg>');
            opacity: 0.3;
        }

        .logo {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ffffff, #9ca3af);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            font-weight: bold;
            color: #000000;
            margin-bottom: 15px;
            position: relative;
            z-index: 1;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .header h1 {
            color: #ffffff;
            font-size: 24px;
            font-weight: 700;
            position: relative;
            z-index: 1;
        }

        .content {
            padding: 40px 30px;
        }

        .notification-icon {
            font-size: 48px;
            text-align: center;
            margin-bottom: 20px;
        }

        .notification-badge {
            display: inline-block;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 20px;
        }

        .notification-title {
            font-size: 22px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 15px;
            text-align: center;
        }

        .notification-message {
            color: #a0a0a0;
            font-size: 16px;
            line-height: 1.8;
            margin-bottom: 30px;
            text-align: center;
        }

        .sender-info {
            background-color: #1f1f1f;
            border: 1px solid #262626;
            border-radius: 10px;
            padding: 20px;
            margin: 25px 0;
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .sender-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea, #764ba2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: bold;
            color: #ffffff;
            flex-shrink: 0;
        }

        .sender-avatar img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
        }

        .sender-details {
            flex: 1;
        }

        .sender-name {
            font-weight: 600;
            color: #ffffff;
            font-size: 16px;
        }

        .sender-action {
            color: #a0a0a0;
            font-size: 14px;
        }

        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            padding: 14px 40px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            text-align: center;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
        }

        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }

        .notification-details {
            background-color: #1f1f1f;
            border: 1px solid #262626;
            border-radius: 10px;
            padding: 20px;
            margin: 25px 0;
        }

        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #262626;
        }

        .detail-row:last-child {
            border-bottom: none;
        }

        .detail-label {
            color: #a0a0a0;
            font-size: 14px;
        }

        .detail-value {
            color: #ffffff;
            font-weight: 500;
            font-size: 14px;
        }

        .footer {
            padding: 30px;
            background-color: #0a0a0a;
            text-align: center;
            border-top: 1px solid #262626;
        }

        .footer-text {
            color: #666666;
            font-size: 13px;
            line-height: 1.8;
            margin-bottom: 15px;
        }

        .footer-links {
            margin-top: 20px;
        }

        .footer-links a {
            color: #667eea;
            text-decoration: none;
            font-size: 13px;
            margin: 0 10px;
        }

        .footer-links a:hover {
            text-decoration: underline;
        }

        .social-links {
            margin-top: 20px;
        }

        .social-links a {
            display: inline-block;
            width: 36px;
            height: 36px;
            background-color: #1f1f1f;
            border-radius: 50%;
            margin: 0 5px;
            line-height: 36px;
            color: #a0a0a0;
            text-decoration: none;
            transition: all 0.3s ease;
        }

        .social-links a:hover {
            background-color: #667eea;
            color: #ffffff;
        }

        .unsubscribe {
            margin-top: 20px;
            font-size: 12px;
            color: #666666;
        }

        .unsubscribe a {
            color: #667eea;
            text-decoration: none;
        }

        @media (max-width: 600px) {
            .container {
                border-radius: 0;
            }

            .header {
                padding: 30px 20px;
            }

            .content {
                padding: 30px 20px;
            }

            .sender-info {
                flex-direction: column;
                text-align: center;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo">T</div>
            <h1>Tulk</h1>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Notification Icon -->
            <div class="notification-icon">{{ $icon }}</div>

            <!-- Notification Type Badge -->
            <div class="notification-badge" style="background-color: {{ $color }};">
                {{ str_replace('_', ' ', $notification->type) }}
            </div>

            <!-- Title -->
            <h2 class="notification-title">{{ $notification->title }}</h2>

            <!-- Message -->
            <p class="notification-message">{{ $notification->message }}</p>

            <!-- Sender Info (if applicable) -->
            @if ($sender)
                <div class="sender-info">
                    <div class="sender-avatar">
                        @if ($sender->image)
                            <img src="{{ $appUrl }}/storage/{{ $sender->image }}" alt="{{ $sender->prenom }}">
                        @else
                            {{ strtoupper(substr($sender->prenom, 0, 1) . substr($sender->nom, 0, 1)) }}
                        @endif
                    </div>
                    <div class="sender-details">
                        <div class="sender-name">{{ $sender->prenom }} {{ $sender->nom }}</div>
                        <div class="sender-action">
                            @switch($notification->type)
                                @case('like')
                                    a aimé votre publication
                                @break

                                @case('comment')
                                    a commenté votre publication
                                @break

                                @case('friend')
                                    @if ($notification->subtype === 'friend_request')
                                        souhaite devenir votre ami
                                    @elseif($notification->subtype === 'friend_accepted')
                                        a accepté votre demande d'ami
                                    @endif
                                @break

                                @case('mention')
                                    vous a mentionné
                                @break

                                @default
                                    a interagi avec vous
                            @endswitch
                        </div>
                    </div>
                </div>
            @endif

            <!-- Additional Details (if available) -->
            @if ($notification->data && count($notification->data) > 0)
                <div class="notification-details">
                    @if (isset($notification->data['comment_preview']))
                        <div class="detail-row">
                            <span class="detail-label">Aperçu du commentaire</span>
                            <span class="detail-value">"{{ $notification->data['comment_preview'] }}..."</span>
                        </div>
                    @endif

                    @if (isset($notification->data['context']))
                        <div class="detail-row">
                            <span class="detail-label">Contexte</span>
                            <span class="detail-value">{{ $notification->data['context'] }}</span>
                        </div>
                    @endif

                    @if (isset($notification->data['post_description']))
                        <div class="detail-row">
                            <span class="detail-label">Publication</span>
                            <span class="detail-value">"{{ $notification->data['post_description'] }}..."</span>
                        </div>
                    @endif

                    <div class="detail-row">
                        <span class="detail-label">Date</span>
                        <span class="detail-value">{{ $notification->created_at->format('d/m/Y à H:i') }}</span>
                    </div>
                </div>
            @endif

            <!-- Call to Action Button -->
            <div style="text-align: center;">
                <a href="{{ $appUrl }}/notifications" class="cta-button">
                    Voir la notification
                </a>
            </div>

            <!-- Helpful Tips -->
            <div
                style="background-color: #1f1f1f; border-left: 4px solid #667eea; padding: 15px; margin-top: 25px; border-radius: 0 8px 8px 0;">
                <p style="color: #a0a0a0; font-size: 14px; margin: 0;">
                    💡 <strong>Astuce:</strong> Vous pouvez gérer vos préférences de notification dans les paramètres de
                    votre compte.
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p class="footer-text">
                Cet email a été envoyé à {{ $recipient->email }} car vous avez un compte sur Tulk.
            </p>
            <p class="footer-text">
                © {{ date('Y') }} Tulk. Tous droits réservés.
            </p>
            <div class="footer-links">
                <a href="{{ $appUrl }}/settings">Paramètres</a>
                <a href="{{ $appUrl }}/privacy">Confidentialité</a>
                <a href="{{ $appUrl }}/terms">Conditions</a>
                <a href="{{ $appUrl }}/contact">Contact</a>
            </div>
            <div class="social-links">
                <a href="#">📘</a>
                <a href="#">🐦</a>
                <a href="#">📸</a>
                <a href="#">💼</a>
            </div>
            <div class="unsubscribe">
                <a href="{{ $appUrl }}/settings/notifications">Se désabonner de ces emails</a>
            </div>
        </div>
    </div>
</body>

</html>
