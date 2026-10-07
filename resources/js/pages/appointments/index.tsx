import { Appointment } from '@/types/app/types';
import { PaginationIconsOnly } from '@/components/ui/pagination';
import appointmentRoutes from '@/routes/appointments';
import { Head, Link, router } from '@inertiajs/react';
import AppointmentCard from '@/components/app/AppointmentCard';
import { Eye, Pencil, Trash2, Ellipsis, Timer, List } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { formatTime } from '@/utils/dateTime';
import { Button } from '@/components/ui/button';
import NoAppointments from './components/NoAppointments';

export interface PaginatedAppointments {
    data: Appointment[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}
interface Props {
    todayAppointments: Appointment[];
    tomorrowAppointments: Appointment[];
    missedAppointments: Appointment[];
    upcomingAppointments: PaginatedAppointments;
}
export default function Index({
    todayAppointments,
    tomorrowAppointments,
    missedAppointments,
    upcomingAppointments,
}: Props) {
    const deleteAppointment = (appointment: Appointment) => {
        if (confirm(`Are you sure you want to delete this appointment?`)) {
            router.delete(`/appointments/${appointment.id}`);
        }
    };
    const getDateLabel = (date: string) => {
        const appointmentDate = new Date(date);
        const today = new Date();

        const appointmentDay = appointmentDate.toLocaleDateString('en-CA', {
            timeZone: 'Asia/Phnom_Penh',
        });

        const todayDay = today.toLocaleDateString('en-CA', {
            timeZone: 'Asia/Phnom_Penh',
        });

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const tomorrowDay = tomorrow.toLocaleDateString('en-CA', {
            timeZone: 'Asia/Phnom_Penh',
        });

        if (appointmentDay === todayDay) return 'Today';
        if (appointmentDay === tomorrowDay) return 'Tomorrow';

        return appointmentDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            timeZone: 'Asia/Phnom_Penh',
        });
    };
    return (
        <>
            <Head title="Appointment" />

            <div className="flex h-full min-w-0 flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap gap-3">
                    <Link href="/appointments/create">
                        <Button variant="outline" className="gap-2">
                            <Timer />
                            Create Appointment
                        </Button>
                    </Link>
                    <Link href={appointmentRoutes.all()}>
                        <Button variant="outline" className="gap-2">
                            <List />
                            All Appointments
                        </Button>
                    </Link>
                </div>
                <div className="space-y-8">
                    <section>
                        <h2 className="text-xl font-semibold text-red-600">
                            Missed Appointments
                        </h2>

                        {missedAppointments.length === 0 ? (
                            <NoAppointments
                                title="No missed appointments"
                                description="Great job! You have no missed appointments."
                            />
                        ) : (
                            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {missedAppointments.map((appointment) => (
                                    <AppointmentCard
                                        key={appointment.id}
                                        appointment={appointment}
                                        deleteAppointment={deleteAppointment}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                    {/* Today */}
                    <section>
                        <h2 className="text-xl font-semibold">
                            Today's Appointments
                        </h2>
                        {todayAppointments.length === 0 ? (
                            <NoAppointments
                                title="No appointments today"
                                description="You're all caught up. No patients are scheduled for today."
                            />
                        ) : (
                            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {todayAppointments.map((appointment) => (
                                    <AppointmentCard
                                        key={appointment.id}
                                        appointment={appointment}
                                        deleteAppointment={deleteAppointment}
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Tomorrow */}
                    <section>
                        <h2 className="text-xl font-semibold">
                            ⭐ Tomorrow's Appointments
                        </h2>
                        {tomorrowAppointments.length === 0 ? (
                            <NoAppointments
                                title="No appointments tomorrow"
                                description="You're all caught up. No patients are scheduled for tomorrow."
                            />
                        ) : (
                            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {tomorrowAppointments.map((appointment) => (
                                    <AppointmentCard
                                        key={appointment.id}
                                        appointment={appointment}
                                        priority
                                        deleteAppointment={deleteAppointment}
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Upcoming */}
                    <section>
                        <h2 className="text-xl font-semibold">
                            Upcoming Appointments
                        </h2>

                        {upcomingAppointments.data.length === 0 ? (
                            <NoAppointments
                                title="No upcoming appointments"
                                description="You have no upcoming appointments."
                            />
                        ) : (
                            <div className="mt-4">
                                {upcomingAppointments.data.map(
                                    (appointment) => (
                                        <div
                                            key={appointment.id}
                                            className="flex items-center justify-between rounded-lg border p-4"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {appointment.patient.name}
                                                </p>

                                                <p className="text-sm text-muted-foreground">
                                                    {appointment.reason}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <p>
                                                        {getDateLabel(
                                                            appointment.appointment_date,
                                                        )}
                                                    </p>

                                                    <p className="text-sm text-muted-foreground">
                                                        {formatTime(
                                                            appointment.appointment_time,
                                                        )}
                                                    </p>
                                                </div>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 shrink-0"
                                                        >
                                                            <Ellipsis className="h-4 w-4" />
                                                            <span className="sr-only">
                                                                Appointment
                                                                actions
                                                            </span>
                                                        </Button>
                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="w-40"
                                                    >
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/appointments/${appointment.id}`}
                                                                className="flex cursor-pointer items-center"
                                                            >
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View
                                                            </Link>
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/appointments/${appointment.id}/edit`}
                                                                className="flex cursor-pointer items-center"
                                                            >
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>

                                                        <DropdownMenuSeparator />

                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                deleteAppointment(
                                                                    appointment,
                                                                );
                                                            }}
                                                            className="cursor-pointer text-destructive focus:text-destructive"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        )}

                        <div className="mt-4">
                            <PaginationIconsOnly
                                currentPage={upcomingAppointments.current_page}
                                lastPage={upcomingAppointments.last_page}
                                route={appointmentRoutes.index().url}
                                perPage={upcomingAppointments.per_page}
                            />
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
Index.layout = {
    breadcrumbs: [
        {
            title: 'Appointment',
            href: appointmentRoutes.index(),
        },
    ],
};
