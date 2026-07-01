<?php

namespace App\Http\Controllers;

use App\Enums\TransactionType;
use App\Models\Insight;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class InsightController extends Controller
{
  public function index()
  {
    $insights = Insight::where('user_id', Auth::id())
      ->latest('generated_at')
      ->get()
      ->map(fn (Insight $i) => [
        'id' => $i->id,
        'type' => $i->type,
        'title' => $i->title,
        'message' => $i->message,
        'generatedAt' => $i->generated_at->toISOString(),
        'isRead' => $i->is_read,
      ])
      ->all();

    return inertia('insights', ['insights' => $insights]);
  }

  public function store(Request $request)
  {
    $userId = Auth::id();
    $now = Carbon::now();
    $monthStart = $now->copy()->startOfMonth();
    $monthEnd = $now->copy()->endOfMonth();
    $lastMonthStart = $now->copy()->subMonth()->startOfMonth();
    $lastMonthEnd = $now->copy()->subMonth()->endOfMonth();

    $currentMonth = Transaction::where('user_id', $userId)
      ->whereBetween('date', [$monthStart, $monthEnd])
      ->selectRaw("
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expenses
      ")
      ->first();

    $lastMonth = Transaction::where('user_id', $userId)
      ->whereBetween('date', [$lastMonthStart, $lastMonthEnd])
      ->selectRaw("
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expenses
      ")
      ->first();

    $income = (float) ($currentMonth->income ?? 0);
    $expenses = (float) ($currentMonth->expenses ?? 0);
    $lastExpenses = (float) ($lastMonth->expenses ?? 0);
    $savingsRate = $income > 0 ? (($income - $expenses) / $income) * 100 : 0;

    $topCategory = Transaction::where('transactions.user_id', $userId)
      ->where('transactions.type', TransactionType::EXPENSE)
      ->whereBetween('transactions.date', [$monthStart, $monthEnd])
      ->join('categories', 'categories.id', '=', 'transactions.category_id')
      ->selectRaw('categories.name, SUM(transactions.amount) as total')
      ->groupBy('categories.id', 'categories.name')
      ->orderByDesc('total')
      ->first();

    $newInsights = [];

    // Summary insight
    $newInsights[] = [
      'user_id' => $userId,
      'type' => 'summary',
      'title' => 'Monthly Summary',
      'message' => sprintf(
        'This month you earned %s and spent %s, giving you a savings rate of %.1f%%.',
        '$' . number_format($income, 2),
        '$' . number_format($expenses, 2),
        $savingsRate
      ),
      'generated_at' => $now,
    ];

    // Spending trend
    if ($lastExpenses > 0) {
      $change = (($expenses - $lastExpenses) / $lastExpenses) * 100;
      $direction = $change >= 0 ? 'increased' : 'decreased';
      $newInsights[] = [
        'user_id' => $userId,
        'type' => 'spending_trend',
        'title' => 'Spending Trend',
        'message' => sprintf(
          'Your expenses %s by %.1f%% compared to last month (%s vs %s).',
          $direction,
          abs($change),
          '$' . number_format($expenses, 2),
          '$' . number_format($lastExpenses, 2)
        ),
        'generated_at' => $now,
      ];
    }

    // Saving tip
    if ($savingsRate < 20 && $income > 0) {
      $newInsights[] = [
        'user_id' => $userId,
        'type' => 'saving_tip',
        'title' => 'Boost Your Savings',
        'message' => sprintf(
          'Your savings rate is %.1f%%. Consider aiming for at least 20%% by reducing discretionary spending.',
          $savingsRate
        ),
        'generated_at' => $now,
      ];
    } elseif ($savingsRate >= 20) {
      $newInsights[] = [
        'user_id' => $userId,
        'type' => 'saving_tip',
        'title' => 'Great Savings Pace',
        'message' => sprintf(
          'You are saving %.1f%% of your income this month. Keep it up!',
          $savingsRate
        ),
        'generated_at' => $now,
      ];
    }

    // Warning if top category is heavy
    if ($topCategory && $income > 0 && ((float) $topCategory->total / $income) > 0.4) {
      $newInsights[] = [
        'user_id' => $userId,
        'type' => 'warning',
        'title' => 'High Spending Category',
        'message' => sprintf(
          '"%s" accounts for %.1f%% of your income this month ($%s). Consider reviewing this area.',
          $topCategory->name,
          ((float) $topCategory->total / $income) * 100,
          number_format((float) $topCategory->total, 2)
        ),
        'generated_at' => $now,
      ];
    }

    Insight::insert($newInsights);

    return redirect()->route('insight.index');
  }
}
