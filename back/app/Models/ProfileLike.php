<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfileLike extends Model
{
    use HasFactory;

    protected $table = 'ProfileLike';
    public $timestamps = false;

    protected $fillable = [
        'id_uti',
        'id_uti_profile',
        'date'
    ];

    public function user()
    {
        return $this->belongsTo(Utilisateur::class, 'id_uti');
    }

    public function profile()   
    {
        return $this->belongsTo(Utilisateur::class, 'id_uti_profile');
    }
}
