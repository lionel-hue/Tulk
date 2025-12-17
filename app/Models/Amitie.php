<?php
// app/Models/Amitie.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Amitie extends Model
{
    use HasFactory;

    protected $table = 'Amitie';
    public $timestamps = false;
    public $incrementing = false; // Since we have composite keys

    protected $fillable = [
        'id_1',
        'id_2', 
        'statut'
    ];

    // Set composite primary keys
    protected $primaryKey = ['id_1', 'id_2'];

    // Friendship belongs to user 1
    public function utilisateur1()
    {
        return $this->belongsTo(Utilisateur::class, 'id_1');
    }

    // Friendship belongs to user 2
    public function utilisateur2()
    {
        return $this->belongsTo(Utilisateur::class, 'id_2');
    }

    // Scope to get friends of a user
    public function scopeFriendsOfUser($query, $userId)
    {
        return $query->where(function($q) use ($userId) {
            $q->where('id_1', $userId)
              ->orWhere('id_2', $userId);
        })->where('statut', 'ami');
    }

    // Scope to get pending requests for a user
    public function scopePendingForUser($query, $userId)
    {
        return $query->where('id_2', $userId)
                     ->where('statut', 'en attente');
    }

    // Check if two users are friends
    public static function areFriends($user1Id, $user2Id)
    {
        return self::where(function($query) use ($user1Id, $user2Id) {
            $query->where('id_1', $user1Id)
                  ->where('id_2', $user2Id);
        })->orWhere(function($query) use ($user1Id, $user2Id) {
            $query->where('id_1', $user2Id)
                  ->where('id_2', $user1Id);
        })->where('statut', 'ami')
        ->exists();
    }

    // Check if there's a pending request
    public static function hasPendingRequest($fromUserId, $toUserId)
    {
        return self::where('id_1', $fromUserId)
                   ->where('id_2', $toUserId)
                   ->where('statut', 'en attente')
                   ->exists();
    }
}