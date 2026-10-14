'use client';
import { createColumnHelper } from '@tanstack/react-table';
import { type DataTableFeatures } from './data-table-features';
import { Appointment } from '@/types/app/types';

import { MoreHorizontal } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from '@inertiajs/react';
import appointments from '@/routes/appointments';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, Appointment>();

export const columns = columnHelper.columns([
    columnHelper.accessor('appointment_id', {
        header: 'ID',
    }),
    columnHelper.accessor('patient_id', {
        header: 'patient_id',
    }),
    columnHelper.accessor('appointment_date', {
        header: 'appointment_date',
    }),
    columnHelper.accessor('appointment_time', {
        header: 'appointment_time',
    }),
    columnHelper.accessor('reason', {
        header: 'reason',
    }),

    columnHelper.display({
        header: 'Action',
        id: 'actions',
        cell: ({ row }) => {
            const appointment = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href={appointments.edit(appointment.id).url}>
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={appointments.show(appointment.id).url}>
                                View Details
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }),
]);
