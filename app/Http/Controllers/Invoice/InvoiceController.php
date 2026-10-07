<?php

namespace App\Http\Controllers\Invoice;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\TreatmentCase;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    /**
     * Create an invoice from a treatment case.
     */
    public function create(TreatmentCase $treatmentCase)
    {

        $treatmentCase->load([
            'patient:id,name,patient_id',
            'dentist:id,name',
            'items.treatmentService:id,name,price',
        ]);

        return inertia('invoices/create', [
            'treatmentCase' => $treatmentCase,
        ]);
    }

    /**
     * Store a newly created invoice.
     */
    public function store(TreatmentCase $treatmentCase)
    {
        // Prevent duplicate invoice
        if ($treatmentCase->invoice()->exists()) {
            return redirect()
                ->route('invoices.show', $treatmentCase->invoice)
                ->with('info', 'Invoice already exists for this treatment case.');
        }

        $invoice = DB::transaction(function () use ($treatmentCase) {

            $treatmentCase->load([
                'items.treatmentService',
            ]);

            $subtotal = $treatmentCase->items->sum('total_price');

            $discount = 0;

            $total = $subtotal - $discount;

            $invoice = Invoice::create([
                'invoice_id' => 'INV-' . str_pad(
                    (Invoice::max('id') ?? 0) + 1,
                    4,
                    '0',
                    STR_PAD_LEFT
                ),

                'treatment_case_id' => $treatmentCase->id,

                'subtotal' => $subtotal,
                'discount' => $discount,
                'total_amount' => $total,

                'paid_amount' => 0,
                'balance_amount' => $total,

                'status' => 'unpaid',
            ]);

            foreach ($treatmentCase->items as $item) {

                $invoice->items()->create([
                    'treatment_service_id' => $item->treatment_service_id,

                    'description' => $item->treatmentService->name,

                    'tooth_number' => $item->tooth_number,

                    'quantity' => $item->quantity,

                    'unit_price' => $item->unit_price,

                    'total_price' => $item->total_price,
                ]);
            }

            return $invoice;
        });

        return redirect()
            ->route('invoices.show', $invoice)
            ->with('success', 'Invoice created successfully.');
    }
    public function show(Invoice $invoice)
    {
        $invoice->load([
            'treatmentCase.patient',
            'treatmentCase.dentist',
            'items.treatmentService',
            'payments',
        ]);

        return inertia('invoices/show', [
            'invoice' => $invoice,
        ]);
    }
}
