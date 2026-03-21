<?php
// database/migrations/xxxx_xx_xx_000003_create_commentaire_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('Commentaire', function (Blueprint $table) {
            $table->integer('id', true);
            $table->text('texte');
            $table->timestamp('date')->useCurrent();
            $table->integer('id_arti');
            $table->integer('id_uti');
        });
    }

    public function down()
    {
        Schema::dropIfExists('Commentaire');
    }
};