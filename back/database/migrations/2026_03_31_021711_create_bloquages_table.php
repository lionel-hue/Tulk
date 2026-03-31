<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bloquages', function (Blueprint $table) {
            $table->id();
            $table->integer('id_bloqueur');
            $table->integer('id_bloque');
            $table->timestamps();

            $table->foreign('id_bloqueur')->references('id')->on('Utilisateur')->onDelete('cascade');
            $table->foreign('id_bloque')->references('id')->on('Utilisateur')->onDelete('cascade');
            
            $table->unique(['id_bloqueur', 'id_bloque']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bloquages');
    }
};
