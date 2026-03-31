<?php
// back/app/Models/Bloquage.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bloquage extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_bloqueur',
        'id_bloque'
    ];

    public function bloqueur()
    {
        return $this->belongsTo(Utilisateur::class, 'id_bloqueur');
    }

    public function bloque()
    {
        return $this->belongsTo(Utilisateur::class, 'id_bloque');
    }
}
