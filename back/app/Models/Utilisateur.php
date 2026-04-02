<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Utilisateur extends Authenticatable
{
    use HasFactory, HasApiTokens, Notifiable;

    protected $table = 'Utilisateur';
    public $timestamps = false;

    protected $fillable = [
        'nom',
        'prenom',
        'role',
        'image',
        'sexe',
        'mdp',
        'email',
        'bio',
        'location',
        'website',
        'banner',
        'lang',
        'theme',
        'email_notifications',
        'two_factor_enabled',
        'last_seen',
        'created_at'
    ];

    protected $hidden = ['mdp'];

    // User's posts
    public function articles()
    {
        return $this->hasMany(Article::class, 'id_uti');
    }

    // User's friendships
    public function amities1()
    {
        return $this->hasMany(Amitie::class, 'id_1');
    }

    public function amities2()
    {
        return $this->hasMany(Amitie::class, 'id_2');
    }

    public function amis()
    {
        $amis1 = $this->amities1()->where('statut', 'ami')->with('utilisateur2')->get()->pluck('utilisateur2');
        $amis2 = $this->amities2()->where('statut', 'ami')->with('utilisateur1')->get()->pluck('utilisateur1');
        return $amis1->merge($amis2);
    }

    // Profile likes received
    public function profileLikesReceived()
    {
        return $this->hasMany(ProfileLike::class, 'id_uti_profile');
    }

    // Profile likes given
    public function profileLikesGiven()
    {
        return $this->hasMany(ProfileLike::class, 'id_uti');
    }

    // Followers (people who follow this user)
    public function followers()
    {
        return $this->hasMany(Follow::class, 'following_id');
    }

    // Following (people this user follows)
    public function following()
    {
        return $this->hasMany(Follow::class, 'follower_id');
    }

    // Get followers count
    public function getFollowersCountAttribute()
    {
        return $this->followers()->count();
    }

    // Get following count
    public function getFollowingCountAttribute()
    {
        return $this->following()->count();
    }

    // Get profile likes count
    public function getProfileLikesCountAttribute()
    {
        return $this->profileLikesReceived()->count();
    }

    // Check if user is followed by another user
    public function isFollowedBy($userId)
    {
        return $this->followers()->where('follower_id', $userId)->exists();
    }

    // Check if user follows another user
    public function follows($userId)
    {
        return $this->following()->where('following_id', $userId)->exists();
    }

    // Messages sent by this user
    public function messagesSent()
    {
        return $this->hasMany(Message::class, 'id_uti_1');
    }

    // Messages received by this user
    public function messagesReceived()
    {
        return $this->hasMany(Message::class, 'id_uti_2');
    }

    // Groups this user belongs to
    public function groupes()
    {
        return $this->belongsToMany(Groupe::class, 'GroupeMembre', 'utilisateur_id', 'groupe_id')
                    ->withPivot('role', 'joined_at')
                    ->withTimestamps();
    }

    /**
     * Check if user is online (active in the last 5 minutes)
     */
    public function isOnline()
    {
        if (!$this->last_seen) {
            return false;
        }

        return \Carbon\Carbon::parse($this->last_seen)->greaterThan(now()->subMinutes(5));
    }
}
