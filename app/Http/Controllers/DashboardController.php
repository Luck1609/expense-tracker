<?php

namespace App\Http\Controllers;

use App\Enums\TransactionType;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    $userId = Auth::id();
    $now = Carbon::now();
    $monthStart = $now->copy()->startOfMonth();
    $monthEnd = $now->copy()->endOfMonth();

    // --- summary ---
    $allTime = Transaction::where('user_id', $userId)
      ->selectRaw("
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses
      ")
      ->first();

    $monthly = Transaction::where('user_id', $userId)
      ->whereBetween('date', [$monthStart, $monthEnd])
      ->selectRaw("
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as monthly_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as monthly_expenses
      ")
      ->first();

    $totalBalance = (float) ($allTime->total_income ?? 0) - (float) ($allTime->total_expenses ?? 0);
    $monthlyIncome = (float) ($monthly->monthly_income ?? 0);
    $monthlyExpenses = (float) ($monthly->monthly_expenses ?? 0);
    $savingsRate = $monthlyIncome > 0
      ? round(($monthlyIncome - $monthlyExpenses) / $monthlyIncome * 100, 2)
      : 0;

    $summary = compact('totalBalance', 'monthlyIncome', 'monthlyExpenses', 'savingsRate');

    // --- trends (last 6 months, oldest → newest) ---
    $trends = collect(range(5, 0))->map(function ($offset) use ($userId, $now) {
      $month = $now->copy()->subMonths($offset);
      $start = $month->copy()->startOfMonth();
      $end = $month->copy()->endOfMonth();

      $row = Transaction::where('user_id', $userId)
        ->whereBetween('date', [$start, $end])
        ->selectRaw("
          SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
          SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expenses
        ")
        ->first();

      return [
        'month' => $month->format('M'),
        'income' => (float) ($row->income ?? 0),
        'expenses' => (float) ($row->expenses ?? 0),
      ];
    })->values()->all();

    // --- categories (current month, expenses only) ---
    $categories = Transaction::where('transactions.user_id', $userId)
      ->where('transactions.type', TransactionType::EXPENSE)
      ->whereBetween('transactions.date', [$monthStart, $monthEnd])
      ->join('categories', 'categories.id', '=', 'transactions.category_id')
      ->selectRaw('categories.name, categories.color, SUM(transactions.amount) as amount')
      ->groupBy('categories.id', 'categories.name', 'categories.color')
      ->orderByDesc('amount')
      ->get()
      ->map(fn ($row) => [
        'name' => $row->name,
        'amount' => (float) $row->amount,
        'color' => $row->color,
      ])
      ->all();

    // --- recentTransactions (last 5) ---
    $recentTransactions = Transaction::where('transactions.user_id', $userId)
      ->with(['category', 'incomeSource', 'labels'])
      ->orderByDesc('date')
      ->orderByDesc('created_at')
      ->limit(5)
      ->get()
      ->map(fn (Transaction $t) => [
        'id' => $t->id,
        'type' => $t->type->value,
        'amount' => (float) $t->amount,
        'date' => $t->date->toDateString(),
        'notes' => $t->notes,
        'categoryName' => $t->category?->name,
        'sourceName' => $t->incomeSource?->name,
      ])
      ->all();

    return inertia('dashboard', compact('summary', 'trends', 'categories', 'recentTransactions'));
  }

}
