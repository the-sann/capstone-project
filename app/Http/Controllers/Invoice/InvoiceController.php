<?php

namespace App\Http\Controllers\Invoice;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\TreatmentCase;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    public function print(Invoice $invoice)
    {
        $invoice->load([
            'treatmentCase.patient',
            'treatmentCase.dentist',
            'items.treatmentService',
            'payments' => function ($query) {
                $query->orderBy('paid_at', 'asc');
            },
        ]);

        return inertia('invoices/print', [
            'invoice' => $invoice,
        ]);
    }
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

        // Load treatment items
        $treatmentCase->load([
            'items.treatmentService',
        ]);

        // Prevent invoice with no treatment items
        if ($treatmentCase->items->isEmpty()) {
            return back()
                ->with('error', 'Cannot create invoice because this treatment case has no treatment items.');
        }

        // Calculate total
        $subtotal = $treatmentCase->items->sum('total_price');

        // Prevent invoice with $0 total
        if ($subtotal <= 0) {
            return back()
                ->with('error', 'Cannot create invoice because the total amount is $0.');
        }

        $discount = 0;
        $total = $subtotal - $discount;

        $invoice = DB::transaction(function () use (
            $treatmentCase,
            $subtotal,
            $discount,
            $total
        ) {
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
