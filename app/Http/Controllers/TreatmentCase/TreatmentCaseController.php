<?php

namespace App\Http\Controllers\TreatmentCase;

use App\Http\Controllers\Controller;
use App\Models\Dentist;
use App\Models\Patient;
use App\Models\Treatment;
use App\Models\TreatmentCase;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TreatmentCaseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $cases = TreatmentCase::with([
            'patient:id,name,patient_id',
            'dentist:id,name',
        ])
            ->withCount([
                'items',
                'appointments',
            ])
            ->latest()
            ->paginate(10);

        return inertia('treatment-cases/index', [
            'cases' => $cases,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia(
            'treatment-cases/create',
            [
                'patients' => Patient::select('id', 'name')
                    ->orderBy('name')
                    ->get(),

                'dentists' => Dentist::where('status', true)
                    ->select('id', 'name')
                    ->orderBy('name')
                    ->get(),

                'treatmentServices' => Treatment::where('status', 'available')
                    ->select('id', 'name', 'price')
                    ->orderBy('name')
                    ->get(),
            ]
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => ['required', 'exists:patients,id'],
            'dentist_id' => ['required', 'exists:dentists,id'],

            'diagnosis' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],

            'status' => ['required', 'in:ongoing,completed,cancelled'],

            'items' => ['nullable', 'array'],
            'items.*.treatment_service_id' => [
                'required_with:items',
                'exists:treatments,id',
            ],
            'items.*.quantity' => [
                'required_with:items',
                'integer',
                'min:1',
            ],
            'items.*.status' => [
                'required_with:items',
                'in:pending,in_progress,completed,cancelled',
            ],
            'items.*.tooth_number' => ['nullable', 'string'],
            'items.*.notes' => ['nullable', 'string'],
        ]);

        $case = DB::transaction(function () use ($validated) {

            $case = TreatmentCase::create([
                'case_id' => 'TC-' . str_pad(
                    (TreatmentCase::max('id') ?? 0) + 1,
                    4,
                    '0',
                    STR_PAD_LEFT
                ),

                'patient_id' => $validated['patient_id'],
                'dentist_id' => $validated['dentist_id'],
                'diagnosis' => $validated['diagnosis'] ?? null,
                'notes' => $validated['notes'] ?? null,

                'status' => $validated['status'],

                'total_amount' => 0,
                'paid_amount' => 0,
                'balance_amount' => 0,
            ]);

            $total = 0;

            foreach ($validated['items'] ?? [] as $item) {

                $service = Treatment::findOrFail(
                    $item['treatment_service_id']
                );

                $quantity = $item['quantity'];
                $unitPrice = $service->price;
                $totalPrice = $unitPrice * $quantity;

                $case->items()->create([
                    'treatment_service_id' => $service->id,

                    'tooth_number' => $item['tooth_number'] ?? null,

                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'total_price' => $totalPrice,

                    'status' => $item['status'],

                    'completed_at' =>
                    $item['status'] === 'completed'
                        ? now()
                        : null,

                    'notes' => $item['notes'] ?? null,
                ]);

                $total += $totalPrice;
            }

            $case->update([
                'total_amount' => $total,
                'balance_amount' => $total,
            ]);

            return $case;
        });

        return redirect()
            ->route('treatments-case.show', $case)
            ->with('success', 'Treatment case created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(TreatmentCase $treatmentCase)
    {
        $treatmentCase->load([
            'patient',
            'dentist',
            'items.treatmentService',
            'appointments',
            'invoice',
        ]);

        return inertia(
            'treatment-cases/show',
            [
                'treatmentCase' => $treatmentCase,
            ]
        );
    }


    /**
     * Show the form for editing the specified resource.
     */
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TreatmentCase $treatmentCase)
    {
        return inertia('treatment-cases/edit', [
            'treatmentCase' => $treatmentCase,

            'patients' => Patient::select(
                'id',
                'name',
                'patient_id'
            )
                ->orderBy('name')
                ->get(),

            'dentists' => Dentist::where('status', true)
                ->select('id', 'name')
                ->orderBy('name')
                ->get(),

            'treatmentServices' => Treatment::where(
                'status',
                'available'
            )
                ->select('id', 'name', 'price')
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        Request $request,
        TreatmentCase $treatmentCase
    ) {
        $validated = $request->validate([
            'patient_id' => [
                'required',
                'exists:patients,id',
            ],

            'dentist_id' => [
                'required',
                'exists:dentists,id',
            ],

            'diagnosis' => [
                'nullable',
                'string',
            ],

            'notes' => [
                'nullable',
                'string',
            ],

            'status' => [
                'required',
                'in:ongoing,completed,cancelled',
            ],
        ]);

        $treatmentCase->update([
            'patient_id' => $validated['patient_id'],
            'dentist_id' => $validated['dentist_id'],
            'diagnosis' => $validated['diagnosis'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'status' => $validated['status'],
        ]);

        return redirect()
            ->route(
                'treatments-case.show',
                $treatmentCase
            )
            ->with(
                'success',
                'Treatment case updated successfully.'
            );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
