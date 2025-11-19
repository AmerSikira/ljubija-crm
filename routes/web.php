<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\WorkOS\Http\Middleware\ValidateSessionWithWorkOS;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware([
    'auth',
    ValidateSessionWithWorkOS::class,
])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('members', [\App\Http\Controllers\MemberController::class, 'index'])->name('members');
    Route::get('members/create', [\App\Http\Controllers\MemberController::class, 'create'])->name('members.create');
    Route::post('members', [\App\Http\Controllers\MemberController::class, 'store'])->name('members.store');
    Route::get('members/{member}', [\App\Http\Controllers\MemberController::class, 'edit'])->name('members.edit');
    Route::post('members/{member}', [\App\Http\Controllers\MemberController::class, 'update'])->name('members.update');


    //Payments
    Route::get('payments', [\App\Http\Controllers\PaymentsController::class, 'index'])->name('payments');
    Route::get('payments/create/{memberId?}', [\App\Http\Controllers\PaymentsController::class, 'create'])->name('payments.create');
    Route::post('payments', [\App\Http\Controllers\PaymentsController::class, 'store'])->name('payments.store');
    Route::get('payments/{payment}', [\App\Http\Controllers\PaymentsController::class, 'edit'])->name('payments.edit');
    Route::post('payments/{payment}', [\App\Http\Controllers\PaymentsController::class, 'update'])->name('payments.update');
});



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
