import patients from '@/routes/patients';
import { Patient } from '@/types/app/types';
import { Head } from '@inertiajs/react';
interface Props {
    patient: Patient;
}
export default function Show({ patient }: Props) {
    return (
        <>
            <Head title={`Dentist - ${patient.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <p>{patient.name}</p>
            </div>
        </>
    );
}
Show.layout = {
    breadcrumbs: [
        {
            title: 'Patient',
            href: patients.index(),
        },
        {
            title: 'Details Patient',
            href: '#',
        },
    ],
};
