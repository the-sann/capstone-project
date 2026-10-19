import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import payments from '@/routes/payments';
import invoices from '@/routes/invoices';
import treatmentCaseRoutes from '@/routes/treatments-case';

type PaymentHistory = {
    id: number;
    payment_id: string;
    amount: string | number;
    payment_method: 'cash' | 'card' | 'bank';
    paid_at: string;
};

type Payment = PaymentHistory & {
    notes: string | null;

    invoice: {
        id: number;
        invoice_id: string;
        total_amount: string | number;
        paid_amount: string | number;
        balance_amount: string | number;

        payments: PaymentHistory[];

        treatment_case: {
            case_id: string;
            patient: {
                patient_id: string;
                name: string;
            };
            dentist: {
                name: string;
            };
        };
    };
};

type Props = {
    payment: Payment;
};

export default function Show({ payment }: Props) {
    return (
        <>
            <Head title={`Payment ${payment.payment_id}`} />

            <div className="flex flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold">Payment Receipt</h1>

                    <p className="text-sm text-muted-foreground">
                        {payment.payment_id}
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Payment Information</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Invoice summary */}
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="rounded-lg border p-4">
                                <p className="text-sm text-muted-foreground">
                                    Invoice Total
                                </p>
                                <p className="text-xl font-semibold">
                                    $
                                    {Number(
                                        payment.invoice.total_amount,
                                    ).toFixed(2)}
                                </p>
                            </div>

                            <div className="rounded-lg border p-4">
                                <p className="text-sm text-muted-foreground">
                                    Total Paid
                                </p>
                                <p className="text-xl font-semibold text-green-600">
                                    $
                                    {Number(
                                        payment.invoice.paid_amount,
                                    ).toFixed(2)}
                                </p>
                            </div>

                            <div className="rounded-lg border p-4">
                                <p className="text-sm text-muted-foreground">
                                    Remaining Balance
                                </p>
                                <p className="text-xl font-semibold">
                                    $
                                    {Number(
                                        payment.invoice.balance_amount,
                                    ).toFixed(2)}
                                </p>
                            </div>
                        </div>

                        {/* Patient and invoice information */}
                        <div className="space-y-2 border-b pb-4">
                            <div className="flex justify-between gap-4">
                                <span className="text-muted-foreground">
                                    Patient
                                </span>
                                <span className="font-medium">
                                    {
                                        payment.invoice.treatment_case.patient
                                            .name
                                    }
                                </span>
                            </div>

                            <div className="flex justify-between gap-4">
                                <span className="text-muted-foreground">
                                    Patient ID
                                </span>
                                <span>
                                    {
                                        payment.invoice.treatment_case.patient
                                            .patient_id
                                    }
                                </span>
                            </div>

                            <div className="flex justify-between gap-4">
                                <span className="text-muted-foreground">
                                    Invoice
                                </span>
                                <span>{payment.invoice.invoice_id}</span>
                            </div>

                            <div className="flex justify-between gap-4">
                                <span className="text-muted-foreground">
                                    Treatment Case
                                </span>
                                <span>
                                    {payment.invoice.treatment_case.case_id}
                                </span>
                            </div>
                        </div>

                        {/* Payment history */}
                        <div className="space-y-3">
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Payment History
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    All payments recorded for this invoice.
                                </p>
                            </div>

                            <div className="overflow-x-auto rounded-md border">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50">
                                        <tr className="border-b text-left">
                                            <th className="p-3">Payment ID</th>
                                            <th className="p-3">Date</th>
                                            <th className="p-3">Method</th>
                                            <th className="p-3 text-right">
                                                Amount
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {[...payment.invoice.payments]
                                            .sort(
                                                (a, b) =>
                                                    new Date(
                                                        a.paid_at,
                                                    ).getTime() -
                                                    new Date(
                                                        b.paid_at,
                                                    ).getTime(),
                                            )
                                            .map((item) => (
                                                <tr
                                                    key={item.id}
                                                    className="border-b last:border-0"
                                                >
                                                    <td className="p-3 font-medium">
                                                        {item.payment_id}
                                                    </td>

                                                    <td className="p-3">
                                                        {new Date(
                                                            item.paid_at,
                                                        ).toLocaleDateString()}
                                                    </td>

                                                    <td className="p-3 uppercase">
                                                        {item.payment_method}
                                                    </td>

                                                    <td className="p-3 text-right font-medium">
                                                        $
                                                        {Number(
                                                            item.amount,
                                                        ).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}

                                        {payment.invoice.payments.length ===
                                            0 && (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="p-6 text-center text-muted-foreground"
                                                >
                                                    No payments recorded.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button asChild variant="outline">
                                <Link
                                    href={invoices.show(payment.invoice.id).url}
                                >
                                    Back to Invoice
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
Show.layout = {
    breadcrumbs: [
        {
            title: 'Treatment Cases',
            href: treatmentCaseRoutes.index(),
        },
        {
            title: 'Payment Detail',
            href: '#',
        },
    ],
};
