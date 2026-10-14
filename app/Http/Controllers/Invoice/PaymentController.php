<?php

namespace App\Http\Controllers\Invoice;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{

    public function print(Payment $payment)
    {
        $payment->load([
            'invoice.treatmentCase.patient',
            'invoice.treatmentCase.dentist',
        ]);

        return inertia('payments/print', [
            'payment' => $payment,
        ]);
    }
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

        $payment = DB::transaction(function () use ($invoice, $validated) {

            // Create payment ONCE
            $payment = Payment::create([
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

            // Calculate invoice amounts
            $paidAmount = $invoice->paid_amount + $validated['amount'];
            $balanceAmount = $invoice->total_amount - $paidAmount;

            $status = match (true) {
                $balanceAmount <= 0 => 'paid',
                $paidAmount > 0 => 'partial',
                default => 'unpaid',
            };

            // Update invoice
            $invoice->update([
                'paid_amount' => $paidAmount,
                'balance_amount' => max(0, $balanceAmount),
                'status' => $status,
            ]);

            // Update treatment case
            $treatmentCase = $invoice->treatmentCase;

            $treatmentCase->update([
                'paid_amount' => $paidAmount,
                'balance_amount' => max(0, $balanceAmount),
            ]);

            // Check treatment completion
            $hasIncompleteItems = $treatmentCase
                ->items()
                ->where('status', '!=', 'completed')
                ->exists();

            if (!$hasIncompleteItems && $treatmentCase->balance_amount <= 0) {
                $treatmentCase->update([
                    'status' => 'completed',
                ]);
            }

            return $payment;
        });

        return redirect()
            ->route('payments.show', $payment)
            ->with('success', 'Payment added successfully.');
    }
    public function show(Payment $payment)
    {
        $payment->load([
            'invoice.treatmentCase.patient',
            'invoice.treatmentCase.dentist',
        ]);

        return inertia('payments/show', [
            'payment' => $payment,
        ]);
    }
}
