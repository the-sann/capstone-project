import { Head, Link, router } from '@inertiajs/react';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock,
    DollarSign,
    FileText,
    Pencil,
    Trash,
    UserRound,
    Stethoscope,
    Plus,
    Check,
} from 'lucide-react';

import treatmentCaseRoutes from '@/routes/treatments-case';
import treatmentsCaseItems from '@/routes/treatments-case-items';
import treatmentsCaseAppointments from '@/routes/treatments-case/appointments';
import invoices from '@/routes/invoices';
import payments from '@/routes/payments';

type Patient = {
    id: number;
    patient_id: string;
    name: string;
};

type Dentist = {
    id: number;
    name: string;
};

type TreatmentService = {
    id: number;
    name: string;
    price: number;
};

type TreatmentItem = {
    id: number;

    treatment_service_id: number;
    treatment_service: TreatmentService;

    tooth_number: string | null;
    quantity: number;
    unit_price: number;
    total_price: number;

    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';

    completed_at: string | null;
    notes: string | null;
};

type Appointment = {
    id: number;
    appointment_id: string;
    appointment_date: string;
    appointment_time: string;
    status: string;
};
type Invoice = {
    id: number;
    invoice_id: string;
    total_amount: string;
    paid_amount: string;
    balance_amount: string;
    status: 'unpaid' | 'partial' | 'paid' | 'cancelled';
};
type TreatmentCase = {
    id: number;
    case_id: string;

    patient: Patient;
    dentist: Dentist;

    diagnosis: string | null;
    notes: string | null;

    status: 'ongoing' | 'completed' | 'cancelled';

    total_amount: number;
    paid_amount: number;
    balance_amount: number;

    items: TreatmentItem[];
    appointments: Appointment[];
    invoice?: Invoice | null;
    created_at: string;
    updated_at: string;
};

type Props = {
    treatmentCase: TreatmentCase;
};

function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(Number(value));
}

function formatDate(date: string | null) {
    if (!date) {
        return '-';
    }

    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(new Date(date));
}

function formatTime(time: string | null) {
    if (!time) {
        return '-';
    }

    const [hour, minute] = time.split(':');

    const date = new Date();
    date.setHours(Number(hour), Number(minute));

    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }).format(date);
}

function getStatusVariant(status: TreatmentCase['status']) {
    switch (status) {
        case 'completed':
            return 'default';

        case 'cancelled':
            return 'destructive';

        default:
            return 'secondary';
    }
}

function getItemStatusClass(status: TreatmentItem['status']) {
    switch (status) {
        case 'completed':
            return 'bg-green-100 text-green-700';

        case 'in_progress':
            return 'bg-blue-100 text-blue-700';

        case 'cancelled':
            return 'bg-red-100 text-red-700';

        default:
            return 'bg-yellow-100 text-yellow-700';
    }
}

export default function Show({ treatmentCase }: Props) {
    const completedItems = treatmentCase.items.filter(
        (item) => item.status === 'completed',
    ).length;

    return (
        <>
            <Head title={`Treatment Case ${treatmentCase.case_id}`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-semibold">
                                    {treatmentCase.case_id}
                                </h1>

                                <Badge
                                    variant={getStatusVariant(
                                        treatmentCase.status,
                                    )}
                                >
                                    {treatmentCase.status
                                        .replace('_', ' ')
                                        .replace(/\b\w/g, (char) =>
                                            char.toUpperCase(),
                                        )}
                                </Badge>
                            </div>

                            <p className="text-sm text-muted-foreground">
                                Treatment case details and treatment history
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {!treatmentCase.invoice ? (
                            <Button asChild>
                                <Link href={invoices.create(treatmentCase.id)}>
                                    Create Invoice
                                </Link>
                            </Button>
                        ) : treatmentCase.invoice.status !== 'paid' &&
                          treatmentCase.invoice.status !== 'cancelled' ? (
                            <Button asChild>
                                <Link
                                    href={
                                        payments.create(
                                            treatmentCase.invoice.id,
                                        ).url
                                    }
                                >
                                    Add Payment
                                </Link>
                            </Button>
                        ) : null}

                        <Button asChild>
                            <Link
                                href={treatmentCaseRoutes.edit(
                                    treatmentCase.id,
                                )}
                            >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Case
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Patient / Dentist */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserRound className="h-5 w-5" />
                                Patient
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Patient ID
                                </p>

                                <p className="font-medium">
                                    {treatmentCase.patient.patient_id}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Name
                                </p>

                                <p className="font-medium">
                                    {treatmentCase.patient.name}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Stethoscope className="h-5 w-5" />
                                Dentist
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Assigned Dentist
                            </p>

                            <p className="font-medium">
                                Dr. {treatmentCase.dentist.name}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Diagnosis / Notes */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Case Information
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="grid gap-6 md:grid-cols-2">
                        <div>
                            <p className="mb-1 text-sm text-muted-foreground">
                                Diagnosis
                            </p>

                            <p className="whitespace-pre-wrap">
                                {treatmentCase.diagnosis ||
                                    'No diagnosis recorded.'}
                            </p>
                        </div>

                        <div>
                            <p className="mb-1 text-sm text-muted-foreground">
                                Notes
                            </p>

                            <p className="whitespace-pre-wrap">
                                {treatmentCase.notes || 'No notes recorded.'}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Treatment Summary */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Total Amount</CardDescription>

                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <DollarSign className="h-5 w-5" />
                                {formatCurrency(treatmentCase.total_amount)}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Paid Amount</CardDescription>

                            <CardTitle className="text-2xl">
                                {formatCurrency(treatmentCase.paid_amount)}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Balance</CardDescription>

                            <CardTitle className="text-2xl">
                                {formatCurrency(treatmentCase.balance_amount)}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>
                                Completed Treatments
                            </CardDescription>

                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <CheckCircle2 className="h-5 w-5" />
                                {completedItems}/{treatmentCase.items.length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Treatment Items */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Treatment Items</CardTitle>

                            <CardDescription>
                                Services included in this treatment case
                            </CardDescription>
                        </div>

                        <Button asChild>
                            <Link
                                href={treatmentsCaseItems.create(
                                    treatmentCase.id,
                                )}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Treatment
                            </Link>
                        </Button>
                    </CardHeader>

                    <CardContent>
                        {treatmentCase.items.length === 0 ? (
                            <div className="py-10 text-center text-sm text-muted-foreground">
                                No treatment items have been added yet.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left">
                                            <th className="px-4 py-3 font-medium">
                                                #
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Treatment
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Tooth
                                            </th>
                                            <th className="px-4 py-3 text-center font-medium">
                                                Qty
                                            </th>
                                            <th className="px-4 py-3 text-right font-medium">
                                                Unit Price
                                            </th>
                                            <th className="px-4 py-3 text-right font-medium">
                                                Total
                                            </th>
                                            <th className="px-4 py-3 text-center font-medium">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 text-right font-medium">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {treatmentCase.items.map(
                                            (item, index) => (
                                                <tr
                                                    key={item.id}
                                                    className="border-b last:border-0"
                                                >
                                                    <td className="px-4 py-4">
                                                        {index + 1}
                                                    </td>

                                                    <td className="px-4 py-4">
                                                        <div>
                                                            <p className="font-medium">
                                                                {
                                                                    item
                                                                        .treatment_service
                                                                        .name
                                                                }
                                                            </p>

                                                            {item.notes && (
                                                                <p className="mt-1 text-xs text-muted-foreground">
                                                                    {item.notes}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td className="px-4 py-4">
                                                        {item.tooth_number ||
                                                            '-'}
                                                    </td>

                                                    <td className="px-4 py-4 text-center">
                                                        {item.quantity}
                                                    </td>

                                                    <td className="px-4 py-4 text-right">
                                                        {formatCurrency(
                                                            item.unit_price,
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-4 text-right font-medium">
                                                        {formatCurrency(
                                                            item.total_price,
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-4 text-center">
                                                        <span
                                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getItemStatusClass(
                                                                item.status,
                                                            )}`}
                                                        >
                                                            {item.status
                                                                .replace(
                                                                    '_',
                                                                    ' ',
                                                                )
                                                                .replace(
                                                                    /\b\w/g,
                                                                    (char) =>
                                                                        char.toUpperCase(),
                                                                )}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-right">
                                                        <div className="flex justify-end gap-1">
                                                            {item.status !==
                                                                'completed' && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-emerald-600 hover:text-emerald-600"
                                                                    onClick={() => {
                                                                        if (
                                                                            !confirm(
                                                                                'Are you sure you want to complete this treatment item?',
                                                                            )
                                                                        ) {
                                                                            return;
                                                                        }

                                                                        router.patch(
                                                                            treatmentsCaseItems.complete(
                                                                                {
                                                                                    treatmentCase:
                                                                                        treatmentCase.id,
                                                                                    item: item.id,
                                                                                },
                                                                            ),
                                                                        );
                                                                    }}
                                                                >
                                                                    <Check className="mr-2 h-4 w-4" />
                                                                    Complete
                                                                </Button>
                                                            )}
                                                            <Button
                                                                asChild
                                                                variant="ghost"
                                                                size="sm"
                                                            >
                                                                <Link
                                                                    href={treatmentsCaseItems.edit(
                                                                        {
                                                                            treatmentCase:
                                                                                treatmentCase.id,
                                                                            item: item.id,
                                                                        },
                                                                    )}
                                                                >
                                                                    <Pencil className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </Link>
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-destructive hover:text-destructive"
                                                                onClick={() => {
                                                                    if (
                                                                        confirm(
                                                                            'Are you sure you want to delete this treatment item?',
                                                                        )
                                                                    ) {
                                                                        router.delete(
                                                                            treatmentsCaseItems.destroy(
                                                                                {
                                                                                    treatmentCase:
                                                                                        treatmentCase.id,
                                                                                    item: item.id,
                                                                                },
                                                                            ),
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                <Trash className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>

                                    <tfoot>
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-4 py-4 text-right font-semibold"
                                            >
                                                Total
                                            </td>

                                            <td className="px-4 py-4 text-right font-semibold">
                                                {formatCurrency(
                                                    treatmentCase.total_amount,
                                                )}
                                            </td>

                                            <td />
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Appointments */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <CalendarDays className="h-5 w-5" />
                                Appointments
                            </CardTitle>

                            <CardDescription>
                                Appointments associated with this treatment case
                            </CardDescription>
                        </div>

                        <Button asChild>
                            <Link
                                href={treatmentsCaseAppointments.create(
                                    treatmentCase.id,
                                )}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Make Appointment
                            </Link>
                        </Button>
                    </CardHeader>

                    <CardContent>
                        {treatmentCase.appointments.length === 0 ? (
                            <div className="py-8 text-center text-sm text-muted-foreground">
                                No appointments associated with this case.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {treatmentCase.appointments.map(
                                    (appointment) => (
                                        <div
                                            key={appointment.id}
                                            className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {appointment.appointment_id}
                                                </p>

                                                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <CalendarDays className="h-4 w-4" />
                                                        {formatDate(
                                                            appointment.appointment_date,
                                                        )}
                                                    </span>

                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-4 w-4" />
                                                        {formatTime(
                                                            appointment.appointment_time,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            <Badge variant="outline">
                                                {appointment.status
                                                    .replace('_', ' ')
                                                    .replace(/\b\w/g, (char) =>
                                                        char.toUpperCase(),
                                                    )}
                                            </Badge>
                                        </div>
                                    ),
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Footer information */}
                <div className="text-sm text-muted-foreground">
                    Created {formatDate(treatmentCase.created_at)}
                    {' · '}
                    Last updated {formatDate(treatmentCase.updated_at)}
                </div>
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
            title: 'Details',
            href: '#',
        },
    ],
};
