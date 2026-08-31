import { Head, useForm } from '@inertiajs/react';

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import appointments from '@/routes/appointments';
import patientsRoute from '@/routes/patients';

import { Dentist, Patient } from '@/types/app/types';
import AppointmentForm from './appointment-form';

interface Props {
    patients: Patient[];
    dentists: Dentist[];
}

export default function Create({ patients, dentists }: Props) {
    const { data, setData, post, errors, processing, clearErrors } = useForm({
        patient_id: '',
        dentist_id: '',
        appointment_date: '',
        appointment_time: '',
        status: 'open',
        reason: '',
        note: '',
    });

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        post(appointments.store().url);
    }

    return (
        <>
            <Head title="Create Appoint" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-semibold">Create Appoint</h1>

                <Card className="w-full sm:max-w-md">
                    <CardHeader>
                        <CardTitle>Create Appoint</CardTitle>

                        <CardDescription>
                            Enter the appointment's information below.
                        </CardDescription>
                    </CardHeader>

                    <AppointmentForm
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

Create.layout = {
    breadcrumbs: [
        {
            title: 'Patients',
            href: patientsRoute.index(),
        },
        {
            title: 'create',
            href: appointments.create(),
        },
    ],
};
