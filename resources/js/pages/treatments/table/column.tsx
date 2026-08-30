'use client';
import { createColumnHelper } from '@tanstack/react-table';
import { type DataTableFeatures } from './data-table-features';
import { Treatment } from '@/types/app/types';
import { MoreHorizontal } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from '@inertiajs/react';
import treatments from '@/routes/treatments';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, Treatment>();

export const columns = (handleDelete: (id: number, name: string) => void) =>
    columnHelper.columns([
        columnHelper.display({
            id: 'no',
            header: 'No.',
            cell: ({ row }) => row.index + 1,
        }),
        columnHelper.accessor('name', {
            header: 'Name',
        }),
        columnHelper.accessor('description', {
            header: 'Description',
        }),
        columnHelper.display({
            header: 'Price',
            cell: ({ row }) => {
                return <div>${row.original.price}</div>;
            },
        }),
        columnHelper.display({
            header: 'Duration',
            cell: ({ row }) => {
                return <div>{row.original.duration} min</div>;
            },
        }),
        columnHelper.display({
            header: 'Status',
            id: 'status',
            cell: ({ row }) => {
                return <div>{row.original.status}</div>;
            },
        }),

        columnHelper.display({
            header: 'Action',
            id: 'actions',
            cell: ({ row }) => {
                const treatment = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link href={treatments.edit(treatment.id).url}>
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() =>
                                    handleDelete(treatment.id, treatment.name)
                                }
                                className="text-red-500 focus:text-red-500"
                            >
                                Delete
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={treatments.show(treatment.id).url}>
                                    View Details
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        }),
    ]);
