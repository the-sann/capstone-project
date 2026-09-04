<?php

use App\Http\Controllers\Appointment\AppointmentController;
use App\Http\Controllers\Dentists\DentistController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\Patients\PatientController;
use App\Http\Controllers\Treatments\TreatmentController;
use App\Http\Controllers\Treatments\TreatmentServiceController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('dentists', DentistController::class);
    Route::resource('patients', PatientController::class);
    Route::resource('treatments', TreatmentController::class);
    Route::patch(
        '/appointments/{appointment}/close',
        [AppointmentController::class, 'close']
    )->name('appointments.close');
    Route::resource('appointments', AppointmentController::class);
    Route::get('/services-treatments', [TreatmentServiceController::class, 'services'])->name('services-treatments.index');
    Route::post('/language/{locale}', [LanguageController::class, 'switch'])->name('language.switch');
});

require __DIR__ . '/settings.php';
