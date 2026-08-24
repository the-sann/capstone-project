import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { columns } from './table/column';
import { Patient } from '@/types/app/types';
import patientsRoute from '@/routes/patients';
import { PaginationIconsOnly } from '@/components/ui/pagination';

interface PaginatedPatients {
    data: Patient[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}
interface PatientProps {
    patients: PaginatedPatients;
}
export default function Index({ patients }: PatientProps) {
    return (
        <>
            <Head title="Patient" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Link href="/patients/create">
                    <Button>
                        <Plus />
                        Create
                    </Button>
                </Link>

                <DataTable
                    columns={columns}
                    data={patients.data}
                    pagination={patients}
                />
                <PaginationIconsOnly
                    currentPage={patients.current_page}
                    lastPage={patients.last_page}
                    route={patientsRoute.index().url}
                    perPage={patients.per_page}
                />
            </div>
        </>
    );
}
Index.layout = {
    breadcrumbs: [
        {
            title: 'Patients',
            href: patientsRoute.index(),
        },
    ],
};
