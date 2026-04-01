<?php
// back/app/Services/NotificationService.php
namespace App\Services;

use App\Models\Notification;
use App\Models\Utilisateur;
use App\Models\Article;
use App\Models\Commentaire;
use Illuminate\Support\Facades\Mail;
use App\Mail\NotificationMail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use App\Models\Groupe;

class NotificationService
{
    /**
     * Send a notification to a user (MAIN FLEXIBLE METHOD)
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
        bool $sendEmail = true,
        string $priority = Notification::PRIORITY_NORMAL,
        string $channel = Notification::CHANNEL_BOTH,
        ?string $subtype = null
    ) {
        try {
            // Create notification in database
            $notification = Notification::create([
                'id_uti' => $recipient->id,
                'id_uti_from' => $sender?->id,
                'type' => $type,
                'subtype' => $subtype,
                'title' => $title,
                'message' => $message,
                'related_id' => $relatedId,
                'related_type' => $relatedType,
                'data' => $data,
                'is_read' => false,
                'email_sent' => false,
                'priority' => $priority,
                'channel' => $channel
            ]);

            // Send email if enabled, user has email, wants email notifications, and is offline
            if (
                $sendEmail && $recipient->email && $recipient->email_notifications && !$recipient->isOnline() &&
                ($channel === Notification::CHANNEL_EMAIL ||
                    $channel === Notification::CHANNEL_BOTH)
            ) {
                $this->sendEmailNotification($recipient, $notification);
            }

            // Clear notification count cache
            Cache::forget('notification_count_' . $recipient->id);

            Log::info('Notification created', [
                'notification_id' => $notification->id,
                'user_id' => $recipient->id,
                'type' => $type,
                'subtype' => $subtype
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
     * Send email notification with beautiful template
     */
    private function sendEmailNotification(Utilisateur $recipient, Notification $notification)
    {
        try {
            Mail::to($recipient->email)->send(
                new NotificationMail($recipient, $notification)
            );
            $notification->update(['email_sent' => true]);

            Log::info('Notification email sent', [
                'notification_id' => $notification->id,
                'user_email' => $recipient->email
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send notification email', [
                'error' => $e->getMessage(),
                'user_id' => $recipient->id,
                'notification_id' => $notification->id
            ]);
            // Don't throw - email failure shouldn't break the flow
        }
    }

    // ============================================
    // POST NOTIFICATIONS
    // ============================================

    /**
     * Notify when someone likes a post
     */
    public function sendLikeNotification(
        Utilisateur $postOwner,
        Utilisateur $liker,
        Article $post,
        bool $sendEmail = true
    ) {
        // Don't notify yourself
        if ($postOwner->id === $liker->id) {
            return null;
        }

        return $this->send(
            recipient: $postOwner,
            type: Notification::TYPE_LIKE,
            subtype: Notification::SUBTYPE_LIKE_RECEIVED,
            title: 'Nouveau like! ❤️',
            message: "{$liker->prenom} {$liker->nom} a aimé votre publication.",
            sender: $liker,
            relatedId: $post->id,
            relatedType: Article::class,
            data: [
                'post_id' => $post->id,
                'post_description' => substr($post->description, 0, 100),
                'liker_id' => $liker->id,
                'liker_name' => "{$liker->prenom} {$liker->nom}",
                'liker_image' => $liker->image
            ],
            sendEmail: $sendEmail,
            priority: Notification::PRIORITY_LOW,
            channel: Notification::CHANNEL_IN_APP
        );
    }

    /**
     * Notify when someone comments on a post
     */
    public function sendCommentNotification(
        Utilisateur $postOwner,
        Utilisateur $commenter,
        Article $post,
        Commentaire $comment,
        bool $sendEmail = true
    ) {
        // Don't notify yourself
        if ($postOwner->id === $commenter->id) {
            return null;
        }

        return $this->send(
            recipient: $postOwner,
            type: Notification::TYPE_COMMENT,
            subtype: Notification::SUBTYPE_COMMENT_RECEIVED,
            title: 'Nouveau commentaire! 💬',
            message: "{$commenter->prenom} {$commenter->nom} a commenté votre publication.",
            sender: $commenter,
            relatedId: $post->id,
            relatedType: Article::class,
            data: [
                'post_id' => $post->id,
                'post_description' => substr($post->description, 0, 100),
                'comment_id' => $comment->id,
                'comment_text' => substr($comment->texte, 0, 200),
                'commenter_id' => $commenter->id,
                'commenter_name' => "{$commenter->prenom} {$commenter->nom}",
                'commenter_image' => $commenter->image
            ],
            sendEmail: $sendEmail,
            priority: Notification::PRIORITY_NORMAL,
            channel: Notification::CHANNEL_BOTH
        );
    }

    /**
     * Notify when someone replies to a comment
     */
    public function sendCommentReplyNotification(
        Utilisateur $originalCommenter,
        Utilisateur $replier,
        Article $post,
        Commentaire $replyComment,
        Commentaire $parentComment,
        bool $sendEmail = true
    ) {
        // Don't notify yourself
        if ($originalCommenter->id === $replier->id) {
            return null;
        }

        return $this->send(
            recipient: $originalCommenter,
            type: Notification::TYPE_COMMENT,
            subtype: Notification::SUBTYPE_COMMENT_REPLY,
            title: 'Réponse à votre commentaire! 💬',
            message: "{$replier->prenom} {$replier->nom} a répondu à votre commentaire.",
            sender: $replier,
            relatedId: $post->id,
            relatedType: Article::class,
            data: [
                'post_id' => $post->id,
                'parent_comment_id' => $parentComment->id,
                'reply_comment_id' => $replyComment->id,
                'reply_text' => substr($replyComment->texte, 0, 200),
                'replier_id' => $replier->id,
                'replier_name' => "{$replier->prenom} {$replier->nom}"
            ],
            sendEmail: $sendEmail,
            priority: Notification::PRIORITY_NORMAL,
            channel: Notification::CHANNEL_BOTH
        );
    }

    // ============================================
    // FRIEND NOTIFICATIONS
    // ============================================

    /**
     * Notify when someone sends a friend request
     */
    public function sendFriendRequestNotification(
        Utilisateur $recipient,
        Utilisateur $requester,
        bool $sendEmail = true
    ) {
        return $this->send(
            recipient: $recipient,
            type: Notification::TYPE_FRIEND,
            subtype: Notification::SUBTYPE_FRIEND_REQUEST,
            title: 'Nouvelle demande d\'ami! 👥',
            message: "{$requester->prenom} {$requester->nom} souhaite devenir votre ami.",
            sender: $requester,
            relatedId: $requester->id,
            relatedType: Utilisateur::class,
            data: [
                'requester_id' => $requester->id,
                'requester_name' => "{$requester->prenom} {$requester->nom}",
                'requester_image' => $requester->image
            ],
            sendEmail: $sendEmail,
            priority: Notification::PRIORITY_HIGH,
            channel: Notification::CHANNEL_BOTH
        );
    }

    /**
     * Notify when friend request is accepted
     */
    public function sendFriendAcceptedNotification(
        Utilisateur $recipient,
        Utilisateur $friend,
        bool $sendEmail = true
    ) {
        return $this->send(
            recipient: $recipient,
            type: Notification::TYPE_FRIEND,
            subtype: Notification::SUBTYPE_FRIEND_ACCEPTED,
            title: 'Demande acceptée! ✅',
            message: "{$friend->prenom} {$friend->nom} a accepté votre demande d'ami.",
            sender: $friend,
            relatedId: $friend->id,
            relatedType: Utilisateur::class,
            data: [
                'friend_id' => $friend->id,
                'friend_name' => "{$friend->prenom} {$friend->nom}",
                'friend_image' => $friend->image
            ],
            sendEmail: $sendEmail,
            priority: Notification::PRIORITY_NORMAL,
            channel: Notification::CHANNEL_BOTH
        );
    }

    /**
     * Notify when friend is removed
     */
    public function sendFriendRemovedNotification(
        Utilisateur $recipient,
        Utilisateur $formerFriend,
        bool $sendEmail = false
    ) {
        return $this->send(
            recipient: $recipient,
            type: Notification::TYPE_FRIEND,
            subtype: Notification::SUBTYPE_FRIEND_REMOVED,
            title: 'Ami supprimé',
            message: "{$formerFriend->prenom} {$formerFriend->nom} n'est plus dans votre liste d'amis.",
            sender: $formerFriend,
            relatedId: $formerFriend->id,
            relatedType: Utilisateur::class,
            data: [
                'friend_id' => $formerFriend->id,
                'friend_name' => "{$formerFriend->prenom} {$formerFriend->nom}"
            ],
            sendEmail: $sendEmail,
            priority: Notification::PRIORITY_LOW,
            channel: Notification::CHANNEL_IN_APP
        );
    }

    // ============================================
    // MENTION NOTIFICATIONS
    // ============================================

    /**
     * Notify when someone is mentioned in a post
     */
    public function sendMentionInPostNotification(
        Utilisateur $mentionedUser,
        Utilisateur $mentioner,
        Article $post,
        string $context,
        bool $sendEmail = true
    ) {
        return $this->send(
            recipient: $mentionedUser,
            type: Notification::TYPE_MENTION,
            subtype: Notification::SUBTYPE_MENTION_POST,
            title: 'Vous avez été mentionné! 📢',
            message: "{$mentioner->prenom} {$mentioner->nom} vous a mentionné dans une publication.",
            sender: $mentioner,
            relatedId: $post->id,
            relatedType: Article::class,
            data: [
                'post_id' => $post->id,
                'post_description' => substr($post->description, 0, 200),
                'mentioner_id' => $mentioner->id,
                'mentioner_name' => "{$mentioner->prenom} {$mentioner->nom}",
                'context' => substr($context, 0, 200)
            ],
            sendEmail: $sendEmail,
            priority: Notification::PRIORITY_HIGH,
            channel: Notification::CHANNEL_BOTH
        );
    }

    /**
     * Notify when someone is mentioned in a comment
     */
    public function sendMentionInCommentNotification(
        Utilisateur $mentionedUser,
        Utilisateur $mentioner,
        Article $post,
        Commentaire $comment,
        string $context,
        bool $sendEmail = true
    ) {
        return $this->send(
            recipient: $mentionedUser,
            type: Notification::TYPE_MENTION,
            subtype: Notification::SUBTYPE_MENTION_COMMENT,
            title: 'Vous avez été mentionné dans un commentaire! 📢',
            message: "{$mentioner->prenom} {$mentioner->nom} vous a mentionné dans un commentaire.",
            sender: $mentioner,
            relatedId: $post->id,
            relatedType: Article::class,
            data: [
                'post_id' => $post->id,
                'comment_id' => $comment->id,
                'comment_text' => substr($comment->texte, 0, 200),
                'mentioner_id' => $mentioner->id,
                'mentioner_name' => "{$mentioner->prenom} {$mentioner->nom}",
                'context' => substr($context, 0, 200)
            ],
            sendEmail: $sendEmail,
            priority: Notification::PRIORITY_HIGH,
            channel: Notification::CHANNEL_BOTH
        );
    }

    // ============================================
    // WELCOME & ONBOARDING NOTIFICATIONS
    // ============================================

    /**
     * Send welcome notification on registration
     */
    public function sendWelcomeNotification(
        Utilisateur $recipient,
        bool $sendEmail = true
    ) {
        return $this->send(
            recipient: $recipient,
            type: Notification::TYPE_WELCOME,
            subtype: Notification::SUBTYPE_WELCOME,
            title: 'Bienvenue sur Tulk! 🎉',
            message: 'Nous sommes ravis de vous accueillir sur notre plateforme. Commencez à explorer et à connecter avec vos amis!',
            sender: null,
            relatedId: null,
            relatedType: null,
            data: [
                'user_name' => "{$recipient->prenom} {$recipient->nom}",
                'onboarding_steps' => [
                    'Complétez votre profil',
                    'Ajoutez une photo',
                    'Trouvez des amis',
                    'Créez votre premier post'
                ]
            ],
            sendEmail: $sendEmail,
            priority: Notification::PRIORITY_CRITICAL,
            channel: Notification::CHANNEL_BOTH
        );
    }

    /**
     * Send first post celebration notification
     */
    public function sendFirstPostNotification(
        Utilisateur $user,
        Article $post,
        bool $sendEmail = false
    ) {
        return $this->send(
            recipient: $user,
            type: Notification::TYPE_POST,
            subtype: Notification::SUBTYPE_POST_CREATED,
            title: 'Premier post publié! 🎊',
            message: 'Félicitations! Vous avez créé votre première publication sur Tulk.',
            sender: null,
            relatedId: $post->id,
            relatedType: Article::class,
            data: [
                'post_id' => $post->id,
                'is_first_post' => true
            ],
            sendEmail: $sendEmail,
            priority: Notification::PRIORITY_NORMAL,
            channel: Notification::CHANNEL_IN_APP
        );
    }

    // ============================================
    // SECURITY NOTIFICATIONS
    // ============================================

    /**
     * Send login alert notification
     */
    public function sendLoginAlertNotification(
        Utilisateur $user,
        string $ipAddress,
        string $userAgent,
        bool $sendEmail = true
    ) {
        return $this->send(
            recipient: $user,
            type: Notification::TYPE_SECURITY,
            subtype: Notification::SUBTYPE_LOGIN_ALERT,
            title: 'Nouvelle connexion détectée! 🔒',
            message: "Une nouvelle connexion a été détectée sur votre compte.",
            sender: null,
            relatedId: null,
            relatedType: null,
            data: [
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
                'login_time' => now()->toDateTimeString(),
                'location' => 'Unknown' // Could integrate with geo-ip service
            ],
            sendEmail: $sendEmail,
            priority: Notification::PRIORITY_HIGH,
            channel: Notification::CHANNEL_BOTH
        );
    }

    /**
     * Send password changed notification
     */
    public function sendPasswordChangedNotification(
        Utilisateur $user,
        bool $sendEmail = true
    ) {
        return $this->send(
            recipient: $user,
            type: Notification::TYPE_SECURITY,
            subtype: Notification::SUBTYPE_PASSWORD_CHANGED,
            title: 'Mot de passe modifié! 🔒',
            message: 'Votre mot de passe a été modifié avec succès.',
            sender: null,
            relatedId: null,
            relatedType: null,
            data: [
                'changed_at' => now()->toDateTimeString()
            ],
            sendEmail: $sendEmail,
            priority: Notification::PRIORITY_CRITICAL,
            channel: Notification::CHANNEL_BOTH
        );
    }

    // ============================================
    // SYSTEM NOTIFICATIONS
    // ============================================

    /**
     * Send system announcement to all users
     */
    public function sendSystemAnnouncement(
        string $title,
        string $message,
        array $data = [],
        string $priority = Notification::PRIORITY_NORMAL,
        bool $sendEmail = false
    ) {
        $users = Utilisateur::all();
        $notifications = [];

        foreach ($users as $user) {
            $notification = $this->send(
                recipient: $user,
                type: Notification::TYPE_SYSTEM,
                subtype: Notification::SUBTYPE_SYSTEM_ANNOUNCEMENT,
                title: $title,
                message: $message,
                sender: null,
                relatedId: null,
                relatedType: null,
                data: $data,
                sendEmail: $sendEmail,
                priority: $priority,
                channel: $sendEmail ? Notification::CHANNEL_BOTH : Notification::CHANNEL_IN_APP
            );
            $notifications[] = $notification;
        }

        return $notifications;
    }

    // ============================================
    // UTILITY METHODS
    // ============================================

    /**
     * Get unread count for a user (with caching)
     */
    public function getUnreadCount(int $userId): int
    {
        return Cache::remember(
            'notification_count_' . $userId,
            300, // Cache for 5 minutes
            function () use ($userId) {
                return Notification::where('id_uti', $userId)
                    ->where('is_read', false)
                    ->count();
            }
        );
    }

    /**
     * Get notifications for a user with pagination and filters
     */
    public function getUserNotifications(
        int $userId,
        int $limit = 20,
        bool $unreadOnly = false,
        ?string $type = null,
        ?string $priority = null
    ) {
        $query = Notification::with(['utilisateurFrom'])
            ->where('id_uti', $userId)
            ->orderBy('created_at', 'desc');

        if ($unreadOnly) {
            $query->where('is_read', false);
        }

        if ($type) {
            $query->where('type', $type);
        }

        if ($priority) {
            $query->where('priority', $priority);
        }

        return $query->limit($limit)->get();
    }

    /**
     * Mark all notifications as read for a user
     */
    public function markAllAsRead(int $userId): int
    {
        $count = Notification::where('id_uti', $userId)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now()
            ]);

        // Clear cache
        Cache::forget('notification_count_' . $userId);

        return $count;
    }

    /**
     * Mark specific notification as read
     */
    public function markAsRead(int $userId, int $notificationId): bool
    {
        $notification = Notification::where('id', $notificationId)
            ->where('id_uti', $userId)
            ->first();

        if (!$notification) {
            return false;
        }

        $notification->markAsRead();
        Cache::forget('notification_count_' . $userId);

        return true;
    }

    /**
     * Delete old notifications (cleanup)
     */
    public function deleteOldNotifications(int $userId, int $daysOld = 30): int
    {
        $count = Notification::where('id_uti', $userId)
            ->where('created_at', '<', now()->subDays($daysOld))
            ->where('is_read', true)
            ->delete();

        return $count;
    }

    /**
     * Delete specific notification
     */
    public function deleteNotification(int $userId, int $notificationId): bool
    {
        $notification = Notification::where('id', $notificationId)
            ->where('id_uti', $userId)
            ->first();

        if (!$notification) {
            return false;
        }

        $notification->delete();
        Cache::forget('notification_count_' . $userId);

        return true;
    }

    /**
     * Get notification statistics for user
     */
    public function getNotificationStats(int $userId, int $days = 30): array
    {
        $startDate = now()->subDays($days);

        return [
            'total' => Notification::where('id_uti', $userId)
                ->where('created_at', '>=', $startDate)
                ->count(),
            'read' => Notification::where('id_uti', $userId)
                ->where('is_read', true)
                ->where('created_at', '>=', $startDate)
                ->count(),
            'unread' => Notification::where('id_uti', $userId)
                ->where('is_read', false)
                ->where('created_at', '>=', $startDate)
                ->count(),
            'by_type' => Notification::where('id_uti', $userId)
                ->where('created_at', '>=', $startDate)
                ->select('type', \DB::raw('count(*) as count'))
                ->groupBy('type')
                ->get()
                ->pluck('count', 'type')
                ->toArray()
        ];
    }

    // Add these new notification types to the Notification model constants first
    // TYPE_PROFILE_LIKE = 'profile_like'
    // TYPE_FOLLOW = 'follow'
    // SUBTYPE_PROFILE_LIKED = 'profile_liked'
    // SUBTYPE_STARTED_FOLLOWING = 'started_following'

    /**
     * Notify when someone likes a profile
     */
    public function sendProfileLikeNotification(
        Utilisateur $profileOwner,
        Utilisateur $liker,
        bool $sendEmail = true
    ) {
        if ($profileOwner->id === $liker->id) {
            return null;
        }

        return $this->send(
            recipient: $profileOwner,
            type: Notification::TYPE_PROFILE_LIKE,
            subtype: Notification::SUBTYPE_PROFILE_LIKED,
            title: 'Nouveau like sur votre profil! ❤️',
            message: "{$liker->prenom} {$liker->nom} a aimé votre profil.",
            sender: $liker,
            relatedId: $liker->id,
            relatedType: Utilisateur::class,
            data: [
                'liker_id' => $liker->id,
                'liker_name' => "{$liker->prenom} {$liker->nom}",
                'liker_image' => $liker->image
            ],
            sendEmail: $sendEmail,
            priority: Notification::PRIORITY_NORMAL,
            channel: Notification::CHANNEL_IN_APP
        );
    }

    /**
     * Notify when someone follows a user
     */
    public function sendFollowNotification(
        Utilisateur $followedUser,
        Utilisateur $follower,
        bool $sendEmail = true
    ) {
        if ($followedUser->id === $follower->id) {
            return null;
        }

        return $this->send(
            recipient: $followedUser,
            type: Notification::TYPE_FOLLOW,
            subtype: Notification::SUBTYPE_STARTED_FOLLOWING,
            title: 'Nouveau follower! 👥',
            message: "{$follower->prenom} {$follower->nom} vous suit maintenant.",
            sender: $follower,
            relatedId: $follower->id,
            relatedType: Utilisateur::class,
            data: [
                'follower_id' => $follower->id,
                'follower_name' => "{$follower->prenom} {$follower->nom}",
                'follower_image' => $follower->image
            ],
            sendEmail: $sendEmail,
            priority: Notification::PRIORITY_NORMAL,
            channel: Notification::CHANNEL_IN_APP
        );
    }

    /**
     * Check if a user is considered "offline" (not seen in the last 5 minutes)
     */
    public function isOffline(Utilisateur $user): bool
    {
        if (!$user->last_seen) return true;
        return $user->last_seen->lt(now()->subMinutes(5));
    }

    /**
     * Notify when someone sends a private message
     */
    public function sendMessageNotification(
        Utilisateur $recipient,
        Utilisateur $sender,
        string $messageText
    ) {
        $isOffline = $this->isOffline($recipient);
        
        return $this->send(
            recipient: $recipient,
            type: Notification::TYPE_MESSAGE,
            subtype: Notification::SUBTYPE_MESSAGE_RECEIVED,
            title: 'Nouveau message! ✉️',
            message: "{$sender->prenom} {$sender->nom} vous a envoyé un message.",
            sender: $sender,
            relatedId: $sender->id,
            relatedType: Utilisateur::class,
            data: [
                'sender_id' => $sender->id,
                'sender_name' => "{$sender->prenom} {$sender->nom}",
                'message_preview' => substr($messageText, 0, 100)
            ],
            sendEmail: $isOffline, // Only send email if offline
            priority: Notification::PRIORITY_HIGH,
            channel: $isOffline ? Notification::CHANNEL_BOTH : Notification::CHANNEL_IN_APP
        );
    }

    /**
     * Notify when someone sends a message in a group
     */
    public function sendGroupMessageNotification(
        Utilisateur $recipient,
        Utilisateur $sender,
        Groupe $group,
        string $messageText
    ) {
        // Don't notify the sender themselves
        if ($recipient->id === $sender->id) return null;

        $isOffline = $this->isOffline($recipient);

        return $this->send(
            recipient: $recipient,
            type: Notification::TYPE_MESSAGE,
            subtype: 'group_message',
            title: "Nouveau message dans {$group->nom}! 💬",
            message: "{$sender->prenom} a envoyé un message dans le groupe.",
            sender: $sender,
            relatedId: $group->id,
            relatedType: Groupe::class,
            data: [
                'group_id' => $group->id,
                'group_name' => $group->nom,
                'sender_id' => $sender->id,
                'sender_name' => "{$sender->prenom} {$sender->nom}",
                'message_preview' => substr($messageText, 0, 100)
            ],
            sendEmail: $isOffline,
            priority: Notification::PRIORITY_NORMAL,
            channel: $isOffline ? Notification::CHANNEL_BOTH : Notification::CHANNEL_IN_APP
        );
    }
}
