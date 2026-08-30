import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import patients from '@/routes/patients';
import { Patient, Treatment } from '@/types/app/types';
import { Head, useForm } from '@inertiajs/react';
import treatments from '@/routes/treatments';
import TreatmentForm from './treatment-form';

interface Props {
    treatment: Treatment;
}

export default function Edit({ treatment }: Props) {
    const { data, setData, post, errors, processing, clearErrors } = useForm({
        name: treatment.name || '',
        description: treatment.description || '',
        price: treatment.price || '',
        duration: treatment.duration || '',
        status: treatment.status || '',
        _method: 'PUT',
    });
    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(treatments.update(treatment.id).url, { forceFormData: true });
    }
    return (
        <>
            <Head title="Update Tretment" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-semibold">Update Tretment</h1>

                <Card className="w-full sm:max-w-md">
                    <CardHeader>
                        <CardTitle>Update</CardTitle>

                        <CardDescription>
                            Enter the Tretment's information below.
                        </CardDescription>
                    </CardHeader>

                    <TreatmentForm
                        processing={processing}
                        data={data}
                        setData={setData}
                        onSubmit={submit}
                        errors={errors}
                        clearErrors={clearErrors}
                        treatment={treatment}
                    />
                </Card>
            </div>
        </>
    );
}
Edit.layout = {
    breadcrumbs: [
        {
            title: 'Treatment',
            href: treatments.index(),
        },
        {
            title: 'Edit',
            href: '#',
        },
    ],
};
