<?php
// database/migrations/xxxx_xx_xx_000006_create_liker_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('Liker', function (Blueprint $table) {
            $table->integer('id', true)->unsigned();
            $table->text('type')->nullable();
            $table->integer('id_uti');
            $table->integer('id_arti');
        });
    }

    public function down()
    {
        Schema::dropIfExists('Liker');
    }
};