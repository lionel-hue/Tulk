<?php
// app/Models/Utilisateur.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;


class Utilisateur extends Model
{
    use HasFactory, HasApiTokens;

    protected $table = 'Utilisateur';
    public $timestamps = false;

    protected $fillable = [
        'nom',
        'prenom',
        'role',
        'image',
        'sexe',
        'mdp',
        'email'
    ];

    // User's posts
    public function articles()
    {
        return $this->hasMany(Article::class, 'id_uti');
    }

    // User's friendships where they are id_1
    public function amities1()
    {
        return $this->hasMany(Amitie::class, 'id_1');
    }

    // User's friendships where they are id_2
    public function amities2()
    {
        return $this->hasMany(Amitie::class, 'id_2');
    }

    // Get all friends (both directions)
    public function amis()
    {
        $amis1 = $this->amities1()->where('statut', 'ami')->with('utilisateur2')->get()->pluck('utilisateur2');
        $amis2 = $this->amities2()->where('statut', 'ami')->with('utilisateur1')->get()->pluck('utilisateur1');
        
        return $amis1->merge($amis2);
    }
}