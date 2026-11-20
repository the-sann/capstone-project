<?php

namespace App\Http\Controllers\Material;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\Purchase;
use App\Models\Supplier;
use App\Services\StockService;
use App\Enums\PurchaseStatus;
use DomainException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseController extends Controller
{
    public function index(): Response
    {
        $purchases = Purchase::with('supplier:id,name')
            ->withCount('items')
            ->latest('id')
            ->paginate(15)
            ->through(fn(Purchase $p) => [
                'id' => $p->id,
                'reference_no' => $p->reference_no,
                'supplier' => $p->supplier?->name,
                'purchase_date' => $p->purchase_date->toDateString(),
                'items_count' => $p->items_count,
                'total_amount' => (float) $p->total_amount,
                'status' => $p->status->value,
            ]);

        return Inertia::render('purchases/index', ['purchases' => $purchases]);
    }

    public function create(): Response
    {
        return Inertia::render('purchases/create', [
            'suppliers' => Supplier::orderBy('name')->get(['id', 'name']),
            'materials' => Material::active()->orderBy('name')
                ->get(['id', 'sku', 'name', 'unit', 'unit_cost', 'track_expiry'])
                ->map(fn($m) => [
                    'id' => $m->id,
                    'sku' => $m->sku,
                    'name' => $m->name,
                    'unit' => $m->unit,
                    'unit_cost' => (float) $m->unit_cost,
                    'track_expiry' => $m->track_expiry,
                ]),
        ]);
    }

    public function print(Purchase $purchase)
    {
        $purchase->load([
            'supplier:id,name,phone,email,address',
            'creator:id,name',
            'items.material:id,sku,name,unit',
        ]);

        return view('purchases.print', compact('purchase'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'supplier_id' => ['nullable', 'exists:suppliers,id'],
            'purchase_date' => ['required', 'date'],
            'note' => ['nullable', 'string', 'max:500'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.material_id' => ['required', 'distinct', 'exists:materials,id'],
            'items.*.quantity' => ['required', 'numeric', 'gt:0'],
            'items.*.unit_cost' => ['required', 'numeric', 'min:0'],
            'items.*.batch_no' => ['nullable', 'string', 'max:100'],
            'items.*.expiry_date' => ['nullable', 'date', 'after:today'],
        ], [
            'items.*.material_id.distinct' => 'This material is listed twice. Keep one line per material.',
        ]);

        // Materials that track expiry must have an expiry date
        $materials = Material::whereIn('id', collect($data['items'])->pluck('material_id'))
            ->get()->keyBy('id');

        $errors = [];
        foreach ($data['items'] as $i => $item) {
            $m = $materials[$item['material_id']];
            if (! $m->is_active) {
                $errors["items.$i.material_id"] = "{$m->name} is inactive.";
            }
        }
        if ($errors) {
            throw ValidationException::withMessages($errors);
        }

        $purchase = DB::transaction(function () use ($data) {
            $total = 0;
            $lines = [];

            foreach ($data['items'] as $item) {
                $subtotal = round($item['quantity'] * $item['unit_cost'], 2);
                $total += $subtotal;
                $lines[] = [
                    'material_id' => $item['material_id'],
                    'batch_no' => $item['batch_no'] ?? null,
                    'expiry_date' => $item['expiry_date'] ?? null,
                    'quantity' => $item['quantity'],
                    'unit_cost' => $item['unit_cost'],
                    'subtotal' => $subtotal,
                ];
            }

            $purchase = Purchase::create([
                'reference_no' => 'PO-' . now()->format('ymd') . '-' . str_pad((string) (Purchase::count() + 1), 4, '0', STR_PAD_LEFT),
                'supplier_id' => $data['supplier_id'] ?? null,
                'purchase_date' => $data['purchase_date'],
                'total_amount' => $total,
                'status' => PurchaseStatus::Draft,
                'note' => $data['note'] ?? null,
                'created_by' => Auth::id(),
            ]);

            $purchase->items()->createMany($lines);

            return $purchase;
        });

        return to_route('purchases.show', $purchase)->with('success', 'Purchase created.');
    }

    public function show(Purchase $purchase): Response
    {
        $purchase->load(['supplier:id,name', 'creator:id,name', 'items.material:id,sku,name,unit,track_expiry']);

        return Inertia::render('purchases/show', [
            'purchase' => [
                'id' => $purchase->id,
                'reference_no' => $purchase->reference_no,
                'supplier' => $purchase->supplier?->name,
                'purchase_date' => $purchase->purchase_date->toDateString(),
                'status' => $purchase->status->value,
                'total_amount' => (float) $purchase->total_amount,
                'note' => $purchase->note,
                'created_by' => $purchase->creator?->name,
                'items' => $purchase->items->map(fn($i) => [
                    'id' => $i->id,
                    'sku' => $i->material->sku,
                    'name' => $i->material->name,
                    'unit' => $i->material->unit,
                    'batch_no' => $i->batch_no,
                    'expiry_date' => $i->expiry_date?->toDateString(),
                    'quantity' => (float) $i->quantity,
                    'unit_cost' => (float) $i->unit_cost,
                    'subtotal' => (float) $i->subtotal,
                    'track_expiry' => $i->material->track_expiry,

                ]),
            ],
        ]);
    }

    public function receive(Request $request, Purchase $purchase, StockService $stock)
    {
        $data = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'integer'],
            'items.*.batch_no' => ['nullable', 'string', 'max:100'],
            'items.*.expiry_date' => ['nullable', 'date', 'after:today'],
        ]);

        $purchase->load('items.material');
        $input = collect($data['items'])->keyBy('id');

        // Every tracked material needs an expiry date before it can be received
        $errors = [];
        foreach ($purchase->items as $i => $item) {
            $expiry = $input[$item->id]['expiry_date'] ?? null;
            if ($item->material->track_expiry && ! $expiry) {
                $errors["items.$i.expiry_date"] = "Expiry date required for {$item->material->name}.";
            }
        }
        if ($errors) {
            throw ValidationException::withMessages($errors);
        }

        try {
            DB::transaction(function () use ($purchase, $input, $stock) {
                foreach ($purchase->items as $item) {
                    $item->update([
                        'batch_no' => $input[$item->id]['batch_no'] ?? $item->batch_no,
                        'expiry_date' => $input[$item->id]['expiry_date'] ?? $item->expiry_date,
                    ]);
                }
                $stock->receivePurchase($purchase);
            });
        } catch (DomainException $e) {
            return back()->withErrors(['status' => $e->getMessage()]);
        }

        return back()->with('success', 'Purchase received. Stock updated.');
    }

    public function cancel(Purchase $purchase)
    {
        if ($purchase->status !== PurchaseStatus::Draft) {
            return back()->withErrors(['status' => 'Only draft purchases can be cancelled.']);
        }

        $purchase->update(['status' => PurchaseStatus::Cancelled]);

        return back()->with('success', 'Purchase cancelled.');
    }
}
