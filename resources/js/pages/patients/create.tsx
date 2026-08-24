import { Head, useForm } from '@inertiajs/react';

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import patients from '@/routes/patients';
import PatientForm from './patient-form';

export default function Create() {
    const { data, setData, post, errors, processing, clearErrors } = useForm({
        name: '',
        patient_id: '',
        age: '',
        phone: '',
        address: '',
        gender: '',
    });

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        post(patients.store().url, {
            forceFormData: true,
        });
    }

    return (
        <>
            <Head title="Create Patient" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-semibold">Create Patient</h1>

                <Card className="w-full sm:max-w-md">
                    <CardHeader>
                        <CardTitle>Create Patient</CardTitle>

                        <CardDescription>
                            Enter the patient's information below.
                        </CardDescription>
                    </CardHeader>

                    <PatientForm
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
            title: 'Dentist',
            href: patients.create(),
        },
    ],
};
