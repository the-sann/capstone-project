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
    public function complete(TreatmentCase $treatmentCase, TreatmentCaseItem $item)
    {
        abort_unless(
            $item->treatment_case_id === $treatmentCase->id,
            404
        );

        $item->update([
            'status' => 'completed',
        ]);

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

            $total = $treatmentCase->items()->sum('total_price');

            $treatmentCase->update([
                'total_amount' => $total,
                'balance_amount' => $total - $treatmentCase->paid_amount,
            ]);
        });

        return redirect()
            ->route('treatments-case.show', $treatmentCase)
            ->with('success', 'Treatment item deleted successfully.');
    }
}
