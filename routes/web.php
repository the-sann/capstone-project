<?php

use App\Http\Controllers\Appointment\AppointmentController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Dentists\DentistController;
use App\Http\Controllers\Invoice\InvoiceController;
use App\Http\Controllers\Invoice\PaymentController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\Material\MaterialCategoryController;
use App\Http\Controllers\Material\MaterialController;
use App\Http\Controllers\Material\PurchaseController;
use App\Http\Controllers\Material\SupplierController;
use App\Http\Controllers\Patients\PatientController;
use App\Http\Controllers\Stock\StockController;
use App\Http\Controllers\TreatmentCase\TreatmentCaseController;
use App\Http\Controllers\TreatmentCase\TreatmentCaseItemController;
use App\Http\Controllers\Treatments\TreatmentController;
use App\Http\Controllers\Treatments\TreatmentServiceController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

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
    Route::put('treatments-case/{treatmentCase}/items/{item}', [TreatmentCaseItemController::class, 'update'])->name('treatments-case-items.update');
    Route::patch('treatments-case/{treatmentCase}/items/{item}/complete', [TreatmentCaseItemController::class, 'complete'])->name('treatments-case-items.complete');
    Route::get('invoices/{invoice}', [InvoiceController::class, 'show'])->name('invoices.show');
    Route::get('treatment-cases/{treatmentCase}/invoice/create', [InvoiceController::class, 'create'])->name('invoices.create');
    Route::post('treatment-cases/{treatmentCase}/invoice', [InvoiceController::class, 'store'])->name('invoices.store');
    Route::get('invoices/{invoice}/payment/create', [PaymentController::class, 'create'])->name('payments.create');
    Route::post('invoices/{invoice}/payment', [PaymentController::class, 'store'])->name('payments.store');
    Route::get('invoices/{invoice}/print', [InvoiceController::class, 'print'])->name('invoices.print');
    Route::get('payments/{payment}/print', [PaymentController::class, 'print'])->name('payments.print');
    Route::get('payments/{payment}', [PaymentController::class, 'show'])->name('payments.show');


    Route::get('materials', [MaterialController::class, 'index'])->name('materials.index');   // your hub page
    Route::get('materials/all', [MaterialController::class, 'list'])->name('materials.list');
    Route::get('materials/{material}', [MaterialController::class, 'show'])
        ->whereNumber('material')
        ->name('materials.show');
    Route::resource('materials', MaterialController::class)->except(['index', 'show']);



    Route::resource('materials/categories', MaterialCategoryController::class)
        ->only(['index', 'store', 'update', 'destroy'])
        ->parameters(['categories' => 'category'])
        ->names('material-categories');

    Route::inertia('/loans', 'loans/index')->name('loans.index');
    Route::post('/language/{locale}', [LanguageController::class, 'switch'])->name('language.switch');
});

Route::middleware(['auth', 'verified'])->prefix('stock')->name('stock.')->group(function () {
    Route::get('/', [StockController::class, 'index'])->name('index');

    Route::get('in', [StockController::class, 'showIn'])->name('in');
    Route::post('in', [StockController::class, 'storeIn'])->name('receive');

    Route::get('out', [StockController::class, 'showOut'])->name('out');
    Route::post('out', [StockController::class, 'storeOut'])->name('issue');

    Route::get('adjustments', [StockController::class, 'showAdjustments'])->name('adjustments');
    Route::post('adjustments', [StockController::class, 'storeAdjustment'])->name('adjust');
    Route::get('history', [StockController::class, 'history'])->name('history');
    Route::get('expiry', [StockController::class, 'expiry'])->name('expiry');
    Route::get('low', [StockController::class, 'low'])->name('low');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('purchases')->name('purchases.')->group(function () {
        Route::get('{purchase}/print', [PurchaseController::class, 'print'])->name('print');
        Route::get('/', [PurchaseController::class, 'index'])->name('index');
        Route::get('create', [PurchaseController::class, 'create'])->name('create');
        Route::get('{purchase}/edit', [PurchaseController::class, 'edit'])->name('edit');
        Route::put('{purchase}', [PurchaseController::class, 'update'])->name('update');
        Route::post('/', [PurchaseController::class, 'store'])->name('store');
        Route::get('{purchase}', [PurchaseController::class, 'show'])->name('show');
        Route::post('{purchase}/receive', [PurchaseController::class, 'receive'])->name('receive');
        Route::post('{purchase}/cancel', [PurchaseController::class, 'cancel'])->name('cancel');
    });

    Route::post('suppliers', [SupplierController::class, 'store'])->name('suppliers.store');
});


require __DIR__ . '/settings.php';
