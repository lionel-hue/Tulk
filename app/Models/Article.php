<?php

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
        return $this->hasMany(Commentaire::class, 'id_arti');
    }

    public function likes()
    {
        // Check if Liker model exists before trying to use it
        if (class_exists(Liker::class)) {
            return $this->hasMany(Liker::class, 'id_arti');
        }
        
        // Return empty relationship if Liker doesn't exist
        return $this->hasMany(Utilisateur::class, 'id')->whereRaw('1 = 0');
    }
}