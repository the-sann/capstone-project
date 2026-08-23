<?php

use App\Http\Controllers\Dentists\DentistController;
use App\Http\Controllers\Patients\PatientController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('dentists', DentistController::class);
    Route::resource('patients', PatientController::class);
});

require __DIR__ . '/settings.php';
