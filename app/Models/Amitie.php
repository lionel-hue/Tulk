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

    protected $fillable = [
        'id_1',
        'id_2',
        'statut'
    ];

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
}