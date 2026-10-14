<?php

namespace App\Http\Controllers\TreatmentCase;

use App\Http\Controllers\Controller;
use App\Models\Treatment;
use App\Models\TreatmentCase;
use App\Models\TreatmentCaseItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TreatmentCaseItemController extends Controller
{
    public function complete(
        TreatmentCase $treatmentCase,
        TreatmentCaseItem $item
    ) {
        abort_unless(
            $item->treatment_case_id === $treatmentCase->id,
            404
        );

        DB::transaction(function () use ($treatmentCase, $item) {

            // Mark current item as completed
            $item->update([
                'status' => 'completed',
                'completed_at' => now(),
            ]);

            // Check if all items and payment are completed
            $hasIncompleteItems = $treatmentCase
                ->items()
                ->where('status', '!=', 'completed')
                ->exists();

            $hasBalance = $treatmentCase->balance_amount > 0;

            $treatmentCase->update([
                'status' => !$hasIncompleteItems && !$hasBalance
                    ? 'completed'
                    : 'ongoing',
            ]);
        });

        return back()->with(
            'success',
            'Treatment item marked as completed.'
        );
    }
    /**
     * Show the form for adding a treatment item.
     */
    public function create(TreatmentCase $treatmentCase)
    {
        $treatmentCase->load([
            'patient:id,name,patient_id',
            'dentist:id,name',
        ]);

        return inertia('treatment-case-items/create', [
            'treatmentCase' => $treatmentCase,

            'treatmentServices' => Treatment::where('status', 'available')
                ->select('id', 'name', 'price')
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Store a treatment item.
     */
    public function store(Request $request, TreatmentCase $treatmentCase)
    {
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],

            'items.*.treatment_service_id' => [
                'required',
                'exists:treatments,id',
            ],

            'items.*.tooth_number' => [
                'nullable',
                'string',
                'max:50',
            ],

            'items.*.quantity' => [
                'required',
                'integer',
                'min:1',
            ],

            'items.*.status' => [
                'required',
                'in:pending,in_progress,completed,cancelled',
            ],

            'items.*.notes' => [
                'nullable',
                'string',
            ],
        ]);

        DB::transaction(function () use ($validated, $treatmentCase) {

            foreach ($validated['items'] as $itemData) {

                $service = Treatment::findOrFail(
                    $itemData['treatment_service_id']
                );

                $unitPrice = (float) $service->price;
                $quantity = $itemData['quantity'];

                $treatmentCase->items()->create([
                    'treatment_service_id' => $service->id,
                    'tooth_number' => $itemData['tooth_number'] ?? null,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'total_price' => $unitPrice * $quantity,
                    'status' => $itemData['status'],
                    'completed_at' => $itemData['status'] === 'completed'
                        ? now()
                        : null,
                    'notes' => $itemData['notes'] ?? null,
                ]);
            }

            $total = $treatmentCase->items()->sum('total_price');

            $treatmentCase->update([
                'total_amount' => $total,
                'balance_amount' => $total - $treatmentCase->paid_amount,
                'status' => 'ongoing',
            ]);
        });

        return redirect()
            ->route('treatments-case.show', $treatmentCase)
            ->with('success', 'Treatment items added successfully.');
    }
    public function edit(
        TreatmentCase $treatmentCase,
        TreatmentCaseItem $item
    ) {
        abort_unless(
            $item->treatment_case_id === $treatmentCase->id,
            404
        );

        $treatmentCase->load([
            'patient:id,name,patient_id',
            'dentist:id,name',
        ]);

        $item->load([
            'treatmentService:id,name,price',
        ]);

        $treatmentServices = Treatment::where(function ($query) use ($item) {
            $query->where('status', 'active')
                ->orWhere('id', $item->treatment_service_id);
        })
            ->select('id', 'name', 'price')
            ->orderBy('name')
            ->get();

        return inertia('treatment-case-items/edit', [
            'treatmentCase' => $treatmentCase,
            'item' => $item,
            'treatmentServices' => $treatmentServices,
        ]);
    }
    public function destroy(
        TreatmentCase $treatmentCase,
        TreatmentCaseItem $item
    ) {
        abort_unless(
            $item->treatment_case_id === $treatmentCase->id,
            404
        );

        DB::transaction(function () use ($treatmentCase, $item) {

            $item->delete();

            // Recalculate total
            $total = $treatmentCase
                ->items()
                ->sum('total_price');

            // Check remaining items
            $hasItems = $treatmentCase
                ->items()
                ->exists();

            $hasIncompleteItems = $treatmentCase
                ->items()
                ->where('status', '!=', 'completed')
                ->exists();

            $treatmentCase->update([
                'total_amount' => $total,
                'balance_amount' => $total - $treatmentCase->paid_amount,

                // Only completed when there are items
                // and all remaining items are completed.
                'status' => $hasItems && !$hasIncompleteItems
                    ? 'completed'
                    : 'ongoing',
            ]);
        });

        return redirect()
            ->route('treatments-case.show', $treatmentCase)
            ->with(
                'success',
                'Treatment item deleted successfully.'
            );
    }
    public function update(
        Request $request,
        TreatmentCase $treatmentCase,
        TreatmentCaseItem $item
    ) {
        abort_unless(
            $item->treatment_case_id === $treatmentCase->id,
            404
        );

        $validated = $request->validate([
            'treatment_service_id' => [
                'required',
                'exists:treatments,id',
            ],

            'tooth_number' => [
                'nullable',
                'string',
                'max:50',
            ],

            'quantity' => [
                'required',
                'integer',
                'min:1',
            ],

            'status' => [
                'required',
                'in:pending,in_progress,completed,cancelled',
            ],

            'notes' => [
                'nullable',
                'string',
            ],
        ]);

        DB::transaction(function () use (
            $validated,
            $treatmentCase,
            $item
        ) {
            $service = Treatment::findOrFail(
                $validated['treatment_service_id']
            );

            $unitPrice = (float) $service->price;
            $quantity = $validated['quantity'];

            $totalPrice = $unitPrice * $quantity;

            $item->update([
                'treatment_service_id' => $service->id,
                'tooth_number' => $validated['tooth_number'] ?? null,
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
                'total_price' => $totalPrice,
                'status' => $validated['status'],
                'completed_at' => $validated['status'] === 'completed'
                    ? ($item->completed_at ?? now())
                    : null,
                'notes' => $validated['notes'] ?? null,
            ]);

            // Recalculate treatment case total
            $total = $treatmentCase
                ->items()
                ->sum('total_price');

            $treatmentCase->update([
                'total_amount' => $total,
                'balance_amount' => $total - $treatmentCase->paid_amount,
            ]);

            // If every item is completed, complete the case
            $hasIncompleteItems = $treatmentCase
                ->items()
                ->where('status', '!=', 'completed')
                ->exists();

            if (!$hasIncompleteItems) {
                $treatmentCase->update([
                    'status' => 'completed',
                ]);
            } else {
                $treatmentCase->update([
                    'status' => 'ongoing',
                ]);
            }
        });

        return redirect()
            ->route('treatments-case.show', $treatmentCase)
            ->with(
                'success',
                'Treatment item updated successfully.'
            );
    }
}
