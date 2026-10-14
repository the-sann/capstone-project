import { Head } from '@inertiajs/react';
import { formatDateTime } from '../payments/print';

type Patient = {
    patient_id: string;
    name: string;
};

type Dentist = {
    name: string;
};

type TreatmentService = {
    name: string;
};

type InvoiceItem = {
    id: number;
    description: string;
    tooth_number: string | null;
    quantity: number;
    unit_price: number | string;
    total_price: number | string;
    treatment_service?: TreatmentService | null;
};

type Payment = {
    id: number;
    payment_id: string;
    amount: string;
    payment_method: 'cash' | 'card' | 'bank';
    notes: string | null;
    paid_at: string;
};
type Invoice = {
    id: number;
    invoice_id: string;
    subtotal: number | string;
    discount: number | string;
    total_amount: number | string;
    paid_amount: number | string;
    balance_amount: number | string;
    status: string;
    created_at: string;

    treatment_case: {
        case_id: string;
        patient: Patient;
        dentist: Dentist;
    };

    items: InvoiceItem[];
    payments: Payment[];
};

type Props = {
    invoice: Invoice;
};

export default function InvoicePrint({ invoice }: Props) {
    const money = (value: number | string) =>
        Number(value).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Head title={`Invoice ${invoice.invoice_id}`} />

            <div className="min-h-screen bg-gray-100 p-6 print:bg-white print:p-0">
                {/* Print button */}
                <div className="mx-auto mb-4 flex max-w-3xl justify-end print:hidden">
                    <button
                        onClick={handlePrint}
                        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                    >
                        Print Invoice
                    </button>
                </div>

                {/* Invoice */}
                <div className="mx-auto max-w-3xl bg-white p-8 shadow-sm print:max-w-none print:shadow-none">
                    {/* Header */}
                    <div className="flex items-start justify-between border-b pb-6">
                        <div>
                            <h1 className="text-2xl font-bold">
                                Dental Clinic
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Dental Treatment & Care
                            </p>

                            <p className="mt-2 text-sm text-gray-500">
                                Phnom Penh, Cambodia
                            </p>
                        </div>

                        <div className="text-right">
                            <h2 className="text-2xl font-bold">INVOICE</h2>

                            <p className="mt-1 text-sm">{invoice.invoice_id}</p>

                            <p className="mt-1 text-sm text-gray-500">
                                {formatDate(invoice.created_at)}
                            </p>
                        </div>
                    </div>

                    {/* Patient information */}
                    <div className="grid grid-cols-2 gap-8 border-b py-6">
                        <div>
                            <p className="mb-2 text-xs font-semibold text-gray-500 uppercase">
                                Patient
                            </p>

                            <p className="font-semibold">
                                {invoice.treatment_case.patient.name}
                            </p>

                            <p className="text-sm text-gray-500">
                                ID: {invoice.treatment_case.patient.patient_id}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs font-semibold text-gray-500 uppercase">
                                Treatment
                            </p>

                            <p className="font-semibold">
                                {invoice.treatment_case.case_id}
                            </p>

                            <p className="text-sm text-gray-500">
                                Dentist: {invoice.treatment_case.dentist.name}
                            </p>
                        </div>
                    </div>

                    {/* Treatment Items */}
                    <div className="py-6">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left">
                                    <th className="pb-3">Treatment</th>
                                    <th className="pb-3">Tooth</th>
                                    <th className="pb-3 text-center">Qty</th>
                                    <th className="pb-3 text-right">
                                        Unit Price
                                    </th>
                                    <th className="pb-3 text-right">Total</th>
                                </tr>
                            </thead>

                            <tbody>
                                {invoice.items.map((item) => (
                                    <tr key={item.id} className="border-b">
                                        <td className="py-3">
                                            {item.description ||
                                                item.treatment_service?.name}
                                        </td>

                                        <td className="py-3">
                                            {item.tooth_number || '-'}
                                        </td>

                                        <td className="py-3 text-center">
                                            {item.quantity}
                                        </td>

                                        <td className="py-3 text-right">
                                            ${money(item.unit_price)}
                                        </td>

                                        <td className="py-3 text-right">
                                            ${money(item.total_price)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Payment History */}
                    {invoice.payments.length > 0 && (
                        <div className="mt-8">
                            <h2 className="mb-3 text-lg font-semibold">
                                Payment History
                            </h2>

                            <table className="w-full border-collapse text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-2 text-left">
                                            Payment ID
                                        </th>
                                        <th className="py-2 text-left">Date</th>
                                        <th className="py-2 text-left">
                                            Method
                                        </th>
                                        <th className="py-2 text-right">
                                            Amount
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {invoice.payments.map((payment) => (
                                        <tr
                                            key={payment.id}
                                            className="border-b"
                                        >
                                            <td className="py-2">
                                                {payment.payment_id}
                                            </td>

                                            <td className="py-2">
                                                {formatDate(payment.paid_at)}
                                            </td>

                                            <td className="py-2 capitalize">
                                                {payment.payment_method}
                                            </td>

                                            <td className="py-2 text-right font-medium">
                                                $
                                                {Number(payment.amount).toFixed(
                                                    2,
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Totals */}
                    <div className="flex justify-end">
                        <div className="w-72 space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Subtotal</span>

                                <span>${money(invoice.subtotal)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">Discount</span>

                                <span>-${money(invoice.discount)}</span>
                            </div>

                            <div className="flex justify-between border-t pt-3 text-base font-bold">
                                <span>Total</span>

                                <span>${money(invoice.total_amount)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">Paid</span>

                                <span>${money(invoice.paid_amount)}</span>
                            </div>

                            <div className="flex justify-between text-base font-bold">
                                <span>Balance</span>

                                <span>${money(invoice.balance_amount)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="mt-8 border-t pt-6">
                        <p className="text-sm">
                            Status:{' '}
                            <span className="font-semibold uppercase">
                                {invoice.status}
                            </span>
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-12 border-t pt-6 text-center text-xs text-gray-500">
                        <p>Thank you for choosing our dental clinic.</p>

                        <p className="mt-1">
                            This is a computer-generated invoice.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
