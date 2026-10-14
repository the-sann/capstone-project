import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import payments from '@/routes/payments';

type Payment = {
    id: number;
    payment_id: string;
    amount: string | number;
    payment_method: 'cash' | 'card' | 'bank';
    notes: string | null;
    paid_at: string;

    invoice: {
        invoice_id: string;
        total_amount: string | number;
        paid_amount: string | number;
        balance_amount: string | number;

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

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Payment Information</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span>Patient</span>

                            <span className="font-medium">
                                {payment.invoice.treatment_case.patient.name}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span>Patient ID</span>

                            <span>
                                {
                                    payment.invoice.treatment_case.patient
                                        .patient_id
                                }
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span>Invoice</span>

                            <span>{payment.invoice.invoice_id}</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Treatment Case</span>

                            <span>
                                {payment.invoice.treatment_case.case_id}
                            </span>
                        </div>

                        <div className="border-t pt-4" />

                        <div className="flex justify-between">
                            <span>Payment Method</span>

                            <span className="font-medium uppercase">
                                {payment.payment_method}
                            </span>
                        </div>

                        <div className="flex justify-between text-lg font-semibold">
                            <span>Amount Paid</span>

                            <span>${Number(payment.amount).toFixed(2)}</span>
                        </div>

                        <div className="border-t pt-4" />

                        <div className="flex justify-between">
                            <span>Invoice Total</span>

                            <span>
                                $
                                {Number(payment.invoice.total_amount).toFixed(
                                    2,
                                )}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span>Total Paid</span>

                            <span>
                                $
                                {Number(payment.invoice.paid_amount).toFixed(2)}
                            </span>
                        </div>

                        <div className="flex justify-between font-semibold">
                            <span>Remaining Balance</span>

                            <span>
                                $
                                {Number(payment.invoice.balance_amount).toFixed(
                                    2,
                                )}
                            </span>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="outline" asChild>
                                <Link
                                    href={`/invoices/${payment.invoice.invoice_id}`}
                                >
                                    Back
                                </Link>
                            </Button>

                            <Button asChild>
                                <Link href={payments.print(payment.id).url}>
                                    Print Payment
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
