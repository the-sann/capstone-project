import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Head, Link, router } from '@inertiajs/react';
import {
    Check,
    Copy,
    Ellipsis,
    Eye,
    Pencil,
    Plus,
    Trash2,
    List,
    Download,
} from 'lucide-react';
import { useState } from 'react';
import patientRoutes from '@/routes/patients';
import { PaginationIconsOnly } from '@/components/ui/pagination';
import { Patient } from '@/types/app/types';

interface PaginatedPatients {
    data: Patient[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    patients: PaginatedPatients;
}

import { ButtonGroup } from '@/components/ui/button-group';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export default function Index({ patients }: Props) {
    const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

    const copyPhone = async (phone: string) => {
        await navigator.clipboard.writeText(phone);

        setCopiedPhone(phone);

        setTimeout(() => {
            setCopiedPhone(null);
        }, 1500);
    };

    const deletePatient = (patient: Patient) => {
        if (confirm(`Are you sure you want to delete ${patient.name}?`)) {
            router.delete(`/patients/${patient.id}`);
        }
    };

    return (
        <>
            <Head title="Patient" />

            <div className="flex h-full min-w-0 flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                    <Link href="/patients/create">
                        <Button variant="outline">
                            <Plus />
                            Create Patient
                        </Button>
                    </Link>

                    <Link href="/services-treatments">
                        <Button variant="outline" className="gap-2">
                            <List />
                            Create Invoice
                        </Button>
                    </Link>

                    <div>
                        <Button variant="outline" className="gap-2">
                            <Download />
                            Export Patients
                        </Button>
                    </div>
                </div>
                <div className="w-full max-w-sm">
                    <Field>
                        <FieldLabel htmlFor="input-button-group">
                            Search
                        </FieldLabel>
                        <ButtonGroup>
                            <Input
                                id="input-button-group"
                                placeholder="Type to search..."
                            />
                            <Button variant="outline">Search</Button>
                        </ButtonGroup>
                    </Field>
                </div>
                {/* Patient Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {patients.data.map((patient) => (
                        <div
                            key={patient.id}
                            className="group rounded-xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <Link
                                href={`/patients/${patient.id}`}
                                className="block"
                            >
                                {/* Header */}
                                <div className="mb-4 flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h3 className="truncate text-lg font-semibold">
                                            {patient.name}
                                        </h3>

                                        <p className="text-sm text-muted-foreground">
                                            ID: {patient.patient_id}
                                        </p>
                                    </div>

                                    {/* Patient Actions */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 shrink-0"
                                            >
                                                <Ellipsis className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Patient actions
                                                </span>
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent
                                            align="end"
                                            className="w-40"
                                        >
                                            {/* View */}
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={`/patients/${patient.id}`}
                                                    className="flex cursor-pointer items-center"
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View
                                                </Link>
                                            </DropdownMenuItem>

                                            {/* Edit */}
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={`/patients/${patient.id}/edit`}
                                                    className="flex cursor-pointer items-center"
                                                >
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </Link>
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />

                                            {/* Delete */}
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    deletePatient(patient)
                                                }
                                                className="cursor-pointer text-destructive focus:text-destructive"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Patient Information */}
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Age
                                        </span>

                                        <span className="font-medium">
                                            {patient.age}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Gender
                                        </span>

                                        <span className="font-medium">
                                            {patient.gender}
                                        </span>
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <p className="mb-1 text-muted-foreground">
                                            Phone
                                        </p>

                                        <div className="flex items-center justify-between gap-2 rounded-md border px-3 py-2">
                                            <span className="font-medium">
                                                {patient.phone}
                                            </span>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 shrink-0"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    copyPhone(patient.phone);
                                                }}
                                            >
                                                {copiedPhone ===
                                                patient.phone ? (
                                                    <Check className="h-4 w-4" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Address */}
                                    {patient.address && (
                                        <div>
                                            <p className="text-muted-foreground">
                                                Address
                                            </p>

                                            <p className="mt-1 line-clamp-2">
                                                {patient.address}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {patients.data.length === 0 && (
                    <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed">
                        <p className="text-muted-foreground">
                            No patients found.
                        </p>
                    </div>
                )}

                {/* Pagination */}
                <PaginationIconsOnly
                    currentPage={patients.current_page}
                    lastPage={patients.last_page}
                    route={patientRoutes.index().url}
                    perPage={patients.per_page}
                />
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Patients',
            href: patientRoutes.index(),
        },
    ],
};
