<?php
// back/app/Mail/NotificationMail.php

namespace App\Mail;

use App\Models\Utilisateur;
use App\Models\Notification;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $recipient;
    public $notification;

    public function __construct(Utilisateur $recipient, Notification $notification)
    {
        $this->recipient = $recipient;
        $this->notification = $notification;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "🔔 {$this->notification->title} - Tulk",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.notification',
            with: [
                'recipient' => $this->recipient,
                'notification' => $this->notification,
                'sender' => $this->notification->utilisateurFrom,
                'icon' => $this->notification->icon,
                'color' => $this->notification->color,
                'appUrl' => config('app.url'),
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
