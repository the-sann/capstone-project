import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import appointments from '@/routes/appointments';
import { Appointment } from '@/types/app/types';
import { Head, router } from '@inertiajs/react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    ArrowUpRight,
    Calendar,
    Check,
    Clock,
    Phone,
    UserRound,
} from 'lucide-react';

interface Props {
    appointment: Appointment;
}

export default function Show({ appointment }: Props) {
    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        const hour = Number(hours);
        const period = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;

        return `${String(formattedHour).padStart(2, '0')}:${minutes} ${period}`;
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleCloseAppointment = () => {
        if (appointment.status === 'closed') return;

        router.patch(
            `/appointments/${appointment.id}/close`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const isOpen = appointment.status === 'open';

    return (
        <>
            <Head title={`Appointment - ${appointment.patient.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Appointment{' '}
                            <span className="font-mono text-foreground">
                                #{appointment.appointment_id}
                            </span>
                        </p>

                        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                            {appointment.reason}
                        </h1>
                    </div>
                    <div
                        className={`flex items-center gap-2 text-sm font-medium ${
                            isOpen
                                ? 'text-emerald-500'
                                : 'text-muted-foreground'
                        }`}
                    >
                        <span
                            className={`h-2 w-2 rounded-full ${
                                isOpen
                                    ? 'bg-emerald-500'
                                    : 'bg-muted-foreground'
                            }`}
                        />
                        {isOpen ? 'Open' : 'Closed'}
                    </div>
                </div>

                {/* Appointment + Patient */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Appointment Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Appointment</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Date
                                    </p>

                                    <p className="font-medium">
                                        {formatDate(
                                            appointment.appointment_date,
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Clock className="mt-0.5 h-5 w-5 text-muted-foreground" />

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Time
                                    </p>

                                    <p className="font-medium">
                                        {formatTime(
                                            appointment.appointment_time,
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <p className="text-xs text-muted-foreground">
                                    Dentist
                                </p>

                                <p className="mt-1 font-medium">
                                    {appointment.dentist.name}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Patient Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Patient</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                    <UserRound className="h-5 w-5 text-muted-foreground" />
                                </div>

                                <div className="min-w-0">
                                    <p className="font-semibold">
                                        {appointment.patient.name}
                                    </p>

                                    <p className="font-mono text-xs text-muted-foreground">
                                        {appointment.patient.patient_id}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                                    <Phone className="h-4 w-4" />

                                    <a
                                        href={`tel:${appointment.patient.phone}`}
                                        className="text-foreground hover:underline"
                                    >
                                        {appointment.patient.phone}
                                    </a>
                                </div>

                                <Button
                                    variant="link"
                                    className="mt-3 h-auto p-0"
                                    // Add your patient route here
                                    // onClick={() =>
                                    //     router.visit(
                                    //         patients.show(
                                    //             appointment.patient.id,
                                    //         ),
                                    //     )
                                    // }
                                >
                                    View patient
                                    <ArrowUpRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Reason & Note */}
                <Card>
                    <CardHeader>
                        <CardTitle>Appointment Details</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-5">
                        <div>
                            <p className="mb-1 text-sm text-muted-foreground">
                                Reason
                            </p>

                            <p className="font-medium">{appointment.reason}</p>
                        </div>

                        <div className="border-t pt-5">
                            <p className="mb-1 text-sm text-muted-foreground">
                                Note
                            </p>

                            <p className="leading-relaxed">
                                {appointment.note || 'No note provided.'}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                {isOpen ? (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full sm:w-auto"
                            >
                                <Check className="h-4 w-4" />
                                Close Appointment
                            </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Close this appointment?
                                </AlertDialogTitle>

                                <AlertDialogDescription>
                                    Are you sure you want to close this
                                    appointment? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction asChild>
                                    <Button
                                        variant="destructive"
                                        className="text-white hover:text-white"
                                        onClick={handleCloseAppointment}
                                    >
                                        Close Appointment
                                    </Button>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                ) : (
                    <Button
                        variant="secondary"
                        disabled
                        className="w-full sm:w-auto"
                    >
                        <Check className="h-4 w-4" />
                        Appointment Closed
                    </Button>
                )}
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        {
            title: 'Appointment',
            href: appointments.index(),
        },
        {
            title: 'Details Appointment',
            href: '#',
        },
    ],
};
