<?php

namespace App\Http\Controllers\Stock;

use App\Enums\StockReason;
use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\MaterialBatch;
use App\Models\StockMovement;
use App\Services\StockService;
use DomainException;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;

class StockController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('stock/index', [
            'stats' => [
                'low_stock' => Material::active()->lowStock()->count(),
                'expiring' => MaterialBatch::expiringWithin(30)->count(),
            ],
        ]);
    }

    public function showIn(): Response
    {
        return Inertia::render('stock/in', [
            'materials' => Material::active()
                ->orderBy('name')
                ->get(['id', 'sku', 'name', 'unit', 'track_expiry', 'unit_cost']),
        ]);
    }

    public function storeIn(Request $request, StockService $stock)
    {
        $data = $request->validate([
            'material_id' => ['required', 'exists:materials,id'],
            'quantity' => ['required', 'numeric', 'gt:0'],
            'unit_cost' => ['nullable', 'numeric', 'min:0'],
            'batch_no' => ['nullable', 'string', 'max:100'],
            'expiry_date' => ['nullable', 'date', 'after:today'],
            'reason' => ['required', Rule::enum(StockReason::class)->only([
                StockReason::Opening,
                StockReason::Returned,
            ])],
            'note' => ['nullable', 'string', 'max:500'],
        ]);

        try {
            $stock->stockIn(
                material: Material::findOrFail($data['material_id']),
                quantity: (float) $data['quantity'],
                unitCost: (float) ($data['unit_cost'] ?? 0),
                batchNo: $data['batch_no'] ?? null,
                expiryDate: $data['expiry_date'] ?? null,
                reason: StockReason::from($data['reason']),
                note: $data['note'] ?? null,
            );
        } catch (DomainException $e) {
            return back()->withErrors(['quantity' => $e->getMessage()]);
        }

        return back()->with('success', 'Stock added.');
    }

    public function showAdjustments(): Response
    {
        return Inertia::render('stock/adjustments', [
            'batches' => MaterialBatch::inStock()
                ->with('material:id,name,sku,unit')
                ->orderBy('material_id')
                ->orderBy('expiry_date')
                ->get()
                ->map(fn($b) => [
                    'id' => $b->id,
                    'material' => $b->material->name,
                    'unit' => $b->material->unit,
                    'batch_no' => $b->batch_no,
                    'expiry_date' => $b->expiry_date?->toDateString(),
                    'quantity' => (float) $b->quantity_remaining,
                    'is_expired' => $b->expiry_date?->isPast() ?? false,
                ]),
        ]);
    }

    public function storeAdjustment(Request $request, StockService $stock)
    {
        $data = $request->validate([
            'batch_id' => ['required', 'exists:material_batches,id'],
            'counted_quantity' => ['required', 'numeric', 'min:0'],
            'reason' => ['required', Rule::enum(StockReason::class)->only([
                StockReason::Correction,
                StockReason::Expired,
                StockReason::Damaged,
                StockReason::Lost,
            ])],
            'note' => ['nullable', 'string', 'max:500'],
        ]);

        try {
            $movement = $stock->adjust(
                MaterialBatch::findOrFail($data['batch_id']),
                (float) $data['counted_quantity'],
                StockReason::from($data['reason']),
                $data['note'] ?? null,
            );
        } catch (DomainException $e) {
            return back()->withErrors(['counted_quantity' => $e->getMessage()]);
        }

        return back()->with('success', $movement ? 'Stock adjusted.' : 'No change, quantity already matches.');
    }

    public function history(Request $request): Response
    {
        $movements = StockMovement::query()
            ->with(['material:id,name,sku,unit', 'batch:id,batch_no,expiry_date', 'creator:id,name'])
            ->when($request->input('material'), fn($q, $id) => $q->where('material_id', $id))
            ->when($request->input('type'), fn($q, $type) => $q->where('type', $type))
            ->latest('id')
            ->paginate(20)
            ->withQueryString()
            ->through(fn(StockMovement $m) => [
                'id' => $m->id,
                'date' => $m->created_at->format('Y-m-d H:i'),
                'material' => $m->material->name,
                'unit' => $m->material->unit,
                'batch_no' => $m->batch?->batch_no,
                'type' => $m->type->value,
                'reason' => $m->reason?->value,
                'quantity' => (float) $m->quantity,
                'balance_after' => (float) $m->balance_after,
                'note' => $m->note,
                'user' => $m->creator?->name,
            ]);

        return Inertia::render('stock/history', [
            'movements' => $movements,
            'materials' => Material::orderBy('name')->get(['id', 'name']),
            'filters' => $request->only('material', 'type'),
        ]);
    }

    public function expiry(Request $request): Response
    {
        $days = (int) $request->input('days', 30);

        $batches = MaterialBatch::inStock()
            ->with('material:id,name,sku,unit')
            ->whereNotNull('expiry_date')
            ->whereDate('expiry_date', '<=', today()->addDays($days))
            ->orderBy('expiry_date')
            ->get()
            ->map(fn($b) => [
                'id' => $b->id,
                'material' => $b->material->name,
                'unit' => $b->material->unit,
                'batch_no' => $b->batch_no,
                'expiry_date' => $b->expiry_date->toDateString(),
                'quantity' => (float) $b->quantity_remaining,
                'days_left' => (int) today()->diffInDays($b->expiry_date, false),
            ]);

        return Inertia::render('stock/expiry', ['batches' => $batches, 'days' => $days]);
    }

    public function low(): Response
    {
        return Inertia::render('stock/low', [
            'materials' => Material::active()->lowStock()
                ->with('category:id,name')
                ->orderBy('name')
                ->get()
                ->map(fn($m) => [
                    'id' => $m->id,
                    'sku' => $m->sku,
                    'name' => $m->name,
                    'category' => $m->category?->name,
                    'unit' => $m->unit,
                    'current_stock' => (float) $m->current_stock,
                    'min_stock' => (float) $m->min_stock,
                    'shortfall' => max(0, (float) $m->min_stock - (float) $m->current_stock),
                ]),
        ]);
    }

    public function showOut(): Response
    {
        return Inertia::render('stock/out', [
            'materials' => Material::active()
                ->withSum(['batches as usable_stock' => fn($q) => $q->usable()], 'quantity_remaining')
                ->orderBy('name')
                ->get(['id', 'sku', 'name', 'unit'])
                ->map(fn($m) => [
                    'id' => $m->id,
                    'sku' => $m->sku,
                    'name' => $m->name,
                    'unit' => $m->unit,
                    'usable_stock' => (float) ($m->usable_stock ?? 0),
                ]),
        ]);
    }

    public function storeOut(Request $request, StockService $stock)
    {
        $data = $request->validate([
            'reason' => ['required', Rule::enum(StockReason::class)->only([
                StockReason::Used,
                StockReason::Damaged,
                StockReason::Lost,
                StockReason::Returned,
            ])],
            'note' => ['nullable', 'string', 'max:500'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.material_id' => ['required', 'distinct', 'exists:materials,id'],
            'items.*.quantity' => ['required', 'numeric', 'gt:0'],
        ], [
            'items.*.material_id.distinct' => 'This material is listed twice. Keep one line per material.',
        ]);

        try {
            DB::transaction(function () use ($data, $stock) {
                foreach ($data['items'] as $i => $item) {
                    try {
                        $stock->stockOut(
                            material: Material::findOrFail($item['material_id']),
                            quantity: (float) $item['quantity'],
                            reason: StockReason::from($data['reason']),
                            note: $data['note'] ?? null,
                        );
                    } catch (DomainException $e) {
                        // Point the error at the line that failed
                        throw ValidationException::withMessages([
                            "items.$i.quantity" => $e->getMessage(),
                        ]);
                    }
                }
            });
        } catch (ValidationException $e) {
            throw $e; // the transaction has already rolled back
        }

        return back()->with('success', 'Stock removed.');
    }
}
