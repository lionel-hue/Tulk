<?php
// database/migrations/xxxx_xx_xx_000007_add_foreign_keys_to_french_tables.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Amitie foreign keys
        Schema::table('Amitie', function (Blueprint $table) {
            $table->primary(['id_1', 'id_2']);
            $table->foreign('id_1')->references('id')->on('Utilisateur');
            $table->foreign('id_2')->references('id')->on('Utilisateur');
        });

        // Article foreign key
        Schema::table('Article', function (Blueprint $table) {
            $table->foreign('id_uti')->references('id')->on('Utilisateur');
        });

        // Commentaire foreign keys
        Schema::table('Commentaire', function (Blueprint $table) {
            $table->foreign('id_arti')->references('id')->on('Article');
            $table->foreign('id_uti')->references('id')->on('Utilisateur');
        });

        // Liker foreign keys
        Schema::table('Liker', function (Blueprint $table) {
            $table->foreign('id_uti')->references('id')->on('Utilisateur');
            $table->foreign('id_arti')->references('id')->on('Article');
        });

        // Message foreign keys
        Schema::table('Message', function (Blueprint $table) {
            $table->foreign('id_uti_1')->references('id')->on('Utilisateur');
            $table->foreign('id_uti_2')->references('id')->on('Utilisateur');
        });
    }

    public function down()
    {
        // Drop foreign keys in reverse order
        Schema::table('Message', function (Blueprint $table) {
            $table->dropForeign(['id_uti_1']);
            $table->dropForeign(['id_uti_2']);
        });

        Schema::table('Liker', function (Blueprint $table) {
            $table->dropForeign(['id_uti']);
            $table->dropForeign(['id_arti']);
        });

        Schema::table('Commentaire', function (Blueprint $table) {
            $table->dropForeign(['id_arti']);
            $table->dropForeign(['id_uti']);
        });

        Schema::table('Article', function (Blueprint $table) {
            $table->dropForeign(['id_uti']);
        });

        Schema::table('Amitie', function (Blueprint $table) {
            $table->dropForeign(['id_1']);
            $table->dropForeign(['id_2']);
            $table->dropPrimary(['id_1', 'id_2']);
        });
    }
};