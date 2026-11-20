import { Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import purchases from '@/routes/purchases';

interface Row {
    id: number;
    reference_no: string;
    supplier: string | null;
    purchase_date: string;
    items_count: number;
    total_amount: number;
    status: 'draft' | 'received' | 'cancelled';
}

interface Props {
    purchases: {
        data: Row[];
        links: { url: string | null; label: string; active: boolean }[];
    };
}

const statusVariant = {
    draft: 'secondary',
    received: 'default',
    cancelled: 'destructive',
} as const;

export default function PurchasesIndex({ purchases: list }: Props) {
    return (
        <>
            <Head title="Purchases" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Purchases
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Purchase sheets for ordering materials.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={purchases.create()}>
                            <Plus className="mr-1 size-4" /> New purchase
                        </Link>
                    </Button>
                </div>

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Reference</TableHead>
                                <TableHead>Supplier</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">
                                    Items
                                </TableHead>
                                <TableHead className="text-right">
                                    Total
                                </TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {list.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        No purchases yet.
                                    </TableCell>
                                </TableRow>
                            )}
                            {list.data.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-mono text-xs">
                                        {p.reference_no}
                                    </TableCell>
                                    <TableCell>{p.supplier ?? '-'}</TableCell>
                                    <TableCell>{p.purchase_date}</TableCell>
                                    <TableCell className="text-right">
                                        {p.items_count}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        ${p.total_amount.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={statusVariant[p.status]}
                                            className="capitalize"
                                        >
                                            {p.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            asChild
                                        >
                                            <Link href={purchases.show(p.id)}>
                                                View
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex flex-wrap gap-1">
                    {list.links.map((l, i) => (
                        <Button
                            key={i}
                            size="sm"
                            variant={l.active ? 'default' : 'outline'}
                            disabled={!l.url}
                            onClick={() =>
                                l.url &&
                                router.get(l.url, {}, { preserveState: true })
                            }
                            dangerouslySetInnerHTML={{ __html: l.label }}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}
