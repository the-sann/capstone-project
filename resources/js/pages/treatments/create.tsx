import { Head, useForm } from '@inertiajs/react';
import treatmentRoutes from '@/routes/treatments';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import treatments from '@/routes/treatments';
import TreatmentForm from './treatment-form';

export default function Create() {
    const { data, setData, post, errors, processing, clearErrors } = useForm({
        name: '',
        description: '',
        price: '',
        status: 'available',
        duration: '',
    });

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        post(treatments.store().url, {
            forceFormData: true,
        });
    }

    return (
        <>
            <Head title="Create Service" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-semibold">Create Service</h1>

                <Card className="w-full sm:max-w-md">
                    <CardHeader>
                        <CardTitle>Create service</CardTitle>

                        <CardDescription>
                            Enter the service's information below.
                        </CardDescription>
                    </CardHeader>

                    <TreatmentForm
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
            title: 'Treatment',
            href: treatmentRoutes.index(),
        },
        {
            title: 'Create',
            href: treatments.create(),
        },
    ],
};
