import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Calculator, Plus, Trash2 } from 'lucide-react';

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

type Props = {
    treatmentCase: TreatmentCase;
    treatmentServices: TreatmentService[];
};

type Item = {
    treatment_service_id: string;
    tooth_number: string;
    quantity: number;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    notes: string;
};

export default function Create({ treatmentCase, treatmentServices }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        items: Item[];
    }>({
        items: [
            {
                treatment_service_id: '',
                tooth_number: '',
                quantity: 1,
                status: 'pending',
                notes: '',
            },
        ],
    });

    const updateItem = <K extends keyof Item>(
        index: number,
        key: K,
        value: Item[K],
    ) => {
        const items = [...data.items];
        items[index] = { ...items[index], [key]: value };
        setData('items', items);
    };

    const addItem = () => {
        setData('items', [
            ...data.items,
            {
                treatment_service_id: '',
                tooth_number: '',
                quantity: 1,
                status: 'pending',
                notes: '',
            },
        ]);
    };

    const removeItem = (index: number) => {
        if (data.items.length === 1) return;
        setData(
            'items',
            data.items.filter((_, i) => i !== index),
        );
    };

    const grandTotal = data.items.reduce((sum, item) => {
        const service = treatmentServices.find(
            (s) => String(s.id) === item.treatment_service_id,
        );
        return sum + (service?.price ?? 0) * item.quantity;
    }, 0);

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(`/treatments-case/${treatmentCase.id}/items`);
    }

    return (
        <>
            <Head title="Add Treatments" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Add Treatments
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {treatmentCase.case_id} •{' '}
                            {treatmentCase.patient.name}
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="flex h-[760px] flex-col lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Treatment Services</CardTitle>
                            <CardDescription>
                                Add multiple services before saving.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="flex-1 overflow-hidden">
                            <form
                                onSubmit={submit}
                                className="flex h-full flex-col"
                            >
                                <div className="flex-1 space-y-6 overflow-y-auto pr-2">
                                    {data.items.map((item, index) => {
                                        const service = treatmentServices.find(
                                            (s) =>
                                                String(s.id) ===
                                                item.treatment_service_id,
                                        );

                                        return (
                                            <div
                                                key={index}
                                                className="space-y-4 rounded-lg border p-4"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-medium">
                                                        Service #{index + 1}
                                                    </h3>

                                                    {data.items.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-destructive"
                                                            onClick={() =>
                                                                removeItem(
                                                                    index,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="mr-1 h-4 w-4" />
                                                            Remove
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>
                                                        Treatment Service
                                                    </Label>

                                                    <Select
                                                        value={
                                                            item.treatment_service_id
                                                        }
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            updateItem(
                                                                index,
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
                                                                        key={
                                                                            service.id
                                                                        }
                                                                        value={String(
                                                                            service.id,
                                                                        )}
                                                                    >
                                                                        {
                                                                            service.name
                                                                        }{' '}
                                                                        - $
                                                                        {Number(
                                                                            service.price,
                                                                        ).toFixed(
                                                                            2,
                                                                        )}
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>

                                                    {
                                                        errors[
                                                            `items.${index}.treatment_service_id`
                                                        ]
                                                    }
                                                </div>

                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <Label>
                                                            Tooth Number
                                                        </Label>

                                                        <Input
                                                            value={
                                                                item.tooth_number
                                                            }
                                                            placeholder="e.g. 16"
                                                            onChange={(e) =>
                                                                updateItem(
                                                                    index,
                                                                    'tooth_number',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Quantity</Label>

                                                        <Input
                                                            type="number"
                                                            min={1}
                                                            value={
                                                                item.quantity
                                                            }
                                                            onChange={(e) =>
                                                                updateItem(
                                                                    index,
                                                                    'quantity',
                                                                    Number(
                                                                        e.target
                                                                            .value,
                                                                    ),
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Status</Label>

                                                    <Select
                                                        value={item.status}
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            updateItem(
                                                                index,
                                                                'status',
                                                                value as Item['status'],
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
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Notes</Label>

                                                    <Textarea
                                                        rows={3}
                                                        value={item.notes}
                                                        onChange={(e) =>
                                                            updateItem(
                                                                index,
                                                                'notes',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className="rounded-md bg-muted p-3 text-sm">
                                                    <div className="flex justify-between">
                                                        <span>Unit Price</span>
                                                        <span>
                                                            $
                                                            {Number(
                                                                service?.price ??
                                                                    0,
                                                            ).toFixed(2)}
                                                        </span>
                                                    </div>

                                                    <div className="mt-2 flex justify-between font-semibold">
                                                        <span>Total</span>
                                                        <span>
                                                            $
                                                            {(
                                                                Number(
                                                                    service?.price ??
                                                                        0,
                                                                ) *
                                                                item.quantity
                                                            ).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addItem}
                                    className="w-full"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Another Service
                                </Button>

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
                                        {processing
                                            ? 'Saving...'
                                            : 'Save All Treatments'}
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

                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span>Services</span>
                                <span>{data.items.length}</span>
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

                            <div className="flex justify-between border-t pt-3 text-lg font-semibold">
                                <span>New Items Total</span>
                                <span>${grandTotal.toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
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
            title: 'Details',
            href: '#',
        },
        {
            title: 'Add Treatments',
            href: '#',
        },
    ],
};
