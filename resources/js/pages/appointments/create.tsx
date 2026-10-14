import { Head, useForm } from '@inertiajs/react';

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import appointments from '@/routes/appointments';

import { Dentist, Patient, TreatmentCase } from '@/types/app/types';

import AppointmentForm from './appointment-form';

interface Props {
    patients: Patient[];
    dentists: Dentist[];
    treatmentCases?: TreatmentCase[];

    // When creating from a treatment case
    treatmentCase?: TreatmentCase | null;

    selectedTreatmentCase?: TreatmentCase | null;
}

export default function Create({
    patients,
    dentists,
    treatmentCases = [],
    treatmentCase = null,
    selectedTreatmentCase = null,
}: Props) {
    const selectedCase = treatmentCase ?? selectedTreatmentCase ?? null;
    const availableTreatmentCases = selectedCase
        ? [
              selectedCase,
              ...treatmentCases.filter((item) => item.id !== selectedCase.id),
          ]
        : treatmentCases;
    const { data, setData, post, errors, processing, clearErrors } = useForm({
        patient_id: selectedCase ? String(selectedCase.patient.id) : '',
        dentist_id: selectedCase ? String(selectedCase.dentist.id) : '',
        treatment_case_id: selectedCase ? selectedCase.id : null,
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
            <Head title="Create Appointment" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-semibold">Create Appointment</h1>

                <Card className="w-full sm:max-w-md">
                    <CardHeader>
                        <CardTitle>Create Appointment</CardTitle>

                        <CardDescription>
                            Enter the appointment's information below.
                        </CardDescription>
                    </CardHeader>

                    <AppointmentForm
                        patients={patients}
                        dentists={dentists}
                        treatmentCases={availableTreatmentCases}
                        selectedTreatmentCase={selectedCase}
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
            title: 'Appointment',
            href: appointments.index(),
        },
        {
            title: 'Create',
            href: appointments.create(),
        },
    ],
};
