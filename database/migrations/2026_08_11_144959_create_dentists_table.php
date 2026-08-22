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
        Schema::create('dentists', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('profile_image')->nullable();
            $table->unsignedInteger('year_experienced')->default(0);
            $table->string('user_type')->default('receptionist');
            $table->boolean('is_dentist')->default(false);
            $table->text('skill')->nullable();
            $table->boolean('status')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dentists');
    }
};
