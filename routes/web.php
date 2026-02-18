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
    Route::delete('members/{member}', [\App\Http\Controllers\MemberController::class, 'destroy'])->name('members.destroy');

    //My member profile
    Route::get('my-membership', [\App\Http\Controllers\MemberController::class, 'editSelf'])->name('members.self');
    Route::post('my-membership', [\App\Http\Controllers\MemberController::class, 'updateSelf'])->name('members.self.update');


    //Payments
    Route::get('payments', [\App\Http\Controllers\PaymentsController::class, 'index'])->name('payments');
    Route::get('payments/create/{memberId?}', [\App\Http\Controllers\PaymentsController::class, 'create'])->name('payments.create');
    Route::post('payments', [\App\Http\Controllers\PaymentsController::class, 'store'])->name('payments.store');
    Route::get('payments/{payment}', [\App\Http\Controllers\PaymentsController::class, 'edit'])->name('payments.edit');
    Route::post('payments/{payment}', [\App\Http\Controllers\PaymentsController::class, 'update'])->name('payments.update');
    Route::delete('payments/{payment}', [\App\Http\Controllers\PaymentsController::class, 'destroy'])->name('payments.destroy');

    //My Payments
    Route::get('my-payments', [\App\Http\Controllers\PaymentsController::class, 'myPaymentsIndex'])->name('my-payments');

    //Grave reservations
    Route::get('graves', [\App\Http\Controllers\GraveReservationController::class, 'index'])->name('graves.index');
    Route::post('graves/reserve', [\App\Http\Controllers\GraveReservationController::class, 'reserve'])->name('graves.reserve');
    Route::post('graves/{reservation}/remove', [\App\Http\Controllers\GraveReservationController::class, 'remove'])->name('graves.remove');

    //Unverified users
    Route::get('unverified-users', [\App\Http\Controllers\UnverifiedUserController::class, 'index'])->name('unverified-users');
    Route::delete('unverified-users/{user}', [\App\Http\Controllers\UnverifiedUserController::class, 'destroy'])->name('unverified-users.destroy');

    //Users
    Route::get('users', [\App\Http\Controllers\UserController::class, 'index'])->name('users.index');
    Route::get('users/{user}', [\App\Http\Controllers\UserController::class, 'edit'])->name('users.edit');
    Route::post('users/{user}', [\App\Http\Controllers\UserController::class, 'update'])->name('users.update');

    //Expenses
    Route::get('expenses', [\App\Http\Controllers\ExpenseController::class, 'index'])->name('expenses.index');
    Route::get('expenses/create', [\App\Http\Controllers\ExpenseController::class, 'create'])->name('expenses.create');
    Route::post('expenses', [\App\Http\Controllers\ExpenseController::class, 'store'])->name('expenses.store');
    Route::get('expenses/{expense}', [\App\Http\Controllers\ExpenseController::class, 'show'])->name('expenses.show');
    Route::get('expenses/{expense}/edit', [\App\Http\Controllers\ExpenseController::class, 'edit'])->name('expenses.edit');
    Route::post('expenses/{expense}', [\App\Http\Controllers\ExpenseController::class, 'update'])->name('expenses.update');
    Route::delete('expenses/{expense}', [\App\Http\Controllers\ExpenseController::class, 'destroy'])->name('expenses.destroy');

    //Tickets (user)
    Route::get('tickets', [\App\Http\Controllers\TicketController::class, 'index'])->name('tickets.index');
    Route::get('tickets/create', [\App\Http\Controllers\TicketController::class, 'create'])->name('tickets.create');
    Route::post('tickets', [\App\Http\Controllers\TicketController::class, 'store'])->name('tickets.store');
    Route::get('tickets/{ticket}', [\App\Http\Controllers\TicketController::class, 'show'])->name('tickets.show');
    Route::post('tickets/{ticket}/messages', [\App\Http\Controllers\TicketController::class, 'storeMessage'])->name('tickets.messages.store');
    Route::delete('tickets/{ticket}', [\App\Http\Controllers\TicketController::class, 'destroy'])->name('tickets.destroy');

    //Tickets (admin)
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('tickets', [\App\Http\Controllers\Admin\TicketController::class, 'index'])->name('tickets.index');
        Route::get('tickets/{ticket}', [\App\Http\Controllers\Admin\TicketController::class, 'show'])->name('tickets.show');
        Route::post('tickets/{ticket}/reply', [\App\Http\Controllers\Admin\TicketController::class, 'reply'])->name('tickets.reply');
        Route::delete('tickets/{ticket}', [\App\Http\Controllers\Admin\TicketController::class, 'destroy'])->name('tickets.destroy');
    });

    //Polls
    Route::get('polls', [\App\Http\Controllers\PollController::class, 'index'])->name('polls');
    Route::get('polls/create', [\App\Http\Controllers\PollController::class, 'create'])->name('polls.create');
    Route::post('polls', [\App\Http\Controllers\PollController::class, 'store'])->name('polls.store');
    Route::get('polls/{poll}', [\App\Http\Controllers\PollController::class, 'edit'])->name('polls.edit');
    Route::post('polls/{poll}', [\App\Http\Controllers\PollController::class, 'update'])->name('polls.update');
    Route::get('polls/show/{poll}', [\App\Http\Controllers\PollController::class, 'show'])->name('polls.show');
    Route::delete('polls/{poll}', [\App\Http\Controllers\PollController::class, 'destroy'])->name('polls.destroy');
    Route::post('polls/{poll}/vote', [\App\Http\Controllers\PollController::class, 'vote'])->name('polls.vote');

    //Reports
    Route::get('reports', [\App\Http\Controllers\ReportController::class, 'index'])->name('reports.index');
    Route::get('reports/create', [\App\Http\Controllers\ReportController::class, 'create'])->name('reports.create');
    Route::post('reports', [\App\Http\Controllers\ReportController::class, 'store'])->name('reports.store');
    Route::get('reports/{report}', [\App\Http\Controllers\ReportController::class, 'show'])->name('reports.show');
    Route::get('reports/{report}/edit', [\App\Http\Controllers\ReportController::class, 'edit'])->name('reports.edit');
    Route::post('reports/{report}', [\App\Http\Controllers\ReportController::class, 'update'])->name('reports.update');
    Route::delete('reports/{report}', [\App\Http\Controllers\ReportController::class, 'destroy'])->name('reports.destroy');

    //Articles
    Route::get('articles', [\App\Http\Controllers\ArticleController::class, 'index'])->name('articles');
    Route::get('articles/create', [\App\Http\Controllers\ArticleController::class, 'create'])->name('articles.create');
    Route::post('articles', [\App\Http\Controllers\ArticleController::class, 'store'])->name('articles.store');
    Route::get('articles/{article}', [\App\Http\Controllers\ArticleController::class, 'edit'])->name('articles.edit');
    Route::post('articles/{article}', [\App\Http\Controllers\ArticleController::class, 'update'])->name('articles.update');
    Route::get('articles/show/{article}', [\App\Http\Controllers\ArticleController::class, 'show'])->name('articles.show');
    Route::delete('articles/{article}', [\App\Http\Controllers\ArticleController::class, 'destroy'])->name('articles.destroy');

    //Projects
    Route::get('projects', [\App\Http\Controllers\ProjectController::class, 'index'])->name('projects.index');
    Route::get('projects/create', [\App\Http\Controllers\ProjectController::class, 'create'])->name('projects.create');
    Route::post('projects', [\App\Http\Controllers\ProjectController::class, 'store'])->name('projects.store');
    Route::get('projects/{project}', [\App\Http\Controllers\ProjectController::class, 'show'])->name('projects.show');
    Route::get('projects/{project}/edit', [\App\Http\Controllers\ProjectController::class, 'edit'])->name('projects.edit');
    Route::post('projects/{project}', [\App\Http\Controllers\ProjectController::class, 'update'])->name('projects.update');
    Route::delete('projects/{project}', [\App\Http\Controllers\ProjectController::class, 'destroy'])->name('projects.destroy');
    Route::post('projects/{project}/join', [\App\Http\Controllers\ProjectController::class, 'join'])->name('projects.join');
    Route::post('projects/{project}/interests/{interest}/confirm', [\App\Http\Controllers\ProjectController::class, 'confirmInterest'])->name('projects.interests.confirm');
    Route::delete('projects/{project}/interests/{interest}', [\App\Http\Controllers\ProjectController::class, 'destroyInterest'])->name('projects.interests.destroy');

    //Memorials
    Route::get('memorials', [\App\Http\Controllers\MemorialController::class, 'index'])->name('memorials.index');
    Route::get('memorials/create', [\App\Http\Controllers\MemorialController::class, 'create'])->name('memorials.create');
    Route::post('memorials', [\App\Http\Controllers\MemorialController::class, 'store'])->name('memorials.store');
    Route::get('memorials/{memorial}', [\App\Http\Controllers\MemorialController::class, 'show'])->name('memorials.show');
    Route::get('memorials/{memorial}/edit', [\App\Http\Controllers\MemorialController::class, 'edit'])->name('memorials.edit');
    Route::post('memorials/{memorial}', [\App\Http\Controllers\MemorialController::class, 'update'])->name('memorials.update');
    Route::delete('memorials/{memorial}', [\App\Http\Controllers\MemorialController::class, 'destroy'])->name('memorials.destroy');

    //Stats
    Route::get('stats', [\App\Http\Controllers\StatsController::class, 'index'])->name('stats.index');

    //Dzemat page
    Route::get('dzemat', [\App\Http\Controllers\DzematPageController::class, 'show'])->name('dzemat.show');
    Route::get('dzemat/edit', [\App\Http\Controllers\DzematPageController::class, 'edit'])->name('dzemat.edit');
    Route::post('dzemat', [\App\Http\Controllers\DzematPageController::class, 'update'])->name('dzemat.update');
    Route::post('dzemat/upload', [\App\Http\Controllers\DzematPageController::class, 'upload'])->name('dzemat.upload');

    //Document library
    Route::get('documents', [\App\Http\Controllers\DocumentLibraryController::class, 'index'])->name('documents.index');
    Route::post('documents', [\App\Http\Controllers\DocumentLibraryController::class, 'store'])->name('documents.store');
    Route::delete('documents/{media}', [\App\Http\Controllers\DocumentLibraryController::class, 'destroy'])->name('documents.destroy');

    //Mekteb
    Route::get('mekteb', [\App\Http\Controllers\MektebController::class, 'index'])->name('mekteb.index');
    Route::get('mekteb/create', [\App\Http\Controllers\MektebController::class, 'create'])->name('mekteb.create');
    Route::post('mekteb', [\App\Http\Controllers\MektebController::class, 'store'])->name('mekteb.store');
    Route::get('mekteb/{mekteb}', [\App\Http\Controllers\MektebController::class, 'show'])->name('mekteb.show');
    Route::get('mekteb/{mekteb}/edit', [\App\Http\Controllers\MektebController::class, 'edit'])->name('mekteb.edit');
    Route::post('mekteb/{mekteb}', [\App\Http\Controllers\MektebController::class, 'update'])->name('mekteb.update');
    Route::delete('mekteb/{mekteb}', [\App\Http\Controllers\MektebController::class, 'destroy'])->name('mekteb.destroy');

    //Content items (Dove i hadisi)
    Route::get('content-items', [\App\Http\Controllers\ContentItemController::class, 'index'])->name('content-items.index');
    Route::get('content-items/create', [\App\Http\Controllers\ContentItemController::class, 'create'])->name('content-items.create');
    Route::post('content-items', [\App\Http\Controllers\ContentItemController::class, 'store'])->name('content-items.store');
    Route::get('content-items/{contentItem}/edit', [\App\Http\Controllers\ContentItemController::class, 'edit'])->name('content-items.edit');
    Route::post('content-items/{contentItem}', [\App\Http\Controllers\ContentItemController::class, 'update'])->name('content-items.update');
    Route::get('content-items/{contentItem}', [\App\Http\Controllers\ContentItemController::class, 'show'])->name('content-items.show');
    Route::delete('content-items/{contentItem}', [\App\Http\Controllers\ContentItemController::class, 'destroy'])->name('content-items.destroy');

    //Boards
    Route::get('boards', [\App\Http\Controllers\BoardController::class, 'index'])->name('boards.index');
    Route::get('boards/create', [\App\Http\Controllers\BoardController::class, 'create'])->name('boards.create');
    Route::post('boards', [\App\Http\Controllers\BoardController::class, 'store'])->name('boards.store');
    Route::get('boards/{board}', [\App\Http\Controllers\BoardController::class, 'edit'])->name('boards.edit');
    Route::post('boards/{board}', [\App\Http\Controllers\BoardController::class, 'update'])->name('boards.update');
});



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
