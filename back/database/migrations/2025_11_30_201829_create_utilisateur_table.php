<?php
// database/migrations/xxxx_xx_xx_000001_create_utilisateur_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('Utilisateur', function (Blueprint $table) {
            $table->integer('id', true);
            $table->text('nom');
            $table->text('prenom')->nullable();
            $table->enum('role', ['admin', 'mod', 'user'])->nullable();
            $table->text('image')->nullable();
            $table->enum('sexe', ['M', 'F'])->nullable();
            $table->text('mdp');
            $table->text('email');
        });
    }

    public function down()
    {
        Schema::dropIfExists('Utilisateur');
    }
};