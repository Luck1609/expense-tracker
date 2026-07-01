<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreIncomeSourceRequest;
use App\Http\Requests\UpdateIncomeSourceRequest;
use App\Models\IncomeSource;
use Inertia\Inertia;

class IncomeSourceController extends Controller
{
    public function index()
    {
        $incomeSources = auth()->user()->incomeSources()->latest()->get();

        return Inertia::render('income-sources', [
            'incomeSources' => $incomeSources,
        ]);
    }

    public function store(StoreIncomeSourceRequest $request)
    {
        auth()->user()->incomeSources()->create($request->validated());

        return redirect()->back()->with('success', 'Income source created successfully.');
    }

    public function update(UpdateIncomeSourceRequest $request, IncomeSource $incomeSource)
    {
        $this->authorize('update', $incomeSource);

        $incomeSource->update($request->validated());

        return redirect()->back()->with('success', 'Income source updated successfully.');
    }

    public function destroy(IncomeSource $incomeSource)
    {
        $this->authorize('delete', $incomeSource);

        $incomeSource->delete();

        return redirect()->back()->with('success', 'Income source deleted successfully.');
    }
}
