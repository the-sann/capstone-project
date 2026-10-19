import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
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

/**
 * All positions below are in millimetres, measured from the top-left corner
 * of the A5 sheet (148 x 210 mm). They were estimated from a photo of the
 * pad, so use the X / Y offset controls on screen to fine-tune after a
 * test print. The offsets are saved in this browser.
 */
const ROWS_PER_PAGE = 14;
const FIRST_ROW_TOP = 72.5; // top of text in row 1
const ROW_PITCH = 7.52; // distance between rows
const ROW_HEIGHT = 7; // text box height of a row

const COL = {
    desc: { left: 20, width: 50 },
    qty: { left: 71, width: 12 },
    price: { left: 83, width: 16 },
    appt: { left: 100, width: 22 },
    total: { left: 123, width: 16 },
};

const HEADER = {
    // System invoice ID, printed just below the pad's red serial number
    invoiceId: { left: 107, top: 30.5, width: 34 },
    name: { left: 36, top: 31.5, width: 100 },
    sex: { left: 22, top: 38.5, width: 25 },
    age: { left: 54, top: 38.5, width: 20 },
    tel: { left: 22, top: 46, width: 60 },
    day: { left: 24, top: 53.5 },
    month: { left: 41, top: 53.5 },
    year: { left: 55, top: 53.5 },
};

const SUMMARY = {
    note: { left: 33, top: 177, width: 68 },
    total: { left: 127, top: 178.5, width: 16 },
    deposit: { left: 127, top: 185.5, width: 16 },
    balance: { left: 127, top: 192, width: 16 },
};

const STORAGE_KEY = 'invoice-print-offset';

function chunk<T>(list: T[], size: number): T[][] {
    if (list.length === 0) return [[]];
    const pages: T[][] = [];
    for (let i = 0; i < list.length; i += size) {
        pages.push(list.slice(i, i + size));
    }
    return pages;
}

export default function InvoicePrint({ invoice }: Props) {
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [showGuides, setShowGuides] = useState(false);

    // Load saved offsets
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const { x, y } = JSON.parse(saved);
                setOffsetX(Number(x) || 0);
                setOffsetY(Number(y) || 0);
            }
        } catch {
            // storage unavailable, use defaults
        }
    }, []);

    const saveOffsets = (x: number, y: number) => {
        setOffsetX(x);
        setOffsetY(y);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ x, y }));
        } catch {
            // ignore
        }
    };

    const money = (value: number | string) =>
        Number(value).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const date = new Date(invoice.created_at);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());

    const formatDate = (value: string) =>
        new Date(value).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
        });

    const patient = invoice.treatment_case.patient;
    const pages = chunk(invoice.items, ROWS_PER_PAGE);
    const hasDiscount = Number(invoice.discount) > 0;

    // Shared style for every absolutely positioned value
    const place = (
        pos: { left: number; top: number; width?: number },
        extra: React.CSSProperties = {},
    ): React.CSSProperties => ({
        position: 'absolute',
        left: `${pos.left}mm`,
        top: `${pos.top}mm`,
        width: pos.width ? `${pos.width}mm` : undefined,
        whiteSpace: 'nowrap',
        ...extra,
    });

    const guide = showGuides
        ? 'outline outline-1 outline-dashed outline-red-400 print:outline-none'
        : '';

    return (
        <>
            <Head title={`Invoice ${invoice.invoice_id}`} />

            <style>{`
                @page { size: A5 portrait; margin: 0; }
                @media print {
                    html, body { margin: 0; background: #fff; }
                    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
            `}</style>

            <div className="min-h-screen bg-gray-100 p-6 print:fixed print:inset-0 print:z-50 print:min-h-0 print:bg-white print:p-0">
                {/* Controls (screen only) */}
                <div className="mx-auto mb-4 flex w-[148mm] flex-wrap items-center justify-between gap-3 rounded-md bg-white p-3 text-sm shadow-sm print:hidden">
                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1">
                            X (mm)
                            <input
                                type="number"
                                step="0.5"
                                value={offsetX}
                                onChange={(e) =>
                                    saveOffsets(Number(e.target.value), offsetY)
                                }
                                className="w-16 rounded border px-1 py-0.5"
                            />
                        </label>
                        <label className="flex items-center gap-1">
                            Y (mm)
                            <input
                                type="number"
                                step="0.5"
                                value={offsetY}
                                onChange={(e) =>
                                    saveOffsets(offsetX, Number(e.target.value))
                                }
                                className="w-16 rounded border px-1 py-0.5"
                            />
                        </label>
                        <label className="flex items-center gap-1">
                            <input
                                type="checkbox"
                                checked={showGuides}
                                onChange={(e) => setShowGuides(e.target.checked)}
                            />
                            Show guides
                        </label>
                    </div>

                    <button
                        onClick={() => window.print()}
                        className="rounded-md bg-black px-4 py-2 font-medium text-white"
                    >
                        Print on pad (A5)
                    </button>
                </div>

                {pages.map((rows, pageIndex) => {
                    const isLastPage = pageIndex === pages.length - 1;

                    return (
                        <div
                            key={pageIndex}
                            className="relative mx-auto mb-6 h-[210mm] w-[148mm] overflow-hidden bg-white shadow-sm ring-1 ring-gray-300 print:mb-0 print:shadow-none print:ring-0"
                            style={{
                                breakAfter: isLastPage ? 'auto' : 'page',
                                fontFamily:
                                    "'Noto Sans Khmer', 'Khmer OS', Arial, sans-serif",
                                color: '#000',
                                fontSize: '9pt',
                                lineHeight: 1.15,
                            }}
                        >
                            {/* Everything inside is shifted by the calibration offset */}
                            <div
                                className="absolute inset-0"
                                style={{
                                    transform: `translate(${offsetX}mm, ${offsetY}mm)`,
                                }}
                            >
                                {/* System invoice ID, below the pad's serial number */}
                                <div
                                    className={guide}
                                    style={place(HEADER.invoiceId, {
                                        textAlign: 'right',
                                        fontSize: '8pt',
                                        fontWeight: 600,
                                    })}
                                >
                                    {invoice.invoice_id}
                                </div>

                                {/* Patient info */}
                                <div
                                    className={`font-semibold ${guide}`}
                                    style={place(HEADER.name)}
                                >
                                    {patient.name}
                                </div>
                                <div className={guide} style={place(HEADER.sex)}>
                                    {patient.sex ?? ''}
                                </div>
                                <div className={guide} style={place(HEADER.age)}>
                                    {patient.age ?? ''}
                                </div>
                                <div className={guide} style={place(HEADER.tel)}>
                                    {patient.phone ?? ''}
                                </div>
                                <div className={guide} style={place(HEADER.day)}>
                                    {day}
                                </div>
                                <div className={guide} style={place(HEADER.month)}>
                                    {month}
                                </div>
                                <div className={guide} style={place(HEADER.year)}>
                                    {year}
                                </div>

                                {/* Treatment rows */}
                                {rows.map((item, index) => {
                                    const top = FIRST_ROW_TOP + index * ROW_PITCH;
                                    const rowBase = { top, height: ROW_HEIGHT };

                                    return (
                                        <div key={item.id}>
                                            <div
                                                className={`overflow-hidden ${guide}`}
                                                style={place(
                                                    { ...COL.desc, ...rowBase },
                                                    {
                                                        height: `${ROW_HEIGHT}mm`,
                                                        whiteSpace: 'normal',
                                                        fontSize: '8pt',
                                                        lineHeight: 1.1,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    },
                                                )}
                                            >
                                                <span>
                                                    {item.description ||
                                                        item.treatment_service?.name}
                                                    {item.tooth_number
                                                        ? ` (#${item.tooth_number})`
                                                        : ''}
                                                </span>
                                            </div>

                                            <div
                                                className={guide}
                                                style={place(
                                                    { ...COL.qty, ...rowBase },
                                                    { textAlign: 'center', paddingTop: '1.5mm' },
                                                )}
                                            >
                                                {item.quantity}
                                            </div>

                                            <div
                                                className={guide}
                                                style={place(
                                                    { ...COL.price, ...rowBase },
                                                    { textAlign: 'right', paddingTop: '1.5mm', paddingRight: '1mm' },
                                                )}
                                            >
                                                {money(item.unit_price)}
                                            </div>

                                            <div
                                                className={guide}
                                                style={place(
                                                    { ...COL.appt, ...rowBase },
                                                    { textAlign: 'center', paddingTop: '1.5mm', fontSize: '7.5pt' },
                                                )}
                                            >
                                                {item.appointment_date
                                                    ? formatDate(item.appointment_date)
                                                    : ''}
                                            </div>

                                            <div
                                                className={guide}
                                                style={place(
                                                    { ...COL.total, ...rowBase },
                                                    { textAlign: 'right', paddingTop: '1.5mm', paddingRight: '1mm' },
                                                )}
                                            >
                                                {money(item.total_price)}
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Note + totals only on the last sheet */}
                                {isLastPage && (
                                    <>
                                        <div
                                            className={guide}
                                            style={place(SUMMARY.note, {
                                                whiteSpace: 'normal',
                                                fontSize: '8pt',
                                            })}
                                        >
                                            {hasDiscount
                                                ? `Discount: -$${money(invoice.discount)}`
                                                : ''}
                                        </div>

                                        <div
                                            className={`font-bold ${guide}`}
                                            style={place(SUMMARY.total, { textAlign: 'right', paddingRight: '1mm' })}
                                        >
                                            {money(invoice.total_amount)}
                                        </div>
                                        <div
                                            className={guide}
                                            style={place(SUMMARY.deposit, { textAlign: 'right', paddingRight: '1mm' })}
                                        >
                                            {money(invoice.paid_amount)}
                                        </div>
                                        <div
                                            className={`font-bold ${guide}`}
                                            style={place(SUMMARY.balance, { textAlign: 'right', paddingRight: '1mm' })}
                                        >
                                            {money(invoice.balance_amount)}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
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