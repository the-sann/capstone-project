import { Appointment } from '@/types/app/types';
import { Button } from '../ui/button';
import {
    Check,
    Copy,
    Eye,
    Pencil,
    Trash,
    AlertCircle,
    Clock,
    CalendarArrowUp,
    DoorClosed,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from '@inertiajs/react';

interface CardProps {
    appointment: Appointment;
    priority?: boolean;
    deleteAppointment: (appointment: Appointment) => void;
}

export default function AppointmentCard({
    appointment,
    priority = false,
    deleteAppointment,
}: CardProps) {
    const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
    const copyPhone = async (phone: string) => {
        await navigator.clipboard.writeText(phone);

        setCopiedPhone(phone);

        setTimeout(() => {
            setCopiedPhone(null);
        }, 1500);
    };
    type AppointmentTiming = 'soon' | 'overdue' | 'upcoming';

    const appointmentDateTime = new Date(
        `${appointment.appointment_date.split('T')[0]}T${appointment.appointment_time}`,
    );

    const now = new Date();

    const diffInMinutes =
        (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60);

    const getAppointmentTiming = (): AppointmentTiming => {
        if (appointment.status !== 'open') {
            return 'upcoming';
        }

        // Time has already passed
        if (diffInMinutes <= 0) {
            return 'overdue';
        }

        // Appointment is within the next 1 hour
        if (diffInMinutes <= 60) {
            return 'soon';
        }

        return 'upcoming';
    };

    const timing = getAppointmentTiming();
    const timingStyles = {
        overdue: {
            container: 'border-red-600 dark:border-red-500',
            icon: 'text-red-500',
            badge: 'bg-red-950/60 text-red-400',
            label: 'Overdue',
            Icon: AlertCircle,
        },

        soon: {
            container: 'border-amber-500 dark:border-amber-400 ',
            icon: 'text-amber-500',
            badge: 'bg-amber-950/60 text-amber-400',
            label: 'Soon',
            Icon: Clock,
        },

        upcoming: {
            container: 'border-blue-500 dark:border-blue-500  ',
            icon: 'text-blue-500',
            badge: 'bg-blue-950/60 text-blue-400',
            label: 'Upcoming',
            Icon: CalendarArrowUp,
        },
    };

    const currentStyle = timingStyles[timing];
    const TimingIcon = currentStyle.Icon;

    // Convert 24-hour time to 12-hour AM/PM
    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        const hour = Number(hours);
        const period = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${String(formattedHour).padStart(2, '0')}:${minutes} ${period}`;
    };
    // Today / Tomorrow / date
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

        if (appointmentDay === todayDay) {
            return 'Today';
        }

        if (appointmentDay === tomorrowDay) {
            return 'Tomorrow';
        }

        return appointmentDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            timeZone: 'Asia/Phnom_Penh',
        });
    };

    return (
        <div
            className={`rounded-xl border bg-card p-5 shadow-sm transition hover:shadow-md ${currentStyle.container} ${priority ? 'ring-1 ring-primary/10' : ''}`}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-2xl font-bold">
                        {formatTime(appointment.appointment_time)}
                    </p>

                    <p className="text-sm text-muted-foreground">
                        {appointment.patient.name}
                    </p>
                </div>

                <span className="rounded-full bg-blue-900 px-3 py-1 text-xs font-medium text-white">
                    {getDateLabel(appointment.appointment_date)}
                </span>
            </div>

            <div className="mt-4 space-y-2 text-sm">
                <p>🦷 {appointment.reason}</p>
                <p>👨‍⚕️ Dr. {appointment.dentist.name}</p>
                <div>
                    <p className="mb-1 text-muted-foreground">Phone</p>

                    <div className="flex items-center justify-between gap-2 rounded-md border px-3 py-2">
                        <span className="font-medium">
                            {appointment.patient.phone}
                        </span>

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={() => copyPhone(appointment.patient.phone)}
                        >
                            {copiedPhone === appointment.patient.phone ? (
                                <Check className="h-4 w-4" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mt-5 flex gap-2">
                <Link
                    href={`/appointments/${appointment.id}`}
                    className="flex-1"
                >
                    <Button variant="outline" className="w-full gap-2">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                    </Button>
                </Link>
                {/* <Button variant="outline" className="gap-2">
                    <DoorClosed />
                    Close
                </Button> */}

                <Link href={`/appointments/${appointment.id}/edit`}>
                    <Button variant="outline" className="gap-2">
                        <Pencil className="h-4 w-4" />
                        Edit
                    </Button>
                </Link>
                <Button
                    variant="outline"
                    className="gap-2 text-destructive hover:text-destructive-foreground"
                    onClick={() => deleteAppointment(appointment)}
                >
                    <Trash className="h-4 w-4" />
                    Delete
                </Button>
            </div>
        </div>
    );
}
