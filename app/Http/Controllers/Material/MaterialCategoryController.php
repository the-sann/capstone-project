<?php

namespace App\Http\Controllers\Material;

use App\Http\Controllers\Controller;
use App\Models\MaterialCategory;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class MaterialCategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('materials/categories', [
            'categories' => MaterialCategory::withCount('materials')
                ->orderBy('name')
                ->get(['id', 'name', 'description']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:material_categories,name'],
            'description' => ['nullable', 'string'],
        ]);

        MaterialCategory::create($data);

        return back()->with('success', 'Category created.');
    }

    public function update(Request $request, MaterialCategory $category)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('material_categories', 'name')->ignore($category)],
            'description' => ['nullable', 'string'],
        ]);

        $category->update($data);

        return back()->with('success', 'Category updated.');
    }

    public function destroy(MaterialCategory $category)
    {
        if ($category->materials()->exists()) {
            return back()->withErrors([
                'delete' => 'This category still has materials. Move or delete them first.',
            ]);
        }

        $category->delete();

        return back()->with('success', 'Category deleted.');
    }
}
