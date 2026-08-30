import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import treatmentRoutes from '@/routes/treatments';
import { Treatment } from '@/types/app/types';
import { Head, Link, router } from '@inertiajs/react';
import { List, Plus } from 'lucide-react';
import { columns } from './table/column';
import { PaginationIconsOnly } from '@/components/ui/pagination';
interface PaginatedTreatments {
    data: Treatment[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}
interface Props {
    treatments: PaginatedTreatments;
}

export default function Index({ treatments }: Props) {
    const handleDelete = (id: number, name: string) => {
        if (!confirm(`Are you sure you want to delete treatment ${name}?`)) {
            return;
        }

        router.delete(treatmentRoutes.destroy(id).url);
    };
    return (
        <>
            <Head title="Treatment Services" />

            <div className="flex h-full min-w-0 flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                    <Link href="/treatments/create">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Create Treatment
                        </Button>
                    </Link>

                    <Link href="/services-treatments">
                        <Button variant="outline" className="gap-2">
                            <List />
                            Show Services
                        </Button>
                    </Link>
                </div>
                <div>
                    <p>search area</p>
                </div>

                {/* Content */}
                <DataTable
                    columns={columns(handleDelete)}
                    data={treatments.data}
                />
                <PaginationIconsOnly
                    perPage={treatments.per_page}
                    currentPage={treatments.current_page}
                    lastPage={treatments.last_page}
                    route={treatmentRoutes.index().url}
                />
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Treatment',
            href: treatmentRoutes.index(),
        },
    ],
};
