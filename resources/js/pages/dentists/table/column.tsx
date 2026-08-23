'use client';
import { createColumnHelper } from '@tanstack/react-table';
import { type DataTableFeatures } from './data-table-features';
import { Dentist } from '@/types/app/types';

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

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, Dentist>();

export const columns = (handleDelete: (id: number, name: string) => void) =>
    columnHelper.columns([
        columnHelper.accessor('name', {
            header: 'Name',
        }),
        columnHelper.display({
            header: 'Image',
            cell: ({ row }) => {
                const image = row.original.image_path;
                return image ? (
                    <img
                        src={`/storage/${image}`}
                        alt={row.original.name}
                        className="h-16 w-16 object-cover"
                    />
                ) : (
                    <span className="text-sm text-muted-foreground">
                        No image
                    </span>
                );
            },
        }),
        columnHelper.display({
            header: 'Status',
            cell: ({ row }) => (
                <div>{row.original.status ? 'Active' : 'Inactive'}</div>
            ),
        }),
        columnHelper.accessor('skill', {
            header: 'Skill',
        }),
        columnHelper.accessor('year_experienced', {
            header: 'Year Experience',
        }),
        columnHelper.display({
            header: 'User-Type',
            cell: ({ row }) => <div>{row.original.user_type}</div>,
        }),
        columnHelper.accessor('is_dentist', {
            header: 'Is Dentist',
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
                            <DropdownMenuItem asChild>
                                <Link href={dentists.edit(dentist.id).url}>
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() =>
                                    handleDelete(dentist.id, dentist.name)
                                }
                                className="text-red-500 focus:text-red-500"
                            >
                                Delete
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={dentists.show(dentist.id).url}>
                                    View Details
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        }),
    ]);
