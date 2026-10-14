import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import invoices from '@/routes/invoices';
import { TreatmentCaseItem } from '@/types/app/types';
import Show from './show';
import layout from '@/layouts/settings/layout';
import treatmentCaseRoutes from '@/routes/treatments-case';
interface TreatmentService {
    id: number;
    name: string;
    price: number;
}

type InvoiceTreatmentCase = TreatmentCase & {
    items: TreatmentCaseItem[];
};

interface Patient {
    id: number;
    name: string;
    patient_id: string;
}

interface Dentist {
    id: number;
    name: string;
}

interface TreatmentCase {
    id: number;
    case_id: string;
    patient: Patient;
    dentist: Dentist;
    items: TreatmentCaseItem[];
}

interface Props {
    treatmentCase: InvoiceTreatmentCase;
}

export default function Create({ treatmentCase }: Props) {
    const { post, processing } = useForm();

    function submit(e: React.FormEvent) {
        e.preventDefault();

        post(invoices.store(treatmentCase.id).url);
    }

    const subtotal = treatmentCase.items.reduce(
        (sum, item) => sum + Number(item.total_price),
        0,
    );

    return (
        <>
            <Head title="Create Invoice" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">Create Invoice</h1>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Treatment Case {treatmentCase.case_id}
                        </CardTitle>

                        <CardDescription>
                            Review the treatment services before creating the
                            invoice.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="mb-6 grid gap-2">
                            <div>
                                <span className="font-medium">Patient:</span>{' '}
                                {treatmentCase.patient.name}
                            </div>

                            <div>
                                <span className="font-medium">Dentist:</span>{' '}
                                {treatmentCase.dentist.name}
                            </div>
                        </div>

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
                                    {treatmentCase.items.map((item) => (
                                        <tr key={item.id} className="border-b">
                                            <td className="px-4 py-3">
                                                {item.treatment_service.name}
                                            </td>

                                            <td className="px-4 py-3">
                                                {item.tooth_number ?? '-'}
                                            </td>

                                            <td className="px-4 py-3 text-right">
                                                {item.quantity}
                                            </td>

                                            <td className="px-4 py-3 text-right">
                                                $
                                                {Number(
                                                    item.unit_price,
                                                ).toFixed(2)}
                                            </td>

                                            <td className="px-4 py-3 text-right">
                                                $
                                                {Number(
                                                    item.total_price,
                                                ).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <div className="w-full max-w-sm space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>

                                    <span>${subtotal.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total</span>

                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <form
                            onSubmit={submit}
                            className="mt-6 flex justify-end"
                        >
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create Invoice'}
                            </Button>
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
            title: 'Create Invoice',
            href: '#',
        },
    ],
};
