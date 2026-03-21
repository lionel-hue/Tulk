<?php
// back/database/migrations/2025_12_01_000001_add_profile_fields_to_utilisateur.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('Utilisateur', function (Blueprint $table) {
            $table->text('bio')->nullable()->after('image');
            $table->string('location')->nullable()->after('bio');
            $table->string('website')->nullable()->after('location');
            $table->text('banner')->nullable()->after('website');
            $table->timestamp('created_at')->useCurrent()->after('banner');
        });
    }
    
    public function down()
    {
        Schema::table('Utilisateur', function (Blueprint $table) {
            $table->dropColumn(['bio', 'location', 'website', 'banner', 'created_at']);
        });
    }
};