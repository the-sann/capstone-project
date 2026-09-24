import { Button } from '@/components/ui/button';
import appointments from '@/routes/appointments';
import { Appointment } from '@/types/app/types';
import { Head, Link, router } from '@inertiajs/react';
import { formatDate, formatTime } from '@/utils/dateTime';
import {
    CalendarDays,
    Clock,
    UserRound,
    Stethoscope,
    Pencil,
} from 'lucide-react';

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type AppointmentPagination = {
    data: Appointment[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
};

type Props = {
    appointments: AppointmentPagination;
};

export default function GetAllAppointments({
    appointments: appointmentData,
}: Props) {
    return (
        <>
            <Head title="Appointments" />

            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold">Appointments</h1>

                    <p className="text-sm text-muted-foreground">
                        View all open appointments
                    </p>
                </div>

                <div className="space-y-3">
                    {appointmentData.data.length === 0 ? (
                        <div className="rounded-lg border p-10 text-center">
                            <p className="text-muted-foreground">
                                No appointments found.
                            </p>
                        </div>
                    ) : (
                        appointmentData.data.map((appointment) => (
                            <Link
                                key={appointment.id}
                                href={`/appointments/${appointment.id}`}
                                className="block"
                            >
                                <div className="rounded-lg border bg-card p-5 transition hover:bg-muted/50">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="space-y-3">
                                            <div>
                                                <p className="font-semibold">
                                                    {appointment.patient.name}
                                                </p>

                                                <p className="text-sm text-muted-foreground">
                                                    {appointment.appointment_id}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <CalendarDays className="h-4 w-4" />
                                                    {formatDate(
                                                        appointment.appointment_date,
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    {formatTime(
                                                        appointment.appointment_time,
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Stethoscope className="h-4 w-4" />
                                                    Dr.{' '}
                                                    {appointment.dentist.name}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                    appointment.status ===
                                                    'open'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-muted text-muted-foreground'
                                                }`}
                                            >
                                                {appointment.status}
                                            </span>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    router.visit(
                                                        `/appointments/${appointment.id}/edit`,
                                                    );
                                                }}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="mt-4 border-t pt-4">
                                        <p className="text-sm">
                                            <span className="font-medium">
                                                Reason:
                                            </span>{' '}
                                            {appointment.reason}
                                        </p>

                                        {appointment.note && (
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {appointment.note}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {appointmentData.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {appointmentData.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url ?? '#'}
                                preserveScroll
                                className={`rounded-md border px-3 py-2 text-sm ${
                                    link.active
                                        ? 'bg-primary text-primary-foreground'
                                        : 'hover:bg-muted'
                                } ${
                                    !link.url
                                        ? 'pointer-events-none opacity-50'
                                        : ''
                                }`}
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

GetAllAppointments.layout = {
    breadcrumbs: [
        {
            title: 'Appointment',
            href: appointments.index(),
        },
        {
            title: 'All Appointments',
            href: '#',
        },
    ],
};
