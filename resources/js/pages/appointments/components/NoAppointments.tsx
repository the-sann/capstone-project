import { CalendarX } from 'lucide-react';

interface NoAppointmentsProps {
    title?: string;
    description?: string;
}

export default function NoAppointments({
    title = 'No appointments tomorrow',
    description = "You're all caught up. No patients are scheduled for tomorrow.",
}: NoAppointmentsProps) {
    return (
        <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
            <CalendarX className="mb-3 h-10 w-10 text-muted-foreground" />

            <h3 className="font-semibold">{title}</h3>

            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
    );
}
