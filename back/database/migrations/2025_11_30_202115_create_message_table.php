<?php
// database/migrations/xxxx_xx_xx_000005_create_message_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('Message', function (Blueprint $table) {
            $table->integer('id', true);
            $table->date('date');
            $table->text('image');
            $table->text('texte');
            $table->integer('id_uti_1');
            $table->integer('id_uti_2');
        });
    }

    public function down()
    {
        Schema::dropIfExists('Message');
    }
};