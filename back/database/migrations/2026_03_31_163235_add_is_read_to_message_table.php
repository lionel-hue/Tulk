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
        Schema::table('Message', function (Blueprint $table) {
            $table->boolean('is_read')->default(false)->after('id_uti_2');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('Message', function (Blueprint $table) {
            $table->dropColumn('is_read');
        });
    }
};
