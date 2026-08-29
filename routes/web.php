<?php

use App\Http\Controllers\Dentists\DentistController;
use App\Http\Controllers\Patients\PatientController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('dentists', DentistController::class);
    Route::resource('patients', PatientController::class);

    Route::post('/language/{locale}', function (string $locale) {
        if (! in_array($locale, ['en', 'km'])) {
            abort(400);
        }

        session()->put('locale', $locale);

        return back();
    })->name('language.switch');
});

require __DIR__ . '/settings.php';
