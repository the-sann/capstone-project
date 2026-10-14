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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();

            $table->string('invoice_id')->unique();

            $table->foreignId('treatment_case_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->decimal('subtotal', 12, 2)->default(0);

            $table->decimal('discount', 12, 2)->default(0);

            $table->decimal('total_amount', 12, 2)->default(0);

            $table->decimal('paid_amount', 12, 2)->default(0);

            $table->decimal('balance_amount', 12, 2)->default(0);

            $table->enum('status', [
                'unpaid',
                'partial',
                'paid',
                'cancelled',
            ])->default('unpaid');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
