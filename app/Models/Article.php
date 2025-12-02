<?php
// app/Models/Article.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $table = 'Article';
    public $timestamps = false;

    protected $fillable = [
        'description',
        'image',
        'date',
        'id_uti'
    ];

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'id_uti');
    }

    public function commentaires()
    {
        return $this->hasMany(Commentaire::class, 'id_arti')->with('utilisateur');
    }

    public function likes()
    {
        return $this->hasMany(Liker::class, 'id_arti');
    }

    // Helper method to check if current user liked this post
    public function isLikedBy($userId)
    {
        return $this->likes()->where('id_uti', $userId)->exists();
    }

    // Helper method to get like count
    public function getLikesCountAttribute()
    {
        return $this->likes()->count();
    }

    // Helper method to get comments count
    public function getCommentsCountAttribute()
    {
        return $this->commentaires()->count();
    }
}