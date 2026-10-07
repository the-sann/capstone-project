<?php

use App\Http\Controllers\Appointment\AppointmentController;
use App\Http\Controllers\Dentists\DentistController;
use App\Http\Controllers\Invoice\InvoiceController;
use App\Http\Controllers\Invoice\PaymentController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\Patients\PatientController;
use App\Http\Controllers\TreatmentCase\TreatmentCaseController;
use App\Http\Controllers\TreatmentCase\TreatmentCaseItemController;
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
    Route::get('/all-appointments', [AppointmentController::class, 'getAllAppointments'])->name('appointments.all');
    Route::get('/appointment-reminders/due', [AppointmentController::class, 'due'])->name('appointments.due');
    Route::patch('/appointment-reminders/{reminder}/remind', [AppointmentController::class, 'remind'])->name('appointments.remind');
    Route::resource('appointments', AppointmentController::class);
    Route::get('/services-treatments', [TreatmentServiceController::class, 'services'])->name('services-treatments.index');
    Route::resource('treatments-case', TreatmentCaseController::class)->parameters(['treatments-case' => 'treatmentCase',]);
    Route::get('treatments-case/{treatmentCase}/items/create', [TreatmentCaseItemController::class, 'create'])->name('treatments-case-items.create');
    Route::post('treatments-case/{treatmentCase}/items', [TreatmentCaseItemController::class, 'store'])->name('treatments-case-items.store');
    Route::get('treatments-case/{treatmentCase}/items/{item}/edit', [TreatmentCaseItemController::class, 'edit'])->name('treatments-case-items.edit');
    Route::delete('treatments-case/{treatmentCase}/items/{item}', [TreatmentCaseItemController::class, 'destroy'])->name('treatments-case-items.destroy');
    Route::get('treatments-case/{treatmentCase}/appointments/create', [AppointmentController::class, 'createForTreatmentCase'])->name('treatments-case.appointments.create');
    Route::patch('treatments-case/{treatmentCase}/items/{item}/complete', [TreatmentCaseItemController::class, 'complete'])->name('treatments-case-items.complete');
    Route::get('invoices/{invoice}', [InvoiceController::class, 'show'])->name('invoices.show');
    Route::get('treatment-cases/{treatmentCase}/invoice/create', [InvoiceController::class, 'create'])->name('invoices.create');
    Route::post('treatment-cases/{treatmentCase}/invoice', [InvoiceController::class, 'store'])->name('invoices.store');
    Route::get('invoices/{invoice}/payment/create', [PaymentController::class, 'create'])->name('payments.create');
    Route::post('invoices/{invoice}/payment', [PaymentController::class, 'store'])->name('payments.store');
    Route::post('/language/{locale}', [LanguageController::class, 'switch'])->name('language.switch');
});


require __DIR__ . '/settings.php';
