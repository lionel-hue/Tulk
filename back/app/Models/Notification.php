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
        'title',
        'message',
        'related_id',
        'related_type',
        'data',
        'is_read',
        'email_sent',
        'read_at'
    ];

    protected $casts = [
        'data' => 'array',
        'is_read' => 'boolean',
        'email_sent' => 'boolean',
        'read_at' => 'datetime'
    ];

    // Relationship with recipient user
    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'id_uti');
    }

    // Relationship with sender user
    public function utilisateurFrom()
    {
        return $this->belongsTo(Utilisateur::class, 'id_uti_from');
    }

    // Polymorphic relationship with related model
    public function notifiable()
    {
        return $this->morphTo();
    }

    // Mark notification as read
    public function markAsRead()
    {
        $this->update([
            'is_read' => true,
            'read_at' => now()
        ]);
    }

    // Get notification icon based on type
    public function getIconAttribute()
    {
        $icons = [
            'like' => '❤️',
            'comment' => '💬',
            'friend_request' => '👥',
            'friend_accepted' => '✅',
            'mention' => '📢',
            'welcome' => '🎉',
            'system' => '⚙️',
        ];
        return $icons[$this->type] ?? '🔔';
    }

    // Get notification color based on type
    public function getColorAttribute()
    {
        $colors = [
            'like' => 'text-red-500 bg-red-500/10',
            'comment' => 'text-blue-500 bg-blue-500/10',
            'friend_request' => 'text-purple-500 bg-purple-500/10',
            'friend_accepted' => 'text-green-500 bg-green-500/10',
            'mention' => 'text-yellow-500 bg-yellow-500/10',
            'welcome' => 'text-pink-500 bg-pink-500/10',
            'system' => 'text-gray-500 bg-gray-500/10',
        ];
        return $colors[$this->type] ?? 'text-gray-500 bg-gray-500/10';
    }
}
