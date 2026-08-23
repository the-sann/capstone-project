import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Dentist } from '@/types/app/types';
import { Head, useForm } from '@inertiajs/react';
import DentistForm from './dentist-form';
import dentists from '@/routes/dentists';

interface Props {
    dentist: Dentist;
}

export default function Edit({ dentist }: Props) {
    const { data, setData, post, errors, processing } = useForm({
        name: dentist.name || '',
        year_experienced: dentist.year_experienced || '',
        skill: dentist.skill || '',
        status: true,
        image: '',
        is_dentist: true,
        user_type: dentist.user_type || '',
        _method: 'PUT',
    });
    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(dentists.update(dentist.id).url, { forceFormData: true });
    }
    return (
        <>
            <Head title="Create Dentist" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-semibold">Update Dentist</h1>

                <Card className="w-full sm:max-w-md">
                    <CardHeader>
                        <CardTitle>Update</CardTitle>

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
                        dentist={dentist}
                    />
                </Card>
            </div>
        </>
    );
}
Edit.layout = {
    breadcrumbs: [
        {
            title: 'Dentist',
            href: dentists.index(),
        },
        {
            title: 'Edit Dentist',
            href: '#',
        },
    ],
};
