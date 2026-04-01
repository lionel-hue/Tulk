<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('GroupeMessage', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('groupe_id');
            $table->integer('utilisateur_id');
            $table->text('texte')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();

            $table->foreign('groupe_id')->references('id')->on('Groupe')->onDelete('cascade');
            $table->foreign('utilisateur_id')->references('id')->on('Utilisateur')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('groupe_message');
    }
};
