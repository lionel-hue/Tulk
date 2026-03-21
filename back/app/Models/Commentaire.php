<?php
// app/Models/Commentaire.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commentaire extends Model
{
    use HasFactory;

    protected $table = 'Commentaire';
    public $timestamps = false;

    protected $fillable = [
        'texte',
        'date',
        'id_arti',
        'id_uti'
    ];

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'id_uti');
    }

    public function article()
    {
        return $this->belongsTo(Article::class, 'id_arti');
    }
}