import { Head } from '@inertiajs/react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { useRef, useState } from 'react';
import treatmentCaseRoutes from '@/routes/treatments-case';

type Patient = {
    patient_id: string;
    name: string;
    sex?: string | null;
    age?: number | string | null;
    phone?: string | null;
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
    appointment_date?: string | null;
    treatment_service?: TreatmentService | null;
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
};

type Props = {
    invoice: Invoice;
};

// Number of rows printed on the pad
const MIN_ROWS = 14;

const INK = '#2d4a9b'; // blue ink used on the pad
const RED = '#c8201f'; // pad serial number

export default function InvoicePrint({ invoice }: Props) {
    const money = (value: number | string) =>
        Number(value).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });

    const patient = invoice.treatment_case.patient;
    const items = invoice.items;
    const emptyRows = Math.max(0, MIN_ROWS - items.length);
    const hasDiscount = Number(invoice.discount) > 0;

    // ---- Export (PDF / image / share) ----
    const sheetRef = useRef<HTMLDivElement>(null);
    const [busy, setBusy] = useState(false);

    const fileName = `Invoice-${invoice.invoice_id}`.replace(
        /[^a-zA-Z0-9-_]/g,
        '_',
    );

    // Render the A5 sheet to a high-resolution PNG (Khmer text included)
    const capture = async () => {
        if (!sheetRef.current) throw new Error('Invoice not ready');

        return toPng(sheetRef.current, {
            pixelRatio: 3,
            backgroundColor: '#ffffff',
            cacheBust: true,
            // Remove the on-screen shadow / centering margin from the export
            style: { margin: '0', boxShadow: 'none' },
        });
    };

    const saveFile = (href: string, name: string) => {
        const link = document.createElement('a');
        link.href = href;
        link.download = name;
        link.click();
    };

    const run = async (action: () => Promise<void>) => {
        setBusy(true);
        try {
            await action();
        } catch (error) {
            // User cancelling the share sheet is not an error
            if ((error as Error)?.name !== 'AbortError') {
                console.error(error);
                alert('Could not create the file. Please try again.');
            }
        } finally {
            setBusy(false);
        }
    };

    const downloadImage = () =>
        run(async () => {
            saveFile(await capture(), `${fileName}.png`);
        });

    const downloadPdf = () =>
        run(async () => {
            const image = await capture();
            const pdf = new jsPDF({
                unit: 'mm',
                format: 'a5',
                orientation: 'portrait',
            });
            pdf.addImage(image, 'PNG', 0, 0, 148, 210);
            pdf.save(`${fileName}.pdf`);
        });

    // Opens the phone share sheet (Telegram, WhatsApp, Messenger, ...)
    const shareInvoice = () =>
        run(async () => {
            const blob = await (await fetch(await capture())).blob();
            const file = new File([blob], `${fileName}.png`, {
                type: 'image/png',
            });

            if (navigator.canShare?.({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: `Invoice ${invoice.invoice_id}`,
                });
            } else {
                alert(
                    'Sharing is not supported on this device. Please use Download Image or Download PDF.',
                );
            }
        });

    const cell = 'border px-1 align-middle';
    const border = { borderColor: INK };

    return (
        <>
            <Head title={`Invoice ${invoice.invoice_id}`} />

            {/* Force A5 portrait, no browser margins */}
            <style>{`
                @page { size: A5 portrait; margin: 0; }
                @media print {
                    html, body { width: 148mm; height: 210mm; margin: 0; }
                    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
            `}</style>

            {/* Screen: grey background. Print: cover the app layout (sidebar etc.) */}
            <div className="min-h-screen bg-gray-100 p-6 print:fixed print:inset-0 print:z-50 print:min-h-0 print:bg-white print:p-0">
                <div className="mx-auto mb-4 flex w-[148mm] max-w-full flex-wrap justify-end gap-2 print:hidden">
                    <button
                        onClick={downloadPdf}
                        disabled={busy}
                        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                    >
                        {busy ? 'Please wait...' : 'Download PDF (A5)'}
                    </button>
                    <button
                        onClick={downloadImage}
                        disabled={busy}
                        className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                    >
                        Download Image
                    </button>
                    <button
                        onClick={shareInvoice}
                        disabled={busy}
                        className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                    >
                        Share
                    </button>
                    <button
                        onClick={() => window.print()}
                        disabled={busy}
                        className="rounded-md border border-gray-400 bg-white px-4 py-2 text-sm font-medium text-gray-800 disabled:opacity-50"
                    >
                        Print
                    </button>
                </div>

                {/* A5 sheet: 148mm x 210mm */}
                <div
                    ref={sheetRef}
                    className="relative mx-auto box-border flex h-[210mm] w-[148mm] flex-col overflow-hidden bg-white p-[7mm] text-[9pt] leading-tight shadow-sm print:shadow-none"
                    style={{ color: INK }}
                >
                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-[16pt] leading-none font-bold">
                                Tansamai Dental Clinic
                            </h1>
                            <p className="mt-1 text-[9pt] font-semibold">
                                Tel: 087 673 497 / 066 626 069
                            </p>
                        </div>

                        <p
                            className="text-[13pt] font-bold"
                            style={{ color: RED }}
                        >
                            N<sup>o</sup> {invoice.invoice_id}
                        </p>
                    </div>

                    {/* Patient info */}
                    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[9pt]">
                        <div className="col-span-2 flex gap-1">
                            <span className="shrink-0">Name:</span>
                            <span
                                className="flex-1 border-b border-dotted px-1 font-semibold text-black"
                                style={border}
                            >
                                {patient.name}
                            </span>
                        </div>

                        <div className="flex gap-1">
                            <span className="shrink-0">Sex:</span>
                            <span
                                className="flex-1 border-b border-dotted px-1 text-black"
                                style={border}
                            >
                                {patient.sex ?? ''}
                            </span>
                        </div>
                        <div className="flex gap-1">
                            <span className="shrink-0">Age:</span>
                            <span
                                className="flex-1 border-b border-dotted px-1 text-black"
                                style={border}
                            >
                                {patient.age ?? ''}
                            </span>
                        </div>

                        <div className="flex gap-1">
                            <span className="shrink-0">Tel:</span>
                            <span
                                className="flex-1 border-b border-dotted px-1 text-black"
                                style={border}
                            >
                                {patient.phone ?? ''}
                            </span>
                        </div>
                        <div className="flex gap-1">
                            <span className="shrink-0">Date:</span>
                            <span
                                className="flex-1 border-b border-dotted px-1 text-black"
                                style={border}
                            >
                                {formatDate(invoice.created_at)}
                            </span>
                        </div>

                        <div className="col-span-2 flex gap-1 text-[8pt]">
                            <span className="shrink-0">Patient ID:</span>
                            <span className="text-black">
                                {patient.patient_id}
                            </span>
                            <span className="ml-3 shrink-0">Dentist:</span>
                            <span className="text-black">
                                {invoice.treatment_case.dentist.name}
                            </span>
                        </div>
                    </div>

                    {/* Treatment table */}
                    <table
                        className="mt-2 w-full table-fixed border-collapse border text-[8.5pt]"
                        style={border}
                    >
                        <colgroup>
                            <col style={{ width: '7%' }} />
                            <col style={{ width: '38%' }} />
                            <col style={{ width: '8%' }} />
                            <col style={{ width: '14%' }} />
                            <col style={{ width: '16%' }} />
                            <col style={{ width: '17%' }} />
                        </colgroup>
                        <thead>
                            <tr className="h-[6.5mm] text-center font-semibold">
                                <th className={cell} style={border}>
                                    No.
                                </th>
                                <th className={cell} style={border}>
                                    Treatment Description
                                </th>
                                <th className={cell} style={border}>
                                    Qty
                                </th>
                                <th className={cell} style={border}>
                                    Price
                                </th>
                                <th className={cell} style={border}>
                                    Appointment
                                </th>
                                <th className={cell} style={border}>
                                    Total
                                </th>
                            </tr>
                        </thead>

                        <tbody className="text-black">
                            {items.map((item, index) => (
                                <tr key={item.id} className="h-[8.2mm]">
                                    <td
                                        className={`${cell} text-center`}
                                        style={{ ...border, color: INK }}
                                    >
                                        {index + 1}
                                    </td>
                                    <td
                                        className={`${cell} overflow-hidden`}
                                        style={border}
                                    >
                                        {item.description ||
                                            item.treatment_service?.name}
                                        {item.tooth_number && (
                                            <span className="text-gray-600">
                                                {' '}
                                                (#{item.tooth_number})
                                            </span>
                                        )}
                                    </td>
                                    <td
                                        className={`${cell} text-center`}
                                        style={border}
                                    >
                                        {item.quantity}
                                    </td>
                                    <td
                                        className={`${cell} text-right`}
                                        style={border}
                                    >
                                        ${money(item.unit_price)}
                                    </td>
                                    <td
                                        className={`${cell} text-center text-[7.5pt]`}
                                        style={border}
                                    >
                                        {item.appointment_date
                                            ? formatDate(item.appointment_date)
                                            : ''}
                                    </td>
                                    <td
                                        className={`${cell} text-right`}
                                        style={border}
                                    >
                                        ${money(item.total_price)}
                                    </td>
                                </tr>
                            ))}

                            {/* Empty numbered rows, like the printed pad */}
                            {Array.from({ length: emptyRows }).map((_, i) => (
                                <tr key={`empty-${i}`} className="h-[8.2mm]">
                                    <td
                                        className={`${cell} text-center`}
                                        style={{ ...border, color: INK }}
                                    >
                                        {items.length + i + 1}
                                    </td>
                                    <td className={cell} style={border} />
                                    <td className={cell} style={border} />
                                    <td className={cell} style={border} />
                                    <td className={cell} style={border} />
                                    <td className={cell} style={border} />
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Notes + totals */}
                    <div className="mt-1 flex flex-1 gap-2">
                        <div
                            className="flex-1 border p-1 text-[8.5pt]"
                            style={border}
                        >
                            <p className="font-semibold">Note:</p>
                            {hasDiscount && (
                                <p className="text-black">
                                    Discount: -${money(invoice.discount)}
                                </p>
                            )}
                        </div>

                        <table
                            className="w-[55mm] border-collapse border text-[8.5pt]"
                            style={border}
                        >
                            <tbody className="h-full">
                                <tr>
                                    <td
                                        className={`${cell} text-right`}
                                        style={border}
                                    >
                                        Total
                                    </td>
                                    <td
                                        className={`${cell} w-[22mm] text-right font-bold text-black`}
                                        style={border}
                                    >
                                        ${money(invoice.total_amount)}
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        className={`${cell} text-right`}
                                        style={border}
                                    >
                                        Deposit
                                    </td>
                                    <td
                                        className={`${cell} text-right text-black`}
                                        style={border}
                                    >
                                        ${money(invoice.paid_amount)}
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        className={`${cell} text-right`}
                                        style={border}
                                    >
                                        Balance
                                    </td>
                                    <td
                                        className={`${cell} text-right font-bold text-black`}
                                        style={border}
                                    >
                                        ${money(invoice.balance_amount)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <p className="mt-1 text-center text-[8pt] font-semibold">
                        Address: No. 10, Phnom Penh, Cambodia
                    </p>
                </div>
            </div>
        </>
    );
}

InvoicePrint.layout = {
    breadcrumbs: [
        {
            title: 'Treatment Cases',
            href: treatmentCaseRoutes.index(),
        },
        {
            title: 'Invoice Print',
            href: '#',
        },
    ],
};
