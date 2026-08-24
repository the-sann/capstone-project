import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import patients from '@/routes/patients';
import { Patient } from '@/types/app/types';
import { Head, useForm } from '@inertiajs/react';
import PatientForm from './patient-form';

interface Props {
    patient: Patient;
}

export default function Edit({ patient }: Props) {
    const { data, setData, post, errors, processing, clearErrors } = useForm({
        name: patient.name || '',
        patient_id: patient.patient_id || '',
        age: patient.age || '',
        phone: patient.phone || '',
        address: patient.address || '',
        gender: patient.gender || '',
        _method: 'PUT',
    });
    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(patients.update(patient.id).url, { forceFormData: true });
    }
    return (
        <>
            <Head title="Update Patient" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-semibold">Update Patient</h1>

                <Card className="w-full sm:max-w-md">
                    <CardHeader>
                        <CardTitle>Update</CardTitle>

                        <CardDescription>
                            Enter the patient's information below.
                        </CardDescription>
                    </CardHeader>

                    <PatientForm
                        processing={processing}
                        data={data}
                        setData={setData}
                        onSubmit={submit}
                        errors={errors}
                        clearErrors={clearErrors}
                        patient={patient}
                    />
                </Card>
            </div>
        </>
    );
}
Edit.layout = {
    breadcrumbs: [
        {
            title: 'Patient',
            href: patients.index(),
        },
        {
            title: 'Edit Patient',
            href: '#',
        },
    ],
};
