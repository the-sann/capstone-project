<?php

namespace App\Http\Controllers\Invoice;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function create(Invoice $invoice)
    {
        $invoice->load([
            'treatmentCase.patient',
        ]);

        return inertia('payments/create', [
            'invoice' => $invoice,
        ]);
    }

    public function store(Request $request, Invoice $invoice)
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:0.01'],
            'payment_method' => ['required', 'in:cash,card,bank'],
            'notes' => ['nullable', 'string'],
        ]);

        if ($invoice->status === 'paid') {
            return back()->withErrors([
                'amount' => 'This invoice has already been fully paid.',
            ]);
        }

        if ($validated['amount'] > $invoice->balance_amount) {
            return back()->withErrors([
                'amount' => 'Payment cannot be greater than the remaining balance.',
            ]);
        }

        DB::transaction(function () use ($invoice, $validated) {
            Payment::create([
                'payment_id' => 'PAY-' . str_pad(
                    (Payment::max('id') ?? 0) + 1,
                    4,
                    '0',
                    STR_PAD_LEFT
                ),
                'invoice_id' => $invoice->id,
                'amount' => $validated['amount'],
                'payment_method' => $validated['payment_method'],
                'notes' => $validated['notes'] ?? null,
                'paid_at' => now(),
            ]);

            $paidAmount = $invoice->paid_amount + $validated['amount'];
            $balanceAmount = $invoice->total_amount - $paidAmount;

            $status = match (true) {
                $balanceAmount <= 0 => 'paid',
                $paidAmount > 0 => 'partial',
                default => 'unpaid',
            };

            $invoice->update([
                'paid_amount' => $paidAmount,
                'balance_amount' => $balanceAmount,
                'status' => $status,
            ]);
        });

        return redirect()
            ->route('invoices.show', $invoice)
            ->with('success', 'Payment added successfully.');
    }
}
