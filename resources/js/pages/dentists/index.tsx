import { Head, Link, router } from '@inertiajs/react';
import dentists from '@/routes/dentists';
import type { Dentist } from '@/types/app/types';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { columns } from './table/column';

interface PaginatedDentists {
    data: Dentist[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface DentistProps {
    dentists: PaginatedDentists;
}

export default function Index({ dentists: dentistData }: DentistProps) {
    const handleDelete = (id: number, name: string) => {
        if (!confirm(`Are you sure you want to delete dentist ${name}?`)) {
            return;
        }

        router.delete(dentists.destroy(id).url);
    };

    return (
        <>
            <Head title="Dentist" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Link href="/dentists/create">
                    <Button>
                        <Plus />
                        Create
                    </Button>
                </Link>

                <DataTable
                    columns={columns(handleDelete)}
                    data={dentistData.data}
                    pagination={dentistData}
                />
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Dentist',
            href: dentists.index(),
        },
    ],
};
