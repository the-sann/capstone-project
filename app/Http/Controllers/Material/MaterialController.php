<?php

namespace App\Http\Controllers\Material;

use App\Http\Controllers\Controller;
use App\Enums\StockReason;
use App\Http\Requests\MaterialRequest;
use App\Models\Material;
use App\Models\MaterialCategory;
use App\Services\StockService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\StockMovement;

class MaterialController extends Controller
{

    public function index(): Response
    {
        return Inertia::render('materials/index');
    }
    public function list(Request $request): Response
    {
        $materials = Material::query()
            ->with('category:id,name')
            ->when($request->string('search')->toString(), function ($q, $search) {
                $q->where(fn($q) => $q
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%"));
            })
            ->when($request->input('category'), fn($q, $id) => $q->where('material_category_id', $id))
            ->when($request->boolean('low'), fn($q) => $q->lowStock())
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString()
            ->through(fn(Material $m) => [
                'id' => $m->id,
                'sku' => $m->sku,
                'name' => $m->name,
                'unit' => $m->unit,
                'category' => $m->category?->name,
                'current_stock' => (float) $m->current_stock,
                'min_stock' => (float) $m->min_stock,
                'unit_cost' => (float) $m->unit_cost,
                'is_low_stock' => $m->is_low_stock,
                'is_active' => $m->is_active,
                'image_path' => $m->image_path,
            ]);

        return Inertia::render('materials/list', [
            'materials' => $materials,
            'categories' => MaterialCategory::orderBy('name')->get(['id', 'name']),
            'filters' => $request->only('search', 'category', 'low'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('materials/form', [
            'material' => null,
            'categories' => MaterialCategory::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(MaterialRequest $request, StockService $stock)
    {
        $data = $request->validated();
        $opening = (float) ($data['opening_stock'] ?? 0);
        $expiry = $data['opening_expiry_date'] ?? null;
        unset($data['opening_stock'], $data['opening_expiry_date'], $data['image']);
        $imagePath = $request->file('image')?->store('materials', 'public');


        DB::transaction(function () use ($data, $imagePath, $opening, $expiry, $stock) {
            $material = Material::create([...$data, 'image_path' => $imagePath]);

            if ($opening > 0) {
                $stock->stockIn(
                    material: $material,
                    quantity: $opening,
                    unitCost: (float) ($data['unit_cost'] ?? 0),
                    expiryDate: $expiry,
                    reason: StockReason::Opening,
                    note: 'Opening stock',
                );
            }
        });

        return to_route('materials.index')->with('success', 'Material created.');
    }

    public function edit(Material $material): Response
    {
        return Inertia::render('materials/form', [
            'material' => $material->only([
                'id',
                'material_category_id',
                'sku',
                'name',
                'unit',
                'min_stock',
                'unit_cost',
                'track_expiry',
                'is_active',
                'description',
                'image_path',
            ]),
            'categories' => MaterialCategory::orderBy('name')->get(['id', 'name']),
        ]);
    }


    public function update(MaterialRequest $request, Material $material)
    {
        // Stock levels are changed only through StockService, never here
        $data = $request->safe()->except(['opening_stock', 'opening_expiry_date', 'image']);
        if ($request->hasFile('image')) {
            if ($material->image_path) {
                Storage::disk('public')->delete($material->image_path);
            }
            $data['image_path'] = $request->file('image')->store('materials', 'public');
        }

        $material->update($data);
        return to_route('materials.index')->with('success', 'Material updated.');
    }
    public function show(Material $material): Response
    {
        $material->load('category:id,name');

        $batches = $material->batches()
            ->inStock()
            ->orderByRaw('expiry_date IS NULL')
            ->orderBy('expiry_date')
            ->get()
            ->map(fn($b) => [
                'id' => $b->id,
                'batch_no' => $b->batch_no,
                'expiry_date' => $b->expiry_date?->toDateString(),
                'days_left' => $b->expiry_date ? (int) today()->diffInDays($b->expiry_date, false) : null,
                'quantity' => (float) $b->quantity_remaining,
                'unit_cost' => (float) $b->unit_cost,
            ]);

        $movements = $material->movements()
            ->with('creator:id,name')
            ->latest('id')
            ->take(10)
            ->get()
            ->map(fn(StockMovement $m) => [
                'id' => $m->id,
                'date' => $m->created_at->format('Y-m-d H:i'),
                'type' => $m->type->value,
                'reason' => $m->reason?->value,
                'quantity' => (float) $m->quantity,
                'balance_after' => (float) $m->balance_after,
                'user' => $m->creator?->name,
            ]);

        return Inertia::render('materials/show', [
            'material' => [
                'id' => $material->id,
                'sku' => $material->sku,
                'name' => $material->name,
                'category' => $material->category?->name,
                'unit' => $material->unit,
                'description' => $material->description,
                'image_path' => $material->image_path,
                'current_stock' => (float) $material->current_stock,
                'min_stock' => (float) $material->min_stock,
                'unit_cost' => (float) $material->unit_cost,
                'track_expiry' => $material->track_expiry,
                'is_active' => $material->is_active,
                'is_low_stock' => $material->is_low_stock,
            ],
            'batches' => $batches,
            'movements' => $movements,
        ]);
    }

    public function destroy(Material $material)
    {
        if ($material->movements()->exists()) {
            return back()->withErrors([
                'delete' => 'This material has stock history. Mark it inactive instead.',
            ]);
        }

        $material->delete();

        return to_route('materials.index')->with('success', 'Material deleted.');
    }
}
