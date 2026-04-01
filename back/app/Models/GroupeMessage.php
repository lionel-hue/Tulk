<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GroupeMessage extends Model
{
    protected $table = 'GroupeMessage';
    protected $fillable = ['groupe_id', 'utilisateur_id', 'texte', 'image'];

    public function groupe()
    {
        return $this->belongsTo(Groupe::class, 'groupe_id');
    }

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateur_id');
    }
}
