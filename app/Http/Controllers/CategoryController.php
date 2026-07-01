<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CategoryController extends Controller
{
  public function index()
  {
    $user = Auth::user();
    $categories = $user-> categories()->latest()->get();
    $labels = $user-> labels()->latest()->get();

    return inertia("categories", [
      'categories' => $categories,
      'labels' => $labels,
    ]);
  }

  public function store(StoreCategoryRequest $request)
  {
    Auth::categories()->create($request->validated());

    return redirect()->back()->with('success', 'Category created successfully.');
  }

  public function update(UpdateCategoryRequest $request, Category $category)
  {
    $category->update($request->validated());

    return redirect()->back()->with('success', 'Category updated successfully.');
  }

  public function destroy(Category $category)
  {
    $category->delete();

    return redirect()->back()->with('success', 'Category deleted successfully.');
  }
}
