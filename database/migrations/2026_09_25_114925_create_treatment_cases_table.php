<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('treatment_cases', function (Blueprint $table) {
            $table->id();

            $table->string('case_id')->unique();

            $table->foreignId('patient_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('dentist_id')
                ->constrained()
                ->restrictOnDelete();

            $table->text('diagnosis')->nullable();
            $table->text('notes')->nullable();

            $table->enum('status', [
                'ongoing',
                'completed',
                'cancelled',
            ])->default('ongoing');

            $table->decimal('total_amount', 10, 2)->default(0);
            $table->decimal('paid_amount', 10, 2)->default(0);
            $table->decimal('balance_amount', 10, 2)->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('treatment_cases');
    }
};
