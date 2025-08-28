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
});



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
