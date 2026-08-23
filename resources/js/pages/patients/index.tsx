import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { columns } from './table/column';
import { Patient } from '@/types/app/types';

interface PatientProps {
    patients: Patient[];
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

                <DataTable columns={columns} data={patients} />
            </div>
        </>
    );
}
