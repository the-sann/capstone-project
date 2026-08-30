'use client';
import { createColumnHelper } from '@tanstack/react-table';
import { type DataTableFeatures } from './data-table-features';
import { Patient } from '@/types/app/types';

import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import dentists from '@/routes/dentists';
import { Link } from '@inertiajs/react';
import patients from '@/routes/patients';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, Patient>();

export const columns = columnHelper.columns([
    columnHelper.accessor('patient_id', {
        header: 'ID',
    }),
    columnHelper.accessor('name', {
        header: 'Name',
    }),
    columnHelper.accessor('age', {
        header: 'Age',
    }),
    columnHelper.accessor('address', {
        header: 'Address',
    }),
    columnHelper.accessor('phone', {
        header: 'Phone',
    }),

    columnHelper.display({
        header: 'Action',
        id: 'actions',
        cell: ({ row }) => {
            const patient = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href={patients.edit(patient.id).url}>
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={patients.show(patient.id).url}>
                                View Details
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }),
]);
