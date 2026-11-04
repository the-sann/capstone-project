import { Head, Link } from '@inertiajs/react';
import {
    Search,
    Filter,
    Plus,
    Eye,
    Pencil,
    Printer,
    ArrowUpRight,
    Wallet,
    CreditCard,
    Users,
    AlertCircle,
} from 'lucide-react';
import { useState } from 'react';

type LoanStatus = 'Active' | 'Overdue' | 'Paid';

interface Loan {
    id: string;
    patient: string;
    patientId: string;
    invoice: string;
    date: string;
    dueDate: string;
    total: number;
    paid: number;
    balance: number;
    status: LoanStatus;
}

const loans: Loan[] = [
    {
        id: 'LN-0001',
        patient: 'Sok Dara',
        patientId: 'PA-0001',
        invoice: 'INV-0001',
        date: 'Nov 01, 2026',
        dueDate: 'Nov 15, 2026',
        total: 500,
        paid: 200,
        balance: 300,
        status: 'Active',
    },
    {
        id: 'LN-0002',
        patient: 'Chan Sreymom',
        patientId: 'PA-0002',
        invoice: 'INV-0002',
        date: 'Oct 20, 2026',
        dueDate: 'Oct 30, 2026',
        total: 800,
        paid: 300,
        balance: 500,
        status: 'Overdue',
    },
    {
        id: 'LN-0003',
        patient: 'Mao Vicheka',
        patientId: 'PA-0003',
        invoice: 'INV-0003',
        date: 'Oct 15, 2026',
        dueDate: 'Oct 25, 2026',
        total: 250,
        paid: 250,
        balance: 0,
        status: 'Paid',
    },
    {
        id: 'LN-0004',
        patient: 'Kim Sopheak',
        patientId: 'PA-0004',
        invoice: 'INV-0004',
        date: 'Nov 02, 2026',
        dueDate: 'Nov 20, 2026',
        total: 1200,
        paid: 400,
        balance: 800,
        status: 'Active',
    },
];

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);

const statusStyles: Record<LoanStatus, string> = {
    Active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    Overdue: 'bg-red-50 text-red-700 ring-red-600/20',
    Paid: 'bg-gray-100 text-gray-600 ring-gray-500/20',
};

export default function Index() {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('All');

    const filteredLoans = loans.filter((loan) => {
        const matchesSearch =
            loan.patient.toLowerCase().includes(search.toLowerCase()) ||
            loan.id.toLowerCase().includes(search.toLowerCase()) ||
            loan.patientId.toLowerCase().includes(search.toLowerCase()) ||
            loan.invoice.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = status === 'All' || loan.status === status;

        return matchesSearch && matchesStatus;
    });

    const totalOutstanding = loans.reduce((sum, loan) => sum + loan.balance, 0);

    const totalRepaid = loans.reduce((sum, loan) => sum + loan.paid, 0);

    const activeLoans = loans.filter((loan) => loan.status === 'Active').length;

    const overdueLoans = loans.filter(
        (loan) => loan.status === 'Overdue',
    ).length;

    const summaryCards = [
        {
            title: 'Total Outstanding',
            value: formatCurrency(totalOutstanding),
            description: 'Remaining patient balances',
            icon: Wallet,
        },
        {
            title: 'Total Repaid',
            value: formatCurrency(totalRepaid),
            description: 'Payments recorded',
            icon: CreditCard,
        },
        {
            title: 'Active Loans',
            value: activeLoans.toString(),
            description: 'Currently unpaid',
            icon: Users,
        },
        {
            title: 'Overdue Loans',
            value: overdueLoans.toString(),
            description: 'Require follow-up',
            icon: AlertCircle,
        },
    ];

    return (
        <>
            <Head title="Patient Loans" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Page Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Patient Loans
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage outstanding patient balances and repayments.
                        </p>
                    </div>

                    <Link
                        href="/patient-loans/create"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                    >
                        <Plus className="h-4 w-4" />
                        Create Loan
                    </Link>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {summaryCards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div
                                key={card.title}
                                className="rounded-xl border bg-card p-5"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {card.title}
                                    </p>

                                    <div className="rounded-lg bg-muted p-2">
                                        <Icon className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                </div>

                                <p className="mt-3 text-2xl font-semibold tracking-tight">
                                    {card.value}
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    {card.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Loan Records */}
                <div className="rounded-xl border bg-card">
                    <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="font-semibold">Loan Records</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                View and track patient repayment records.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search patient..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="h-10 w-full rounded-lg border bg-background pr-3 pl-9 text-sm outline-none focus:ring-2 focus:ring-ring sm:w-64"
                                />
                            </div>

                            {/* Status Filter */}
                            <div className="relative">
                                <Filter className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="h-10 w-full appearance-none rounded-lg border bg-background pr-8 pl-9 text-sm outline-none focus:ring-2 focus:ring-ring sm:w-36"
                                >
                                    <option value="All">All Status</option>
                                    <option value="Active">Active</option>
                                    <option value="Overdue">Overdue</option>
                                    <option value="Paid">Paid</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 text-left text-muted-foreground">
                                <tr>
                                    <th className="px-5 py-3 font-medium">
                                        Loan / Patient
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Invoice
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Total
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Paid
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Balance
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Due Date
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Status
                                    </th>
                                    <th className="px-5 py-3 text-right font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {filteredLoans.map((loan) => (
                                    <tr
                                        key={loan.id}
                                        className="transition hover:bg-muted/30"
                                    >
                                        <td className="px-5 py-4">
                                            <p className="font-medium">
                                                {loan.patient}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {loan.id} · {loan.patientId}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4 text-muted-foreground">
                                            {loan.invoice}
                                        </td>

                                        <td className="px-5 py-4 font-medium">
                                            {formatCurrency(loan.total)}
                                        </td>

                                        <td className="px-5 py-4 text-muted-foreground">
                                            {formatCurrency(loan.paid)}
                                        </td>

                                        <td className="px-5 py-4 font-semibold">
                                            {formatCurrency(loan.balance)}
                                        </td>

                                        <td className="px-5 py-4 text-muted-foreground">
                                            {loan.dueDate}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyles[loan.status]}`}
                                            >
                                                {loan.status}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/patient-loans/${loan.id}`}
                                                    title="View"
                                                    className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>

                                                <Link
                                                    href={`/patient-loans/${loan.id}/edit`}
                                                    title="Edit"
                                                    className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>

                                                <button
                                                    type="button"
                                                    title="Print"
                                                    onClick={() =>
                                                        window.print()
                                                    }
                                                    className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                >
                                                    <Printer className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filteredLoans.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="px-5 py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Search className="h-8 w-8 text-muted-foreground" />
                                                <p className="font-medium">
                                                    No loans found
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Try changing your search or
                                                    filter.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col gap-2 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {filteredLoans.length} of {loans.length}{' '}
                            records
                        </p>

                        <p className="text-xs text-muted-foreground">
                            Patient loan management
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
