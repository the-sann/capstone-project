import { Head } from '@inertiajs/react';

type Payment = {
    id: number;
    payment_id: string;
    amount: number | string;
    payment_method: 'cash' | 'card' | 'bank';
    notes: string | null;
    paid_at: string;

    invoice: {
        invoice_id: string;
        total_amount: number | string;
        paid_amount: number | string;
        balance_amount: number | string;
        status: string;

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

export const formatDateTime = (date: string) =>
    new Date(date).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
export default function PaymentPrint({ payment }: Props) {
    const money = (value: number | string) =>
        Number(value).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Head title={`Payment ${payment.payment_id}`} />

            <div className="min-h-screen bg-gray-100 p-6 print:bg-white print:p-0">
                {/* Print button */}
                <div className="mx-auto mb-4 flex max-w-xl justify-end print:hidden">
                    <button
                        onClick={handlePrint}
                        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                    >
                        Print Receipt
                    </button>
                </div>

                {/* Receipt */}
                <div className="mx-auto max-w-xl bg-white p-8 shadow-sm print:max-w-none print:shadow-none">
                    {/* Header */}
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">Dental Clinic</h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Payment Receipt
                        </p>
                    </div>

                    <div className="my-6 border-t border-dashed" />

                    {/* Payment information */}
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Receipt No.</span>

                            <span className="font-semibold">
                                {payment.payment_id}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">Invoice</span>

                            <span>{payment.invoice.invoice_id}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Treatment Case
                            </span>

                            <span>
                                {payment.invoice.treatment_case.case_id}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">Date</span>

                            <span>{formatDateTime(payment.paid_at)}</span>
                        </div>
                    </div>

                    <div className="my-6 border-t border-dashed" />

                    {/* Patient */}
                    <div>
                        <p className="mb-3 text-xs font-semibold text-gray-500 uppercase">
                            Patient
                        </p>

                        <p className="font-semibold">
                            {payment.invoice.treatment_case.patient.name}
                        </p>

                        <p className="text-sm text-gray-500">
                            ID:{' '}
                            {payment.invoice.treatment_case.patient.patient_id}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            Dentist:{' '}
                            {payment.invoice.treatment_case.dentist.name}
                        </p>
                    </div>

                    <div className="my-6 border-t border-dashed" />

                    {/* Payment amount */}
                    <div className="rounded-lg bg-gray-50 p-5 print:bg-transparent print:p-0">
                        <div className="flex justify-between text-sm">
                            <span>Payment Method</span>

                            <span className="font-medium uppercase">
                                {payment.payment_method}
                            </span>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-base font-semibold">
                                Amount Paid
                            </span>

                            <span className="text-2xl font-bold">
                                ${money(payment.amount)}
                            </span>
                        </div>
                    </div>

                    <div className="my-6 border-t border-dashed" />

                    {/* Invoice balance */}
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Invoice Total</span>

                            <span>${money(payment.invoice.total_amount)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">Total Paid</span>

                            <span>${money(payment.invoice.paid_amount)}</span>
                        </div>

                        <div className="flex justify-between text-base font-bold">
                            <span>Remaining Balance</span>

                            <span>
                                ${money(payment.invoice.balance_amount)}
                            </span>
                        </div>
                    </div>

                    {payment.notes && (
                        <>
                            <div className="my-6 border-t border-dashed" />

                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">
                                    Notes
                                </p>

                                <p className="mt-2 text-sm">{payment.notes}</p>
                            </div>
                        </>
                    )}

                    {/* Footer */}
                    <div className="mt-12 text-center text-xs text-gray-500">
                        <p className="font-medium text-gray-700">
                            Payment received successfully.
                        </p>

                        <p className="mt-2">
                            Thank you for choosing our dental clinic.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
