<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Utilisateur extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'Utilisateur';
    
    // Add this line to disable timestamps
    public $timestamps = false;

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'mdp',
        'role',
        'sexe',
        'image'
    ];

    protected $hidden = [
        'mdp'
    ];

    // Tell Laravel to use 'mdp' for password
    public function getAuthPassword()
    {
        return $this->mdp;
    }
}