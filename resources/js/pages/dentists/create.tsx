import { Head, useForm } from '@inertiajs/react';
import dentists from '@/routes/dentists';

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import DentistForm from './dentist-form';

export default function Create() {
    const { data, setData, post, errors, processing } = useForm({
        name: '',
        year_experienced: '',
        skill: '',
        status: true,
        image: '',
        is_dentist: true,
        user_type: '',
    });

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        post(dentists.store().url, {
            forceFormData: true,
        });
    }

    return (
        <>
            <Head title="Create Dentist" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-semibold">Create Dentist</h1>

                <Card className="w-full sm:max-w-md">
                    <CardHeader>
                        <CardTitle>Create Dentist</CardTitle>

                        <CardDescription>
                            Enter the dentist's information below.
                        </CardDescription>
                    </CardHeader>

                    <DentistForm
                        processing={processing}
                        data={data}
                        setData={setData}
                        onSubmit={submit}
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
            href: dentists.create(),
        },
    ],
};
