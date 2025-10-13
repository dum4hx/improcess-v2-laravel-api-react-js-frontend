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
        Schema::create('transfers', function (Blueprint $table) {
            $table->uuid("id")->primary();
            // Foreign keys
            $table->uuid("receiving_account_id");
            $table->uuid("sending_account_id");

            // Other attributes
            $table->timestamps();

            // Foreign key constraints
            $table->foreign("receiving_account_id")->references("id")->on("accounts")->onDelete("cascade");
            $table->foreign("sending_account_id")->references("id")->on("accounts")->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transfers');
    }
};
