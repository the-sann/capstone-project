import { Head, Link, useForm } from '@inertiajs/react';
import { Calculator, Save, Trash2 } from 'lucide-react';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import treatmentCaseRoutes from '@/routes/treatments-case';

type Patient = {
    id: number;
    patient_id: string;
    name: string;
};

type Dentist = {
    id: number;
    name: string;
};

type TreatmentCase = {
    id: number;
    case_id: string;
    patient: Patient;
    dentist: Dentist;
    total_amount: number;
    paid_amount: number;
    balance_amount: number;
};

type TreatmentService = {
    id: number;
    name: string;
    price: number;
};

type TreatmentCaseItem = {
    id: number;
    treatment_case_id: number;
    treatment_service_id: number;
    tooth_number: string | null;
    quantity: number;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    notes: string | null;
    treatment_service?: TreatmentService;
};

type Props = {
    treatmentCase: TreatmentCase;
    item: TreatmentCaseItem;
    treatmentServices: TreatmentService[];
};

type ItemForm = {
    treatment_service_id: string;
    tooth_number: string;
    quantity: number;
    status: TreatmentCaseItem['status'];
    notes: string;
    _method: 'PUT';
};

export default function Edit({
    treatmentCase,
    item,
    treatmentServices,
}: Props) {
    const { data, setData, post, processing, errors } = useForm<ItemForm>({
        treatment_service_id: String(item.treatment_service_id),
        tooth_number: item.tooth_number ?? '',
        quantity: item.quantity,
        status: item.status,
        notes: item.notes ?? '',
        _method: 'PUT',
    });

    const selectedService = treatmentServices.find(
        (service) => String(service.id) === data.treatment_service_id,
    );

    const itemTotal =
        Number(selectedService?.price ?? 0) * Number(data.quantity || 0);

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        post(`/treatments-case/${treatmentCase.id}/items/${item.id}`);
    }

    return (
        <>
            <Head title="Edit Treatment" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Edit Treatment</h1>

                    <p className="text-sm text-muted-foreground">
                        {treatmentCase.case_id} • {treatmentCase.patient.name}
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Treatment Service</CardTitle>

                            <CardDescription>
                                Update the treatment information for this
                                treatment case.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Treatment Service</Label>

                                    <Select
                                        value={data.treatment_service_id}
                                        onValueChange={(value) =>
                                            setData(
                                                'treatment_service_id',
                                                value,
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select service" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {treatmentServices.map(
                                                (service) => (
                                                    <SelectItem
                                                        key={service.id}
                                                        value={String(
                                                            service.id,
                                                        )}
                                                    >
                                                        {service.name} - $
                                                        {Number(
                                                            service.price,
                                                        ).toFixed(2)}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>

                                    {errors.treatment_service_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.treatment_service_id}
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Tooth Number</Label>

                                        <Input
                                            value={data.tooth_number}
                                            placeholder="e.g. 16"
                                            onChange={(e) =>
                                                setData(
                                                    'tooth_number',
                                                    e.target.value,
                                                )
                                            }
                                        />

                                        {errors.tooth_number && (
                                            <p className="text-sm text-destructive">
                                                {errors.tooth_number}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Quantity</Label>

                                        <Input
                                            type="number"
                                            min={1}
                                            value={data.quantity}
                                            onChange={(e) =>
                                                setData(
                                                    'quantity',
                                                    Number(e.target.value),
                                                )
                                            }
                                        />

                                        {errors.quantity && (
                                            <p className="text-sm text-destructive">
                                                {errors.quantity}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Status</Label>

                                    <Select
                                        value={data.status}
                                        onValueChange={(value) =>
                                            setData(
                                                'status',
                                                value as ItemForm['status'],
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="pending">
                                                Pending
                                            </SelectItem>

                                            <SelectItem value="in_progress">
                                                In Progress
                                            </SelectItem>

                                            <SelectItem value="completed">
                                                Completed
                                            </SelectItem>

                                            <SelectItem value="cancelled">
                                                Cancelled
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {errors.status && (
                                        <p className="text-sm text-destructive">
                                            {errors.status}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Notes</Label>

                                    <Textarea
                                        rows={4}
                                        value={data.notes}
                                        placeholder="Add treatment notes..."
                                        onChange={(e) =>
                                            setData('notes', e.target.value)
                                        }
                                    />

                                    {errors.notes && (
                                        <p className="text-sm text-destructive">
                                            {errors.notes}
                                        </p>
                                    )}
                                </div>

                                <div className="rounded-md bg-muted p-4 text-sm">
                                    <div className="flex justify-between">
                                        <span>Unit Price</span>

                                        <span>
                                            $
                                            {Number(
                                                selectedService?.price ?? 0,
                                            ).toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="mt-2 flex justify-between font-semibold">
                                        <span>Total</span>

                                        <span>${itemTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 border-t pt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        asChild
                                    >
                                        <Link
                                            href={treatmentCaseRoutes.show(
                                                treatmentCase.id,
                                            )}
                                        >
                                            Cancel
                                        </Link>
                                    </Button>

                                    <Button type="submit" disabled={processing}>
                                        <Save className="mr-2 h-4 w-4" />

                                        {processing
                                            ? 'Updating...'
                                            : 'Update Treatment'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="h-fit">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calculator className="h-5 w-5" />
                                Summary
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span>Case</span>

                                <span className="font-medium">
                                    {treatmentCase.case_id}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>Patient</span>

                                <span className="font-medium">
                                    {treatmentCase.patient.name}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>Current Case Total</span>

                                <span>
                                    $
                                    {Number(treatmentCase.total_amount).toFixed(
                                        2,
                                    )}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>Paid</span>

                                <span>
                                    $
                                    {Number(treatmentCase.paid_amount).toFixed(
                                        2,
                                    )}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>Balance</span>

                                <span>
                                    $
                                    {Number(
                                        treatmentCase.balance_amount,
                                    ).toFixed(2)}
                                </span>
                            </div>

                            <div className="flex justify-between border-t pt-3 text-lg font-semibold">
                                <span>Item Total</span>

                                <span>${itemTotal.toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        {
            title: 'Treatment Cases',
            href: treatmentCaseRoutes.index(),
        },
        {
            title: 'Details',
            href: '#',
        },
        {
            title: 'Edit Treatment',
            href: '#',
        },
    ],
};
