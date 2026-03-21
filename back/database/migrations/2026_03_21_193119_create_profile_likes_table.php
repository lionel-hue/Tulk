<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('ProfileLike', function (Blueprint $table) {
            $table->id();
            $table->integer('id_uti'); // User who liked
            $table->integer('id_uti_profile'); // Profile being liked
            $table->timestamp('date')->useCurrent();

            $table->foreign('id_uti')->references('id')->on('Utilisateur')->onDelete('cascade');
            $table->foreign('id_uti_profile')->references('id')->on('Utilisateur')->onDelete('cascade');
            $table->unique(['id_uti', 'id_uti_profile']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('ProfileLike');
    }
};
