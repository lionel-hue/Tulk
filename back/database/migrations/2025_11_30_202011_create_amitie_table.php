<?php
// database/migrations/xxxx_xx_xx_000004_create_amitie_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('Amitie', function (Blueprint $table) {
            $table->integer('id_1');
            $table->integer('id_2');
            $table->enum('statut', ['en attente', 'ami']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('Amitie');
    }
};