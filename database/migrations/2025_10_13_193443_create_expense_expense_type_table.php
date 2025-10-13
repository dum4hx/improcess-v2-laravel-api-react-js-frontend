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
        Schema::create('expense_expense_type', function (Blueprint $table) {
            $table->uuid()->primary();

            // Foreign keys
            $table->uuid("expense_id");
            $table->uuid("expense_type_id");

            $table->timestamps();

            // Foreign key constraints
            $table->foreign("expense_id")->references("id")->on("expenses")->onDelete("cascade");
            $table->foreign("expense_type_id")->references("id")->on("expense_types")->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expense_expense_type');
    }
};
