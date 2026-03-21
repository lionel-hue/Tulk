<?php
// back/app/Services/NotificationService.php

namespace App\Services;

use App\Models\Notification;
use App\Models\Utilisateur;
use Illuminate\Support\Facades\Mail;
use App\Mail\NotificationMail;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Send a notification to a user
     */
    public function send(
        Utilisateur $recipient,
        string $type,
        string $title,
        string $message,
        ?Utilisateur $sender = null,
        ?int $relatedId = null,
        ?string $relatedType = null,
        array $data = [],
        bool $sendEmail = true
    ) {
        try {
            // Create notification in database
            $notification = Notification::create([
                'id_uti' => $recipient->id,
                'id_uti_from' => $sender?->id,
                'type' => $type,
                'title' => $title,
                'message' => $message,
                'related_id' => $relatedId,
                'related_type' => $relatedType,
                'data' => $data,
                'is_read' => false,
                'email_sent' => false
            ]);

            // Send email if enabled and user has email
            if ($sendEmail && $recipient->email) {
                $this->sendEmailNotification($recipient, $notification);
            }

            Log::info('Notification created', [
                'notification_id' => $notification->id,
                'user_id' => $recipient->id,
                'type' => $type
            ]);

            return $notification;
        } catch (\Exception $e) {
            Log::error('Failed to create notification', [
                'error' => $e->getMessage(),
                'user_id' => $recipient->id,
                'type' => $type
            ]);
            throw $e;
        }
    }

    /**
     * Send email notification
     */
    private function sendEmailNotification(Utilisateur $recipient, Notification $notification)
    {
        try {
            Mail::to($recipient->email)->send(
                new NotificationMail($recipient, $notification)
            );

            $notification->update(['email_sent' => true]);
        } catch (\Exception $e) {
            Log::error('Failed to send notification email', [
                'error' => $e->getMessage(),
                'user_id' => $recipient->id,
                'notification_id' => $notification->id
            ]);
        }
    }

    /**
     * Convenience methods for different notification types
     */

    // Like notification
    public function sendLikeNotification(Utilisateur $recipient, Utilisateur $liker, int $postId)
    {
        return $this->send(
            recipient: $recipient,
            type: 'like',
            title: 'Nouveau like!',
            message: "{$liker->prenom} {$liker->nom} a aimé votre publication.",
            sender: $liker,
            relatedId: $postId,
            relatedType: 'App\\Models\\Article',
            data: ['post_id' => $postId, 'liker_name' => "{$liker->prenom} {$liker->nom}"],
            sendEmail: false // Don't email for every like (can be configured)
        );
    }

    // Comment notification
    public function sendCommentNotification(Utilisateur $recipient, Utilisateur $commenter, int $postId, string $commentPreview)
    {
        return $this->send(
            recipient: $recipient,
            type: 'comment',
            title: 'Nouveau commentaire!',
            message: "{$commenter->prenom} {$commenter->nom} a commenté votre publication.",
            sender: $commenter,
            relatedId: $postId,
            relatedType: 'App\\Models\\Article',
            data: [
                'post_id' => $postId,
                'commenter_name' => "{$commenter->prenom} {$commenter->nom}",
                'comment_preview' => substr($commentPreview, 0, 100)
            ],
            sendEmail: true
        );
    }

    // Friend request notification
    public function sendFriendRequestNotification(Utilisateur $recipient, Utilisateur $requester)
    {
        return $this->send(
            recipient: $recipient,
            type: 'friend_request',
            title: 'Nouvelle demande d\'ami',
            message: "{$requester->prenom} {$requester->nom} souhaite devenir votre ami.",
            sender: $requester,
            relatedId: $requester->id,
            relatedType: 'App\\Models\\Utilisateur',
            data: [
                'requester_id' => $requester->id,
                'requester_name' => "{$requester->prenom} {$requester->nom}"
            ],
            sendEmail: true
        );
    }

    // Friend request accepted notification
    public function sendFriendAcceptedNotification(Utilisateur $recipient, Utilisateur $friend)
    {
        return $this->send(
            recipient: $recipient,
            type: 'friend_accepted',
            title: 'Demande acceptée!',
            message: "{$friend->prenom} {$friend->nom} a accepté votre demande d'ami.",
            sender: $friend,
            relatedId: $friend->id,
            relatedType: 'App\\Models\\Utilisateur',
            data: [
                'friend_id' => $friend->id,
                'friend_name' => "{$friend->prenom} {$friend->nom}"
            ],
            sendEmail: true
        );
    }

    // Mention notification
    public function sendMentionNotification(Utilisateur $recipient, Utilisateur $mentioner, int $postId, string $context)
    {
        return $this->send(
            recipient: $recipient,
            type: 'mention',
            title: 'Vous avez été mentionné!',
            message: "{$mentioner->prenom} {$mentioner->nom} vous a mentionné dans une publication.",
            sender: $mentioner,
            relatedId: $postId,
            relatedType: 'App\\Models\\Article',
            data: [
                'post_id' => $postId,
                'mentioner_name' => "{$mentioner->prenom} {$mentioner->nom}",
                'context' => substr($context, 0, 200)
            ],
            sendEmail: true
        );
    }

    // Welcome notification
    public function sendWelcomeNotification(Utilisateur $recipient)
    {
        return $this->send(
            recipient: $recipient,
            type: 'welcome',
            title: 'Bienvenue sur Tulk! 🎉',
            message: 'Nous sommes ravis de vous accueillir sur notre plateforme.',
            sender: null,
            relatedId: null,
            relatedType: null,
            data: ['user_name' => "{$recipient->prenom} {$recipient->nom}"],
            sendEmail: true
        );
    }

    /**
     * Get unread count for a user
     */
    public function getUnreadCount(int $userId): int
    {
        return Notification::where('id_uti', $userId)
            ->where('is_read', false)
            ->count();
    }

    /**
     * Get notifications for a user with pagination
     */
    public function getUserNotifications(int $userId, int $limit = 20, bool $unreadOnly = false)
    {
        $query = Notification::with(['utilisateurFrom'])
            ->where('id_uti', $userId)
            ->orderBy('created_at', 'desc');

        if ($unreadOnly) {
            $query->where('is_read', false);
        }

        return $query->limit($limit)->get();
    }

    /**
     * Mark all notifications as read for a user
     */
    public function markAllAsRead(int $userId): int
    {
        return Notification::where('id_uti', $userId)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now()
            ]);
    }

    /**
     * Delete old notifications (cleanup)
     */
    public function deleteOldNotifications(int $userId, int $daysOld = 30): int
    {
        return Notification::where('id_uti', $userId)
            ->where('created_at', '<', now()->subDays($daysOld))
            ->delete();
    }
}