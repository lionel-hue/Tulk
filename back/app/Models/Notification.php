<?php
// back/app/Models/Notification.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $table = 'Notification';
    public $timestamps = true;

    protected $fillable = [
        'id_uti',
        'id_uti_from',
        'type',
        'subtype',
        'title',
        'message',
        'related_id',
        'related_type',
        'data',
        'is_read',
        'email_sent',
        'read_at',
        'priority',
        'channel'
    ];

    protected $casts = [
        'data' => 'array',
        'is_read' => 'boolean',
        'email_sent' => 'boolean',
        'read_at' => 'datetime',
    ];

    // Notification Types
    const TYPE_POST = 'post';
    const TYPE_LIKE = 'like';
    const TYPE_COMMENT = 'comment';
    const TYPE_FRIEND = 'friend';
    const TYPE_MENTION = 'mention';
    const TYPE_SYSTEM = 'system';
    const TYPE_WELCOME = 'welcome';
    const TYPE_SECURITY = 'security';
    const TYPE_PROFILE_LIKE = 'profile_like';
    const TYPE_FOLLOW = 'follow';

    // Notification Subtypes
    const SUBTYPE_POST_CREATED = 'post_created';
    const SUBTYPE_POST_UPDATED = 'post_updated';
    const SUBTYPE_POST_DELETED = 'post_deleted';
    const SUBTYPE_LIKE_RECEIVED = 'like_received';
    const SUBTYPE_COMMENT_RECEIVED = 'comment_received';
    const SUBTYPE_COMMENT_REPLY = 'comment_reply';
    const SUBTYPE_FRIEND_REQUEST = 'friend_request';
    const SUBTYPE_FRIEND_ACCEPTED = 'friend_accepted';
    const SUBTYPE_FRIEND_REMOVED = 'friend_removed';
    const SUBTYPE_MENTION_POST = 'mention_post';
    const SUBTYPE_MENTION_COMMENT = 'mention_comment';
    const SUBTYPE_WELCOME = 'welcome';
    const SUBTYPE_LOGIN_ALERT = 'login_alert';
    const SUBTYPE_PASSWORD_CHANGED = 'password_changed';
    const SUBTYPE_SYSTEM_ANNOUNCEMENT = 'system_announcement';
    const SUBTYPE_PROFILE_LIKED = 'profile_liked';
    const SUBTYPE_STARTED_FOLLOWING = 'started_following';

    // Priority Levels
    const PRIORITY_LOW = 'low';
    const PRIORITY_NORMAL = 'normal';
    const PRIORITY_HIGH = 'high';
    const PRIORITY_CRITICAL = 'critical';

    // Channels
    const CHANNEL_IN_APP = 'in_app';
    const CHANNEL_EMAIL = 'email';
    const CHANNEL_BOTH = 'both';

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'id_uti');
    }

    public function utilisateurFrom()
    {
        return $this->belongsTo(Utilisateur::class, 'id_uti_from');
    }

    public function notifiable()
    {
        return $this->morphTo();
    }

    public function markAsRead()
    {
        $this->update([
            'is_read' => true,
            'read_at' => now()
        ]);
    }

    public function getIconAttribute()
    {
        $icons = [
            self::TYPE_LIKE => '❤️',
            self::TYPE_COMMENT => '💬',
            self::TYPE_FRIEND => '👥',
            self::TYPE_MENTION => '📢',
            self::TYPE_WELCOME => '🎉',
            self::TYPE_SYSTEM => '⚙️',
            self::TYPE_POST => '📝',
            self::TYPE_SECURITY => '🔒',
            self::TYPE_PROFILE_LIKE => '❤️',
            self::TYPE_FOLLOW => '👥',
        ];
        return $icons[$this->type] ?? '🔔';
    }

    public function getColorAttribute()
    {
        $colors = [
            self::TYPE_LIKE => 'text-red-500 bg-red-500/10 border-red-500/20',
            self::TYPE_COMMENT => 'text-blue-500 bg-blue-500/10 border-blue-500/20',
            self::TYPE_FRIEND => 'text-purple-500 bg-purple-500/10 border-purple-500/20',
            self::TYPE_MENTION => 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
            self::TYPE_WELCOME => 'text-pink-500 bg-pink-500/10 border-pink-500/20',
            self::TYPE_SYSTEM => 'text-gray-500 bg-gray-500/10 border-gray-500/20',
            self::TYPE_POST => 'text-green-500 bg-green-500/10 border-green-500/20',
            self::TYPE_SECURITY => 'text-orange-500 bg-orange-500/10 border-orange-500/20',
            self::TYPE_PROFILE_LIKE => 'text-red-500 bg-red-500/10 border-red-500/20',
            self::TYPE_FOLLOW => 'text-purple-500 bg-purple-500/10 border-purple-500/20',
        ];
        return $colors[$this->type] ?? 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }

    public function getBadgeColorAttribute()
    {
        $colors = [
            self::PRIORITY_LOW => 'bg-gray-500',
            self::PRIORITY_NORMAL => 'bg-blue-500',
            self::PRIORITY_HIGH => 'bg-orange-500',
            self::PRIORITY_CRITICAL => 'bg-red-500',
        ];
        return $colors[$this->priority ?? self::PRIORITY_NORMAL] ?? 'bg-blue-500';
    }

    public function shouldSendEmail()
    {
        return $this->channel === self::CHANNEL_EMAIL ||
            $this->channel === self::CHANNEL_BOTH;
    }

    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('id_uti', $userId);
    }

    public function scopePriority($query, $priority)
    {
        return $query->where('priority', $priority);
    }

    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }
}
