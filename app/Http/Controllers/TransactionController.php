<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Models\Transaction;
use Inertia\Inertia;

class TransactionController extends Controller
{
  public function index()
  {
    $transactions = auth()->user()->transactions()
      ->with(['category', 'incomeSource', 'labels'])
      ->latest('date')
      ->get();

    $categories = auth()->user()->categories()->latest()->get();
    $incomeSources = auth()->user()->incomeSources()->latest()->get();
    $labels = auth()->user()->labels()->latest()->get();

    return Inertia::render('transactions', [
      'transactions' => $transactions,
      'categories' => $categories,
      'incomeSources' => $incomeSources,
      'labels' => $labels,
    ]);
  }

  public function store(StoreTransactionRequest $request)
  {
    $data = $request->validated();
    $labelIds = $data['label_ids'] ?? [];
    unset($data['label_ids']);

    $transaction = auth()->user()->transactions()->create($data);

    if (! empty($labelIds)) {
      $transaction->labels()->attach($labelIds);
    }

    return redirect()->back()->with('success', 'Transaction created successfully.');
  }

  public function update(UpdateTransactionRequest $request, Transaction $transaction)
  {
    $this->authorize('update', $transaction);

    $data = $request->validated();
    $labelIds = $data['label_ids'] ?? [];
    unset($data['label_ids']);

    $transaction->update($data);

    $transaction->labels()->sync($labelIds);

    return redirect()->back()->with('success', 'Transaction updated successfully.');
  }

  public function destroy(Transaction $transaction)
  {
    $this->authorize('delete', $transaction);

    $transaction->delete();

    return redirect()->back()->with('success', 'Transaction deleted successfully.');
  }
}
