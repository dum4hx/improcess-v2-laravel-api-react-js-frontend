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
        Schema::create('expenses', function (Blueprint $table) {
            $table->uuid("id")->primary();
            // Foreign keys
            $table->uuid("type_id");
            $table->uuid("account_id");
            $table->string("name");

            // Other attributes
            $table->decimal("amount", 10, 2);
            $table->timestamps();

            // Foreign key constraints
            $table->foreign("type_id")->references("id")->on("expense_types");
            $table->foreign("account_id")->references("id")->on("accounts")->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
