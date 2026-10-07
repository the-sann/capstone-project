import { Head, Link } from '@inertiajs/react';
import { Eye, Plus, Stethoscope, UserRound } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import treatmentCaseRoutes from '@/routes/treatments-case';

type Patient = {
    id: number;
    name: string;
};

type Dentist = {
    id: number;
    name: string;
};

type TreatmentCase = {
    id: number;
    case_id: string;
    patient: Patient;
    dentist: Dentist;
    diagnosis: string | null;
    status: 'ongoing' | 'completed' | 'cancelled';
    total_amount: number | string;
    paid_amount: number | string;
    balance_amount: number | string;
    created_at: string;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedCases = {
    data: TreatmentCase[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
};

type Props = {
    cases: PaginatedCases;
};

function formatCurrency(value: number | string) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(Number(value));
}

function formatDate(date: string) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(new Date(date));
}

function getStatusVariant(status: TreatmentCase['status']) {
    switch (status) {
        case 'completed':
            return 'default';

        case 'cancelled':
            return 'destructive';

        default:
            return 'secondary';
    }
}

function formatStatus(status: string) {
    return status
        .replace('_', ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function TreatmentCaseIndex({ cases }: Props) {
    return (
        <>
            <Head title="Treatment Cases" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Treatment Cases
                        </h1>

                        <p className="text-sm text-muted-foreground">
                            Manage patient treatment cases and treatment plans.
                        </p>
                    </div>

                    <Button asChild>
                        <Link href={treatmentCaseRoutes.create()}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Treatment Case
                        </Link>
                    </Button>
                </div>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Treatment Cases</CardTitle>

                        <CardDescription>
                            {cases.total} treatment case
                            {cases.total !== 1 ? 's' : ''} found.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {cases.data.length === 0 ? (
                            <div className="py-12 text-center">
                                <p className="text-sm text-muted-foreground">
                                    No treatment cases found.
                                </p>

                                <Button asChild className="mt-4">
                                    <Link href={treatmentCaseRoutes.create()}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Treatment Case
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left">
                                            <th className="px-4 py-3 font-medium">
                                                Case ID
                                            </th>

                                            <th className="px-4 py-3 font-medium">
                                                Patient
                                            </th>

                                            <th className="px-4 py-3 font-medium">
                                                Dentist
                                            </th>

                                            <th className="px-4 py-3 font-medium">
                                                Diagnosis
                                            </th>

                                            <th className="px-4 py-3 text-right font-medium">
                                                Total
                                            </th>

                                            <th className="px-4 py-3 text-right font-medium">
                                                Balance
                                            </th>

                                            <th className="px-4 py-3 text-center font-medium">
                                                Status
                                            </th>

                                            <th className="px-4 py-3 font-medium">
                                                Date
                                            </th>

                                            <th className="px-4 py-3 text-right font-medium">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {cases.data.map((treatmentCase) => (
                                            <tr
                                                key={treatmentCase.id}
                                                className="border-b last:border-0"
                                            >
                                                {/* Case ID */}
                                                <td className="px-4 py-4">
                                                    <span className="font-medium">
                                                        {treatmentCase.case_id}
                                                    </span>
                                                </td>

                                                {/* Patient */}
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <UserRound className="h-4 w-4 text-muted-foreground" />

                                                        <span>
                                                            {
                                                                treatmentCase
                                                                    .patient
                                                                    .name
                                                            }
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Dentist */}
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Stethoscope className="h-4 w-4 text-muted-foreground" />

                                                        <span>
                                                            Dr.{' '}
                                                            {
                                                                treatmentCase
                                                                    .dentist
                                                                    .name
                                                            }
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Diagnosis */}
                                                <td className="max-w-[220px] px-4 py-4">
                                                    <span
                                                        className="block truncate"
                                                        title={
                                                            treatmentCase.diagnosis ??
                                                            undefined
                                                        }
                                                    >
                                                        {treatmentCase.diagnosis ||
                                                            '-'}
                                                    </span>
                                                </td>

                                                {/* Total */}
                                                <td className="px-4 py-4 text-right">
                                                    {formatCurrency(
                                                        treatmentCase.total_amount,
                                                    )}
                                                </td>

                                                {/* Balance */}
                                                <td className="px-4 py-4 text-right font-medium">
                                                    {formatCurrency(
                                                        treatmentCase.balance_amount,
                                                    )}
                                                </td>

                                                {/* Status */}
                                                <td className="px-4 py-4 text-center">
                                                    <Badge
                                                        variant={getStatusVariant(
                                                            treatmentCase.status,
                                                        )}
                                                    >
                                                        {formatStatus(
                                                            treatmentCase.status,
                                                        )}
                                                    </Badge>
                                                </td>

                                                {/* Date */}
                                                <td className="px-4 py-4 whitespace-nowrap text-muted-foreground">
                                                    {formatDate(
                                                        treatmentCase.created_at,
                                                    )}
                                                </td>

                                                {/* Actions */}
                                                <td className="px-4 py-4 text-right">
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        <Link
                                                            href={treatmentCaseRoutes.show(
                                                                treatmentCase.id,
                                                            )}
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View
                                                        </Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination */}
                        {cases.last_page > 1 && (
                            <div className="mt-6 flex items-center justify-between border-t pt-4">
                                <p className="text-sm text-muted-foreground">
                                    Page {cases.current_page} of{' '}
                                    {cases.last_page}
                                </p>

                                <div className="flex gap-1">
                                    {cases.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            asChild={!!link.url}
                                            variant={
                                                link.active
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="sm"
                                            disabled={!link.url}
                                        >
                                            {link.url ? (
                                                <Link
                                                    href={link.url}
                                                    preserveScroll
                                                >
                                                    <span
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                    />
                                                </Link>
                                            ) : (
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            )}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
