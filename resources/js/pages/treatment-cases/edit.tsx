import { Head, useForm } from '@inertiajs/react';

import treatmentCaseRoutes from '@/routes/treatments-case';
import patientsRoutes from '@/routes/patients';

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import TreatmentCaseForm from './treatment-case-form';

import type {
    Patient,
    Dentist,
    Treatment,
    TreatmentCase,
} from '@/types/app/types';

type Props = {
    treatmentCase: TreatmentCase;
    patients: Pick<Patient, 'id' | 'name' | 'patient_id'>[];
    dentists: Pick<Dentist, 'id' | 'name'>[];
    treatmentServices: Pick<Treatment, 'id' | 'name' | 'price'>[];
};

export default function Edit({
    treatmentCase,
    patients,
    dentists,
    treatmentServices,
}: Props) {
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        patient_id: String(treatmentCase.patient_id),
        dentist_id: String(treatmentCase.dentist_id),
        diagnosis: treatmentCase.diagnosis ?? '',
        notes: treatmentCase.notes ?? '',
        status: treatmentCase.status,
        _method: 'PUT',
    });

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        post(`/treatments-case/${treatmentCase.id}`);
    }

    return (
        <>
            <Head title="Edit Treatment Case" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-semibold">Edit Treatment Case</h1>

                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle>Edit Treatment Case</CardTitle>

                        <CardDescription>
                            Update the patient, dentist, diagnosis, notes, and
                            treatment case status.
                        </CardDescription>
                    </CardHeader>

                    <TreatmentCaseForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        clearErrors={clearErrors}
                        onSubmit={submit}
                        processing={processing}
                        patients={patients}
                        dentists={dentists}
                        treatmentCase={treatmentCase}
                    />
                </Card>
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        {
            title: 'Treatment Cases',
            href: treatmentCaseRoutes.index(),
        },
        {
            title: 'Edit Treatment Case',
            href: '#',
        },
    ],
};
