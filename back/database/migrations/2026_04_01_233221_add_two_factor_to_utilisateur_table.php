<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('Utilisateur', function (Blueprint $table) {
            $table->boolean('two_factor_enabled')->default(false)->after('email_notifications');
        });
    }

    public function down(): void
    {
        Schema::table('Utilisateur', function (Blueprint $table) {
            $table->dropColumn('two_factor_enabled');
        });
    }
};
