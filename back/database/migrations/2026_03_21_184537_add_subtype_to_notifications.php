<?php
// back/database/migrations/2026_03_21_180000_add_subtype_to_notifications.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('Notification', function (Blueprint $table) {
            $table->string('subtype')->nullable()->after('type');
            $table->string('priority')->default('normal')->after('data');
            $table->string('channel')->default('both')->after('priority');
        });
    }

    public function down()
    {
        Schema::table('Notification', function (Blueprint $table) {
            $table->dropColumn(['subtype', 'priority', 'channel']);
        });
    }
};
