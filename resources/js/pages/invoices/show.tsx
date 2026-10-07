import { Head } from '@inertiajs/react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dentist, Patient, Treatment } from '@/types/app/types';
import { Button } from '@/components/ui/button';
import payments from '@/routes/payments';
import { Link } from '@inertiajs/react';
import treatmentCaseRoutes from '@/routes/treatments-case';

type InvoiceItem = {
    id: number;
    invoice_id: number;
    treatment_service_id: number;
    description: string;
    tooth_number: string | null;
    quantity: number;
    unit_price: string;
    total_price: string;
    created_at: string;
    updated_at: string;
    treatment_service: Treatment;
};

type Payment = {
    id: number;
    payment_id: string;
    invoice_id: number;
    amount: string;
    payment_method: 'cash' | 'card' | 'bank';
    notes: string | null;
    paid_at: string;
};

type InvoiceTreatmentCase = {
    id: number;
    case_id: string;
    patient_id: number;
    dentist_id: number;
    diagnosis: string | null;
    notes: string | null;
    status: 'ongoing' | 'completed' | 'cancelled';
    total_amount: string;
    paid_amount: string;
    balance_amount: string;
    created_at: string;
    updated_at: string;
    patient: Patient;
    dentist: Dentist;
};

type Invoice = {
    id: number;
    invoice_id: string;
    treatment_case_id: number;
    subtotal: string;
    discount: string;
    total_amount: string;
    paid_amount: string;
    balance_amount: string;
    status: 'unpaid' | 'partial' | 'paid' | 'cancelled';
    created_at: string;
    updated_at: string;
    treatment_case: InvoiceTreatmentCase;
    items: InvoiceItem[];
    payments: Payment[];
};

interface Props {
    invoice: Invoice;
}

export default function Show({ invoice }: Props) {
    const formatMoney = (value: string | number) => {
        return Number(value).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const formatDate = (value: string) => {
        return new Date(value).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const statusClass = {
        unpaid: 'bg-red-100 text-red-700',
        partial: 'bg-yellow-100 text-yellow-700',
        paid: 'bg-green-100 text-green-700',
        cancelled: 'bg-gray-100 text-gray-700',
    };

    return (
        <>
            <Head title={`Invoice ${invoice.invoice_id}`} />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Invoice {invoice.invoice_id}
                        </h1>

                        <p className="text-sm text-muted-foreground">
                            Created on {formatDate(invoice.created_at)}
                        </p>
                    </div>

                    <span
                        className={`w-fit rounded-full px-3 py-1 text-sm font-medium capitalize ${
                            statusClass[invoice.status]
                        }`}
                    >
                        {invoice.status}
                    </span>
                    <span>
                        {invoice.status !== 'paid' &&
                            invoice.status !== 'cancelled' && (
                                <Button asChild>
                                    <Link
                                        href={payments.create(invoice.id).url}
                                    >
                                        Add Payment
                                    </Link>
                                </Button>
                            )}
                    </span>
                </div>

                {/* Patient & Treatment Case */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Patient Information</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2">
                            <div>
                                <span className="font-medium">Name:</span>{' '}
                                {invoice.treatment_case.patient.name}
                            </div>

                            <div>
                                <span className="font-medium">Patient ID:</span>{' '}
                                {invoice.treatment_case.patient.patient_id}
                            </div>

                            <div>
                                <span className="font-medium">Phone:</span>{' '}
                                {invoice.treatment_case.patient.phone}
                            </div>

                            <div>
                                <span className="font-medium">Gender:</span>{' '}
                                {invoice.treatment_case.patient.gender}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Treatment Information</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2">
                            <div>
                                <span className="font-medium">
                                    Treatment Case:
                                </span>{' '}
                                {invoice.treatment_case.case_id}
                            </div>

                            <div>
                                <span className="font-medium">Dentist:</span>{' '}
                                {invoice.treatment_case.dentist.name}
                            </div>

                            <div>
                                <span className="font-medium">Diagnosis:</span>{' '}
                                {invoice.treatment_case.diagnosis ?? '-'}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Invoice Items */}
                <Card>
                    <CardHeader>
                        <CardTitle>Invoice Items</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="px-4 py-3 text-left">
                                            Service
                                        </th>

                                        <th className="px-4 py-3 text-left">
                                            Tooth
                                        </th>

                                        <th className="px-4 py-3 text-right">
                                            Qty
                                        </th>

                                        <th className="px-4 py-3 text-right">
                                            Unit Price
                                        </th>

                                        <th className="px-4 py-3 text-right">
                                            Total
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {invoice.items.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-b last:border-0"
                                        >
                                            <td className="px-4 py-3">
                                                {item.description}
                                            </td>

                                            <td className="px-4 py-3">
                                                {item.tooth_number ?? '-'}
                                            </td>

                                            <td className="px-4 py-3 text-right">
                                                {item.quantity}
                                            </td>

                                            <td className="px-4 py-3 text-right">
                                                {formatMoney(item.unit_price)}
                                            </td>

                                            <td className="px-4 py-3 text-right font-medium">
                                                {formatMoney(item.total_price)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Totals */}
                <div className="flex justify-end">
                    <Card className="w-full md:max-w-md">
                        <CardContent className="space-y-3 pt-6">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>{formatMoney(invoice.subtotal)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Discount</span>
                                <span>{formatMoney(invoice.discount)}</span>
                            </div>

                            <div className="flex justify-between border-t pt-3 text-lg font-semibold">
                                <span>Total</span>
                                <span>{formatMoney(invoice.total_amount)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Paid</span>
                                <span className="text-green-600">
                                    {formatMoney(invoice.paid_amount)}
                                </span>
                            </div>

                            <div className="flex justify-between font-semibold">
                                <span>Balance</span>
                                <span className="text-red-600">
                                    {formatMoney(invoice.balance_amount)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Payments */}
                <Card>
                    <CardHeader>
                        <CardTitle>Payments</CardTitle>
                    </CardHeader>

                    <CardContent>
                        {invoice.payments.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No payments have been made yet.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="px-4 py-3 text-left">
                                                Payment ID
                                            </th>

                                            <th className="px-4 py-3 text-left">
                                                Method
                                            </th>

                                            <th className="px-4 py-3 text-left">
                                                Date
                                            </th>

                                            <th className="px-4 py-3 text-right">
                                                Amount
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {invoice.payments.map((payment) => (
                                            <tr
                                                key={payment.id}
                                                className="border-b last:border-0"
                                            >
                                                <td className="px-4 py-3">
                                                    {payment.payment_id}
                                                </td>

                                                <td className="px-4 py-3 capitalize">
                                                    {payment.payment_method}
                                                </td>

                                                <td className="px-4 py-3">
                                                    {formatDate(
                                                        payment.paid_at,
                                                    )}
                                                </td>

                                                <td className="px-4 py-3 text-right font-medium">
                                                    {formatMoney(
                                                        payment.amount,
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
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
            title: 'Invoice Details',
            href: '#',
        },
    ],
};
