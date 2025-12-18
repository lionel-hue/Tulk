<?php
// database/migrations/xxxx_xx_xx_000002_create_article_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('Article', function (Blueprint $table) {
            $table->integer('id', true);
            $table->text('image')->nullable();
            $table->text('description')->nullable();
            $table->timestamp('date')->useCurrent();
            $table->integer('id_uti');
        });
    }

    public function down()
    {
        Schema::dropIfExists('Article');
    }
};