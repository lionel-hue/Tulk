<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Groupe extends Model
{
    protected $table = 'Groupe';
    protected $fillable = ['nom', 'description', 'image', 'id_createur', 'is_locked', 'allow_member_invite'];

    public function membres()
    {
        return $this->hasMany(GroupeMembre::class, 'groupe_id');
    }

    public function messages()
    {
        return $this->hasMany(GroupeMessage::class, 'groupe_id');
    }

    public function createur()
    {
        return $this->belongsTo(Utilisateur::class, 'id_createur');
    }

    public function users()
    {
        return $this->belongsToMany(Utilisateur::class, 'GroupeMembre', 'groupe_id', 'utilisateur_id')
                    ->withPivot('role', 'joined_at')
                    ->withTimestamps();
    }
}
