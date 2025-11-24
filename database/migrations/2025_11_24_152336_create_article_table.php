<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('Article', function (Blueprint $table) {
            $table->integer('id', true); // AUTO_INCREMENT
            $table->text('image')->nullable();
            $table->text('description')->nullable();
            $table->timestamp('date')->useCurrent();
            $table->integer('id_uti');
            // No timestamps()
        });
    }

    public function down()
    {
        Schema::dropIfExists('Article');
    }
};