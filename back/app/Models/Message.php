<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $table = 'Message';
    public $timestamps = false;

    protected $fillable = [
        'date',
        'image',
        'texte',
        'id_uti_1', // Sender
        'id_uti_2'  // Receiver
    ];

    /**
     * Relationship: The user who sent the message.
     */
    public function sender()
    {
        return $this->belongsTo(Utilisateur::class, 'id_uti_1');
    }

    /**
     * Relationship: The user who received the message.
     */
    public function receiver()
    {
        return $this->belongsTo(Utilisateur::class, 'id_uti_2');
    }
}
