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
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    Route::get('members', [\App\Http\Controllers\MemberController::class, 'index'])->name('members');
    Route::get('members/create', [\App\Http\Controllers\MemberController::class, 'create'])->name('members.create');
    Route::post('members', [\App\Http\Controllers\MemberController::class, 'store'])->name('members.store');
    Route::get('members/{member}', [\App\Http\Controllers\MemberController::class, 'edit'])->name('members.edit');
    Route::post('members/{member}', [\App\Http\Controllers\MemberController::class, 'update'])->name('members.update');

    //My member profile
    Route::get('my-membership', [\App\Http\Controllers\MemberController::class, 'editSelf'])->name('members.self');
    Route::post('my-membership', [\App\Http\Controllers\MemberController::class, 'updateSelf'])->name('members.self.update');


    //Payments
    Route::get('payments', [\App\Http\Controllers\PaymentsController::class, 'index'])->name('payments');
    Route::get('payments/create/{memberId?}', [\App\Http\Controllers\PaymentsController::class, 'create'])->name('payments.create');
    Route::post('payments', [\App\Http\Controllers\PaymentsController::class, 'store'])->name('payments.store');
    Route::get('payments/{payment}', [\App\Http\Controllers\PaymentsController::class, 'edit'])->name('payments.edit');
    Route::post('payments/{payment}', [\App\Http\Controllers\PaymentsController::class, 'update'])->name('payments.update');

    //My Payments
    Route::get('my-payments', [\App\Http\Controllers\PaymentsController::class, 'myPaymentsIndex'])->name('my-payments');

    //Polls
    Route::get('polls', [\App\Http\Controllers\PollController::class, 'index'])->name('polls');
    Route::get('polls/create', [\App\Http\Controllers\PollController::class, 'create'])->name('polls.create');
    Route::post('polls', [\App\Http\Controllers\PollController::class, 'store'])->name('polls.store');
    Route::get('polls/{poll}', [\App\Http\Controllers\PollController::class, 'edit'])->name('polls.edit');
    Route::post('polls/{poll}', [\App\Http\Controllers\PollController::class, 'update'])->name('polls.update');
    Route::get('polls/show/{poll}', [\App\Http\Controllers\PollController::class, 'show'])->name('polls.show');
    Route::delete('polls/{poll}', [\App\Http\Controllers\PollController::class, 'destroy'])->name('polls.destroy');
    Route::post('polls/{poll}/vote', [\App\Http\Controllers\PollController::class, 'vote'])->name('polls.vote');

    //Articles
    Route::get('articles', [\App\Http\Controllers\ArticleController::class, 'index'])->name('articles');
    Route::get('articles/create', [\App\Http\Controllers\ArticleController::class, 'create'])->name('articles.create');
    Route::post('articles', [\App\Http\Controllers\ArticleController::class, 'store'])->name('articles.store');
    Route::get('articles/{article}', [\App\Http\Controllers\ArticleController::class, 'edit'])->name('articles.edit');
    Route::post('articles/{article}', [\App\Http\Controllers\ArticleController::class, 'update'])->name('articles.update');
    Route::get('articles/show/{article}', [\App\Http\Controllers\ArticleController::class, 'show'])->name('articles.show');

    //Content items (Dove i hadisi)
    Route::get('content-items', [\App\Http\Controllers\ContentItemController::class, 'index'])->name('content-items.index');
    Route::get('content-items/create', [\App\Http\Controllers\ContentItemController::class, 'create'])->name('content-items.create');
    Route::post('content-items', [\App\Http\Controllers\ContentItemController::class, 'store'])->name('content-items.store');
    Route::get('content-items/{contentItem}/edit', [\App\Http\Controllers\ContentItemController::class, 'edit'])->name('content-items.edit');
    Route::post('content-items/{contentItem}', [\App\Http\Controllers\ContentItemController::class, 'update'])->name('content-items.update');
    Route::get('content-items/{contentItem}', [\App\Http\Controllers\ContentItemController::class, 'show'])->name('content-items.show');

    //Boards
    Route::get('boards', [\App\Http\Controllers\BoardController::class, 'index'])->name('boards.index');
    Route::get('boards/create', [\App\Http\Controllers\BoardController::class, 'create'])->name('boards.create');
    Route::post('boards', [\App\Http\Controllers\BoardController::class, 'store'])->name('boards.store');
    Route::get('boards/{board}', [\App\Http\Controllers\BoardController::class, 'edit'])->name('boards.edit');
    Route::post('boards/{board}', [\App\Http\Controllers\BoardController::class, 'update'])->name('boards.update');
});



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
