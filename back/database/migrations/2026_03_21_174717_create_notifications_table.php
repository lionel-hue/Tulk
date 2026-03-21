<?php
// back/database/migrations/2026_03_21_170000_create_notifications_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('Notification', function (Blueprint $table) {
            $table->id();
            $table->integer('id_uti'); // User who receives notification
            $table->integer('id_uti_from')->nullable(); // User who triggered notification
            $table->string('type'); // notification_type (like, comment, friend_request, etc.)
            $table->string('title');
            $table->text('message');
            $table->integer('related_id')->nullable(); // Post ID, Comment ID, etc.
            $table->string('related_type')->nullable(); // App\\Models\\Article, etc.
            $table->json('data')->nullable(); // Additional metadata
            $table->boolean('is_read')->default(false); 
            $table->boolean('email_sent')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->foreign('id_uti')->references('id')->on('Utilisateur')->onDelete('cascade');
            $table->foreign('id_uti_from')->references('id')->on('Utilisateur')->onDelete('set null');
            $table->index(['id_uti', 'is_read']);
            $table->index(['type', 'created_at']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('Notification');
    }
};
