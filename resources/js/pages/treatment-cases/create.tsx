import { Head, useForm } from '@inertiajs/react';

import treatmentCaseRoutes from '@/routes/treatments-case';

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';

import TreatmentCaseForm from './treatment-case-form';

import type { Patient, Dentist, Treatment } from '@/types/app/types';
import patients from '@/routes/patients';

type Props = {
    patients: Pick<Patient, 'id' | 'name' | 'patient_id'>[];
    dentists: Pick<Dentist, 'id' | 'name'>[];
    treatmentServices: Pick<Treatment, 'id' | 'name' | 'price'>[];
};

type Item = {
    treatment_service_id: number | '';
    tooth_number: string;
    quantity: number;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    notes: string;
};

export default function Create({
    patients,
    dentists,
    treatmentServices,
}: Props) {
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        patient_id: '',
        dentist_id: '',
        diagnosis: '',
        notes: '',
        status: 'ongoing',
        items: [] as Item[],
    });

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        post(treatmentCaseRoutes.store().url);
    }

    // We'll use these on the next page when adding treatment items
    const addItem = () => {
        setData('items', [
            ...data.items,
            {
                treatment_service_id: '',
                tooth_number: '',
                quantity: 1,
                status: 'pending',
                notes: '',
            },
        ]);
    };

    const removeItem = (index: number) => {
        setData(
            'items',
            data.items.filter((_, i) => i !== index),
        );
    };

    return (
        <>
            <Head title="Create Treatment Case" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-semibold">
                    Create Treatment Case
                </h1>

                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle>New Treatment Case</CardTitle>

                        <CardDescription>
                            Create a treatment case for a patient. Treatment
                            services will be added after the case is created.
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
                    />
                </Card>

                {/* Next step (after creating the case)
                    We'll replace this with an invoice-style treatment item table.
                */}
                {false && (
                    <Button type="button" onClick={addItem}>
                        Add Treatment
                    </Button>
                )}
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        {
            title: 'Patients',
            href: patients.index(),
        },
        {
            title: 'Create',
            href: treatmentCaseRoutes.create(),
        },
    ],
};
