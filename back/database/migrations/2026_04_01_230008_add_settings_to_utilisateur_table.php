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
        Schema::table('Utilisateur', function (Blueprint $table) {
            $table->string('lang')->default('fr')->after('email');
            $table->string('theme')->default('dark')->after('lang');
            $table->boolean('email_notifications')->default(true)->after('theme');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('Utilisateur', function (Blueprint $table) {
            $table->dropColumn(['lang', 'theme', 'email_notifications']);
        });
    }
};
