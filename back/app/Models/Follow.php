<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Follow extends Model
{
    use HasFactory;

    protected $table = 'Follow';
    public $timestamps = false;

    protected $fillable = [
        'follower_id',
        'following_id',
        'created_at'
    ];

    public function follower()
    {
        return $this->belongsTo(Utilisateur::class, 'follower_id');
    }

    public function following()
    {
        return $this->belongsTo(Utilisateur::class, 'following_id');
    }
}
