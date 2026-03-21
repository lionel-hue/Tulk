// back/database/migrations/2026_03_21_193252_create_follows_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('Follow', function (Blueprint $table) {
            $table->id();
            $table->integer('follower_id');
            $table->integer('following_id');
            $table->timestamp('created_at')->useCurrent();
            $table->foreign('follower_id')->references('id')->on('Utilisateur')->onDelete('cascade');
            $table->foreign('following_id')->references('id')->on('Utilisateur')->onDelete('cascade');
            $table->unique(['follower_id', 'following_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('Follow');
    }
};
