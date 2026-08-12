import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';
import dentists from '@/routes/dentists';

export default function Dentist() {
    return (
        <>
            <Head title="Dentist" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1>Dentist</h1>
            </div>
        </>
    );
}
