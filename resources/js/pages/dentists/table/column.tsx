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
import dentists from '@/routes/dentists';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, Dentist>();

export const columns = columnHelper.columns([
    columnHelper.accessor('name', {
        header: 'Name',
    }),
    columnHelper.display({
        header: 'Image',
        cell: ({ row }) => {
            const image = row.original.profile_image;
            return image ? (
                <img
                    src={`/storage/${image}`}
                    alt={row.original.name}
                    className="h-16 w-16 object-cover"
                />
            ) : (
                <span className="text-sm text-muted-foreground">No image</span>
            );
        },
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
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }),
]);
