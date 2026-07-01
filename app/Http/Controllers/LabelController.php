<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLabelRequest;
use App\Http\Requests\UpdateLabelRequest;
use App\Models\Label;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LabelController extends Controller
{
  public function index()
  {
    $labels = auth()->user()->labels()->latest()->get();

    return Inertia::render('labels', [
      'labels' => $labels,
    ]);
  }

  public function store(StoreLabelRequest $request)
  {
    auth()->user()->labels()->create($request->validated());

    return redirect()->back()->with('success', 'Label created successfully.');
  }

  public function update(UpdateLabelRequest $request, Label $label)
  {
    $this->authorize('update', $label);

    $label->update($request->validated());

    return redirect()->back()->with('success', 'Label updated successfully.');
  }

  public function destroy(Label $label)
  {
    $this->authorize('delete', $label);

    $label->delete();

    return redirect()->back()->with('success', 'Label deleted successfully.');
  }
}
