import { Head, useForm } from '@inertiajs/react';

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import appointments from '@/routes/appointments';
import patientsRoute from '@/routes/patients';

import { Appointment, Dentist, Patient } from '@/types/app/types';
import AppointmentForm from './appointment-form';
interface Props {
    appointment: Appointment;
    patients: Patient[];
    dentists: Dentist[];
}

export default function Edit({ appointment, dentists, patients }: Props) {
    const { data, setData, post, errors, processing, clearErrors } = useForm({
        patient_id: String(appointment.patient_id),
        dentist_id: String(appointment.dentist_id),
        appointment_date: appointment.appointment_date
            ? appointment.appointment_date.slice(0, 10)
            : '',
        appointment_time: appointment.appointment_time
            ? appointment.appointment_time.slice(0, 5)
            : '',
        status: appointment.status,
        reason: appointment.reason,
        note: appointment.note ?? '',
        _method: 'PUT',
    });

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        post(appointments.update(appointment.id).url);
    }

    return (
        <>
            <Head title="Edit Appoint" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-semibold">Edit Appoint</h1>

                <Card className="w-full sm:max-w-md">
                    <CardHeader>
                        <CardTitle>Edit Appoint</CardTitle>

                        <CardDescription>
                            Enter the appointment's information below.
                        </CardDescription>
                    </CardHeader>

                    <AppointmentForm
                        appointment={appointment}
                        patients={patients}
                        dentists={dentists}
                        processing={processing}
                        data={data}
                        setData={setData}
                        onSubmit={submit}
                        clearErrors={clearErrors}
                        errors={errors}
                    />
                </Card>
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        {
            title: 'Appointments',
            href: appointments.index(),
        },
        {
            title: 'Edit',
            href: '#',
        },
    ],
};
