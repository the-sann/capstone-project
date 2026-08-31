import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Head, Link } from '@inertiajs/react';
import { List, Plus } from 'lucide-react';
import { columns } from './table/column';
import { Patient } from '@/types/app/types';
import patientRoutes from '@/routes/patients';
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

            <div className="flex h-full min-w-0 flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap gap-3">
                    <Link href="/patients/create" className="self-start">
                        <Button variant="outline">
                            <Plus />
                            Create Patient
                        </Button>
                    </Link>
                    <Link href="/services-treatments">
                        <Button variant="outline" className="gap-2">
                            <List />
                            Create Invoice
                        </Button>
                    </Link>
                    <Link href="/appointments/create">
                        <Button variant="outline" className="gap-2">
                            <List />
                            Create Appointment
                        </Button>
                    </Link>
                </div>
                <DataTable
                    columns={columns}
                    data={patients.data}
                    pagination={patients}
                />
                <PaginationIconsOnly
                    currentPage={patients.current_page}
                    lastPage={patients.last_page}
                    route={patientRoutes.index().url}
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
            href: patientRoutes.index(),
        },
    ],
};
