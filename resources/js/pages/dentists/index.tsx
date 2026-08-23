import { Head, Link, router } from '@inertiajs/react';
import dentists from '@/routes/dentists';
import type { Dentist } from '@/types/app/types';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './table/column';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface DentistProps {
    dentists: Dentist[];
}
export default function Index({ dentists }: DentistProps) {
    console.log('dentists', dentists);
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

                <DataTable columns={columns} data={dentists} />
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
