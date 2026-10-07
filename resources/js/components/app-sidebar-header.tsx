import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Languages } from 'lucide-react';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { useEffect, useRef, useState } from 'react';
import appointmentRoutes from '@/routes/appointments';
import AppearanceToggle from './appearance-tabs';
import { Link, router, usePage } from '@inertiajs/react';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const [reminders, setReminders] = useState<any[]>([]);
    const handledReminders = useRef<Set<number>>(new Set());
    useEffect(() => {
        if ('Notification' in window) {
            Notification.requestPermission();
        }

        const checkReminders = async () => {
            try {
                const response = await fetch(appointmentRoutes.due().url);

                if (!response.ok) {
                    throw new Error('Failed to fetch reminders');
                }

                const data = await response.json();

                setReminders(data);
                for (const reminder of data) {
                    if (handledReminders.current.has(reminder.id)) {
                        continue;
                    }

                    handledReminders.current.add(reminder.id);

                    const patientName = reminder.appointment.patient.name;

                    const appointmentTime =
                        reminder.appointment.appointment_time;

                    const [hourString, minuteString] =
                        appointmentTime.split(':');

                    let hour = Number(hourString);
                    const minute = minuteString;

                    const period = hour >= 12 ? 'PM' : 'AM';

                    if (hour === 0) {
                        hour = 12;
                    } else if (hour > 12) {
                        hour -= 12;
                    }

                    const formattedTime = `${hour}:${minute} ${period}`;

                    const message = `Reminder. ${patientName} has an appointment with Doctor ${reminder.appointment.dentist.name} at ${formattedTime}.`;
                    console.log('Voice message:', message);
                    const speech = new SpeechSynthesisUtterance(message);
                    speech.rate = 0.9;
                    speech.pitch = 1;
                    window.speechSynthesis.speak(speech);

                    // 🔔 Browser notification
                    if (Notification.permission === 'granted') {
                        new Notification('Appointment Reminder', {
                            body: `${patientName} has an appointment at ${appointmentTime}.`,
                        });
                    }

                    // Mark as reminded in Laravel
                    await fetch(appointmentRoutes.remind(reminder.id).url, {
                        method: 'PATCH',
                        headers: {
                            'X-CSRF-TOKEN':
                                document
                                    .querySelector('meta[name="csrf-token"]')
                                    ?.getAttribute('content') ?? '',
                            'Content-Type': 'application/json',
                        },
                    });
                }
            } catch (error) {
                console.error('Reminder check failed:', error);
            }
        };

        checkReminders();

        const interval = setInterval(checkReminders, 30000);

        return () => clearInterval(interval);
    }, []);
    const testVoice = () => {
        const speech = new SpeechSynthesisUtterance(
            'FUCK You. Farrah Ray has an appointment at 3:25 PM.',
        );

        speech.rate = 0.9;
        speech.pitch = 1;

        window.speechSynthesis.speak(speech);
    };
    const switchLanguage = (lang: 'en' | 'km') => {
        router.post(`/language/${lang}`);
    };
    const { locale } = usePage().props;
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            {/* Right side */}
            {/* Right side */}
            <div className="ml-auto flex items-center gap-1">
                {/* Language */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        switchLanguage(locale === 'en' ? 'km' : 'en')
                    }
                    className="h-9 px-2 text-sm font-medium"
                >
                    {locale === 'en' ? 'ខ្មែរ' : 'EN'}
                </Button>
                {/* Appearance */}
                <AppearanceToggle />

                {/* Notifications */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative h-9 w-9 rounded-full"
                        >
                            <Bell className="h-5 w-5" />

                            {reminders.length > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-semibold text-white">
                                    {reminders.length}
                                </span>
                            )}
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-80">
                        <div className="p-3">
                            <p className="font-medium">Appointment Reminders</p>

                            {reminders.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No pending reminders.
                                </p>
                            ) : (
                                reminders.map((reminder) => (
                                    <div
                                        key={reminder.id}
                                        className="mt-2 rounded-md border p-2"
                                    >
                                        <p className="font-medium">
                                            {reminder.appointment.patient.name}
                                        </p>

                                        <p className="text-sm text-muted-foreground">
                                            Appointment at{' '}
                                            {
                                                reminder.appointment
                                                    .appointment_time
                                            }
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
