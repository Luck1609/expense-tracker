<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\IncomeSourceController;
use App\Http\Controllers\InsightController;
use App\Http\Controllers\LabelController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TransactionController;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Http\Controllers\AuthenticatedSessionController;


Route::get('/', [AuthenticatedSessionController::class, 'create'])->middleware('guest')->name('login');
Route::get('/login', fn () => redirect('/'))->name('login.redirect');
Route::inertia('/register', 'auth/register')->name('register');

// Route::getRoutes()->refreshNameLookups();
// Route::getRoutes()->refreshActionLookups();

Route::middleware(['auth', 'verified'])->group(function () {
  Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
  Route::get('/reports', [ReportController::class, 'index'])->name('report.index');
  Route::get('/insights', [InsightController::class, 'index'])->name('insight.index');
  Route::post('/insights', [InsightController::class, 'store'])->name('insight.store');

  Route::resource('categories', CategoryController::class)->except(['show', 'create', 'edit'])
    ->middleware(HandlePrecognitiveRequests::class);
  
  Route::resource('income', IncomeSourceController::class)->except(['show', 'create', 'edit'])
    ->middleware(HandlePrecognitiveRequests::class);
  
  Route::resource('transactions', TransactionController::class)->except(['show', 'create', 'edit'])
    ->middleware(HandlePrecognitiveRequests::class);
  
  Route::resource('labels', LabelController::class)->except(['show', 'create', 'edit'])
    ->middleware(HandlePrecognitiveRequests::class);
});

require __DIR__ . '/settings.php';
