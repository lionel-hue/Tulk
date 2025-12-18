<?php
// app/Models/Liker.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Liker extends Model
{
    use HasFactory;

    protected $table = 'Liker';
    public $timestamps = false;

    protected $fillable = [
        'id_uti',
        'id_arti'
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