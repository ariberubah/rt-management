<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ResidentController;
use App\Http\Controllers\HouseController;
use App\Http\Controllers\BillingPeriodController;
use App\Http\Controllers\BillingItemController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\ExpenseCategoryController;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

Route::resource('residents', ResidentController::class);
Route::resource('houses', HouseController::class);
Route::resource('billing-periods', BillingPeriodController::class);
Route::resource('billing-items', BillingItemController::class);
Route::resource('payments', PaymentController::class);
Route::resource('expenses', ExpenseController::class);
Route::resource('expense-categories', ExpenseCategoryController::class);

// Custom routes
Route::post('houses/{house}/assign-resident', [HouseController::class, 'assignResident'])->name('houses.assign-resident');
Route::post('houses/{house}/unassign-resident', [HouseController::class, 'unassignResident'])->name('houses.unassign-resident');
Route::post('billing-periods/{billingPeriod}/generate', [BillingPeriodController::class, 'generate'])->name('billing-periods.generate');
Route::post('payments/annual', [PaymentController::class, 'storeAnnual'])->name('payments.annual');
Route::fallback(function () { return Inertia::render('Error', ['status' => 404]); });