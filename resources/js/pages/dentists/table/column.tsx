'use client';
import { createColumnHelper } from '@tanstack/react-table';
import { type DataTableFeatures } from './data-table-features';
import { Dentist } from '@/types/app/dentists/dentist';

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

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, Dentist>();

export const columns = columnHelper.columns([
    columnHelper.accessor('name', {
        header: 'Name',
    }),

    columnHelper.accessor('status', {
        header: 'Status',
    }),
    columnHelper.accessor('skill', {
        header: 'Skill',
    }),
    columnHelper.accessor('year_experienced', {
        header: 'Year Experience',
    }),
    columnHelper.display({
        header: 'Action',
        id: 'actions',
        cell: ({ row }) => {
            const dentist = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Copy payment ID</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>
                            View payment details
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }),
]);
