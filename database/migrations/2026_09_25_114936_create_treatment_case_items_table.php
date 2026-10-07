<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('treatment_case_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('treatment_case_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('treatment_service_id')
                ->constrained('treatments')
                ->restrictOnDelete();

            $table->string('tooth_number')->nullable();

            $table->unsignedInteger('quantity')->default(1);

            $table->decimal('unit_price', 10, 2);
            $table->decimal('total_price', 10, 2);

            $table->enum('status', [
                'pending',
                'in_progress',
                'completed',
                'cancelled',
            ])->default('pending');

            $table->timestamp('completed_at')->nullable();

            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('treatment_case_items');
    }
};
