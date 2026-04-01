<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GroupeMembre extends Model
{
    protected $table = 'GroupeMembre';
    protected $fillable = ['groupe_id', 'utilisateur_id', 'role', 'joined_at'];

    public function groupe()
    {
        return $this->belongsTo(Groupe::class, 'groupe_id');
    }

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateur_id');
    }
}
