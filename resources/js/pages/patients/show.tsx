import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, Head } from '@inertiajs/react';
import patients from '@/routes/patients';

import invoices from '@/routes/invoices';
import { Patient } from '@/types/app/types';
import { Eye } from 'lucide-react';
import treatmentsCase from '@/routes/treatments-case';

import { CalendarDays, ClipboardList, Banknote, Wallet } from 'lucide-react';
import { formatCurrency } from '../treatment-cases/show';
interface PatientSummary {
    total_appointments: number;
    open_appointments: number;
    closed_appointments: number;
    total_treatment_cases: number;
    ongoing_cases: number;
    completed_cases: number;
    cancelled_cases: number;
    total_cost: number;
    outstanding_balance: number;
}

interface Props {
    patient: Patient & {
        appointments: {
            id: number;
            appointment_date: string;
            status: string;
            dentist?: { name: string } | null;
        }[];
        treatment_cases: PatientTreatmentCase[];
    };
    summary: PatientSummary;
}

type TreatmentItem = {
    id: number;
    tooth_number: string | null;
    status: string;
    treatment_service?: {
        name: string;
    } | null;
};

type PatientTreatmentCase = {
    id: number;
    case_id: string;
    created_at: string;
    diagnosis: string | null;
    total_amount: number;
    balance_amount: number;
    status: string;
    dentist?: { name: string } | null;
    invoice?: { id: number } | null;
    items: TreatmentItem[];
};

export default function Show({ patient, summary }: Props) {
    return (
        <>
            <Head title={`Patient - ${patient.name}`} />

            <div className="flex flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">{patient.name}</h1>
                    <p className="text-sm text-muted-foreground">
                        Patient details and medical history
                    </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {/* Total Appointments */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Appointments
                            </CardTitle>
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold">
                                {summary.total_appointments}
                            </div>

                            <div className="mt-2 flex flex-wrap gap-3 text-xs">
                                <span className="text-muted-foreground">
                                    Open: {summary.open_appointments}
                                </span>

                                <span className="text-muted-foreground">
                                    Closed: {summary.closed_appointments}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Treatment Cases */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Treatment Cases
                            </CardTitle>
                            <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold">
                                {summary.total_treatment_cases}
                            </div>

                            <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                <span className="text-muted-foreground">
                                    Ongoing: {summary.ongoing_cases}
                                </span>
                                <span className="text-muted-foreground">
                                    Completed: {summary.completed_cases}
                                </span>
                                <span className="text-muted-foreground">
                                    Cancelled: {summary.cancelled_cases}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Cost */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Cost
                            </CardTitle>
                            <Banknote className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(summary.total_cost)}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Total treatment cost
                            </p>
                        </CardContent>
                    </Card>

                    {/* Outstanding Balance */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Outstanding Balance
                            </CardTitle>
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(summary.outstanding_balance)}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Remaining amount to pay
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="overview">
                    <TabsList variant="line">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="appointments">
                            Appointments
                        </TabsTrigger>
                        <TabsTrigger value="invoices">Invoices</TabsTrigger>
                    </TabsList>

                    {/* Overview */}
                    <TabsContent value="overview" className="mt-4 space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                            </CardHeader>

                            <CardContent className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Patient ID
                                    </p>
                                    <p className="font-medium">
                                        {patient.patient_id}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Full Name
                                    </p>
                                    <p className="font-medium">
                                        {patient.name}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Phone
                                    </p>
                                    <p>{patient.phone || '-'}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Appointments
                                    </p>
                                    <p className="font-medium">
                                        {patient.appointments.length}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Treatment Cases
                                    </p>
                                    <p className="font-medium">
                                        {patient.treatment_cases.length}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Treatment History</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    All treatments recorded for this patient,
                                    newest first.
                                </p>
                            </CardHeader>

                            <CardContent>
                                {patient.treatment_cases.length === 0 ||
                                patient.treatment_cases.every(
                                    (treatmentCase) =>
                                        !treatmentCase.items?.length,
                                ) ? (
                                    <p className="text-sm text-muted-foreground">
                                        No treatment history found for this
                                        patient.
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {[...patient.treatment_cases]
                                            .sort(
                                                (a, b) =>
                                                    new Date(
                                                        b.created_at,
                                                    ).getTime() -
                                                    new Date(
                                                        a.created_at,
                                                    ).getTime(),
                                            )
                                            .flatMap((treatmentCase) =>
                                                treatmentCase.items.map(
                                                    (item) => ({
                                                        ...item,
                                                        caseId: treatmentCase.case_id,
                                                        caseRecordId:
                                                            treatmentCase.id,
                                                        treatmentDate:
                                                            treatmentCase.created_at,
                                                    }),
                                                ),
                                            )
                                            .map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex flex-col gap-3 border-b pb-4 last:border-0 sm:flex-row sm:items-center sm:justify-between"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="rounded-md bg-muted p-2">
                                                            <ClipboardList className="h-5 w-5 text-muted-foreground" />
                                                        </div>

                                                        <div className="space-y-1">
                                                            <p className="font-medium">
                                                                {item
                                                                    .treatment_service
                                                                    ?.name ??
                                                                    'Treatment item'}
                                                            </p>

                                                            <p className="text-sm text-muted-foreground">
                                                                Case:{' '}
                                                                {item.caseId}
                                                            </p>

                                                            <p className="text-sm text-muted-foreground">
                                                                Tooth:{' '}
                                                                {item.tooth_number ??
                                                                    '-'}
                                                                {' · '}
                                                                Date:{' '}
                                                                {new Date(
                                                                    item.treatmentDate,
                                                                ).toLocaleDateString()}
                                                            </p>

                                                            <Badge variant="outline">
                                                                {item.status.replace(
                                                                    '_',
                                                                    ' ',
                                                                )}
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={treatmentsCase.show(
                                                                item.caseRecordId,
                                                            )}
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Case
                                                        </Link>
                                                    </Button>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Appointments */}
                    <TabsContent value="appointments" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Appointment History</CardTitle>
                            </CardHeader>

                            <CardContent>
                                {patient.appointments.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        No appointments found.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {patient.appointments.map(
                                            (appointment) => (
                                                <div
                                                    key={appointment.id}
                                                    className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 last:border-0"
                                                >
                                                    <div>
                                                        <p className="font-medium">
                                                            {
                                                                appointment.appointment_date
                                                            }
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Dr.{' '}
                                                            {appointment.dentist
                                                                ?.name ??
                                                                'Not assigned'}
                                                        </p>
                                                        <Badge variant="outline">
                                                            {appointment.status}
                                                        </Badge>
                                                    </div>

                                                    {/* Replace with your actual appointment detail route */}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/appointments/${appointment.id}`}
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View
                                                        </Link>
                                                    </Button>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Invoices */}
                    <TabsContent value="invoices" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Invoices</CardTitle>
                            </CardHeader>

                            <CardContent>
                                {patient.treatment_cases.filter(
                                    (item) => item.invoice,
                                ).length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        No invoices found.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {patient.treatment_cases
                                            .filter((item) => item.invoice)
                                            .map((item) => (
                                                <div
                                                    key={item.invoice!.id}
                                                    className="flex items-center justify-between gap-3 border-b pb-3 last:border-0"
                                                >
                                                    <div>
                                                        <p className="font-medium">
                                                            Invoice for{' '}
                                                            {item.case_id}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {item.diagnosis ||
                                                                'Treatment case'}
                                                        </p>
                                                    </div>

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={invoices.show(
                                                                item.invoice!
                                                                    .id,
                                                            )}
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Invoice
                                                        </Link>
                                                    </Button>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        {
            title: 'Patients',
            href: patients.index(),
        },
        {
            title: 'Patient Details',
            href: '#',
        },
    ],
};
