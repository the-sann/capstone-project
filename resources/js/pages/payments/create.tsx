import { Head, useForm } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import payments from '@/routes/payments';
import treatmentCaseRoutes from '@/routes/treatments-case';

type Patient = {
    id: number;
    patient_id: string;
    name: string;
    phone: string;
};

type TreatmentCase = {
    id: number;
    case_id: string;
    patient: Patient;
};

type Invoice = {
    id: number;
    invoice_id: string;
    total_amount: string;
    paid_amount: string;
    balance_amount: string;
    status: 'unpaid' | 'partial' | 'paid' | 'cancelled';
    treatment_case: TreatmentCase;
};

interface Props {
    invoice: Invoice;
}

export default function Create({ invoice }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        amount: '',
        payment_method: 'cash',
        notes: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        post(payments.store(invoice.id).url);
    }

    return (
        <>
            <Head title={`Payment - ${invoice.invoice_id}`} />

            <div className="flex flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold">Add Payment</h1>

                    <p className="text-sm text-muted-foreground">
                        Invoice {invoice.invoice_id}
                    </p>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Payment Information</CardTitle>

                        <CardDescription>
                            Add a payment for this invoice.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="mb-6 grid gap-3 rounded-lg border p-4">
                            <div className="flex justify-between">
                                <span>Total</span>

                                <span className="font-medium">
                                    ${Number(invoice.total_amount).toFixed(2)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>Paid</span>

                                <span>
                                    ${Number(invoice.paid_amount).toFixed(2)}
                                </span>
                            </div>

                            <div className="flex justify-between border-t pt-3 font-semibold">
                                <span>Remaining Balance</span>

                                <span>
                                    ${Number(invoice.balance_amount).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <label
                                    htmlFor="amount"
                                    className="text-sm font-medium"
                                >
                                    Payment Amount
                                </label>

                                <input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    max={Number(invoice.balance_amount)}
                                    value={data.amount}
                                    onChange={(e) =>
                                        setData('amount', e.target.value)
                                    }
                                    className="w-full rounded-md border px-3 py-2"
                                    placeholder="Enter payment amount"
                                />

                                {errors.amount && (
                                    <p className="text-sm text-red-500">
                                        {errors.amount}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="payment_method"
                                    className="text-sm font-medium"
                                >
                                    Payment Method
                                </label>

                                <select
                                    id="payment_method"
                                    value={data.payment_method}
                                    onChange={(e) =>
                                        setData(
                                            'payment_method',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-md border px-3 py-2"
                                >
                                    <option value="cash">Cash</option>
                                    <option value="card">Card</option>
                                    <option value="bank">Bank Transfer</option>
                                </select>

                                {errors.payment_method && (
                                    <p className="text-sm text-red-500">
                                        {errors.payment_method}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="notes"
                                    className="text-sm font-medium"
                                >
                                    Notes
                                </label>

                                <textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData('notes', e.target.value)
                                    }
                                    className="min-h-24 w-full rounded-md border px-3 py-2"
                                    placeholder="Optional payment notes"
                                />

                                {errors.notes && (
                                    <p className="text-sm text-red-500">
                                        {errors.notes}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    Cancel
                                </Button>

                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Add Payment'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
Create.layout = {
    breadcrumbs: [
        {
            title: 'Treatment Cases',
            href: treatmentCaseRoutes.index(),
        },
        {
            title: 'Create Payment',
            href: '#',
        },
    ],
};
