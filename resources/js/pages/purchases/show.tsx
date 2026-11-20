import { Head, Link, router, usePage } from '@inertiajs/react';
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
import { useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Pencil, Printer } from 'lucide-react';

interface Item {
    id: number;
    sku: string;
    name: string;
    unit: string;
    batch_no: string | null;
    expiry_date: string | null;
    quantity: number;
    unit_cost: number;
    subtotal: number;
    track_expiry: boolean;
}
interface Props {
    purchase: {
        id: number;
        reference_no: string;
        supplier: string | null;
        purchase_date: string;
        status: 'draft' | 'received' | 'cancelled';
        total_amount: number;
        note: string | null;
        created_by: string | null;
        items: Item[];
    };
}

export default function PurchaseShow({ purchase: p }: Props) {
    const { errors } = usePage().props as { errors: Record<string, string> };

    // inside PurchaseShow
    const form = useForm({
        items: p.items.map((i) => ({
            id: i.id,
            batch_no: i.batch_no ?? '',
            expiry_date: i.expiry_date ?? '',
        })),
    });
    const formErrors = form.errors as Record<string, string>;

    const update = (
        idx: number,
        patch: Partial<(typeof form.data.items)[number]>,
    ) =>
        form.setData(
            'items',
            form.data.items.map((l, n) => (n === idx ? { ...l, ...patch } : l)),
        );

    const receive = () => {
        if (
            confirm(
                'Receive this purchase? Stock will be added and the purchase locked.',
            )
        ) {
            form.post(purchases.receive(p.id).url, { preserveScroll: true });
        }
    };
    const cancel = () => {
        if (confirm('Cancel this purchase?')) {
            router.post(
                purchases.cancel(p.id).url,
                {},
                { preserveScroll: true },
            );
        }
    };

    return (
        <>
            <Head title={p.reference_no} />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {p.reference_no}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {p.supplier ?? 'No supplier'} | {p.purchase_date} |
                            by {p.created_by ?? '-'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge className="capitalize">{p.status}</Badge>
                        {p.status === 'draft' && (
                            <>
                                <Button variant="outline" onClick={cancel}>
                                    Cancel purchase
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={purchases.edit(p.id)}>
                                        <Pencil className="mr-1 size-4" /> Edit
                                    </Link>
                                </Button>
                                <Button onClick={receive}>Receive stock</Button>
                            </>
                        )}
                        <Button variant="outline" asChild>
                            <Link href={purchases.index()}>Back</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <a
                                href={purchases.print(p.id).url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Printer className="mr-1 size-4" /> Print
                            </a>
                        </Button>
                    </div>
                </div>

                {errors.status && (
                    <p className="text-sm text-destructive">{errors.status}</p>
                )}
                {p.note && (
                    <p className="text-sm text-muted-foreground">
                        Note: {p.note}
                    </p>
                )}
                {p.status === 'draft' && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
                        Check the delivery: adjust quantity and cost if they
                        differ from the order, enter the batch number and expiry
                        date, then click Receive stock.
                    </div>
                )}

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>SKU</TableHead>
                                <TableHead>Material</TableHead>
                                <TableHead>Batch</TableHead>
                                <TableHead>Expiry</TableHead>
                                <TableHead className="text-right">
                                    Qty
                                </TableHead>
                                <TableHead className="text-right">
                                    Unit cost
                                </TableHead>
                                <TableHead className="text-right">
                                    Subtotal
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {p.items.map((i, idx) => (
                                <TableRow key={i.id}>
                                    <TableCell className="font-mono text-xs">
                                        {i.sku}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {i.name}
                                    </TableCell>
                                    <TableCell>
                                        {p.status === 'draft' ? (
                                            <Input
                                                value={
                                                    form.data.items[idx]
                                                        .batch_no
                                                }
                                                onChange={(e) =>
                                                    update(idx, {
                                                        batch_no:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        ) : (
                                            (i.batch_no ?? '-')
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {p.status !== 'draft' ? (
                                            (i.expiry_date ?? '-')
                                        ) : i.track_expiry ? (
                                            <>
                                                <Input
                                                    type="date"
                                                    value={
                                                        form.data.items[idx]
                                                            .expiry_date
                                                    }
                                                    onChange={(e) =>
                                                        update(idx, {
                                                            expiry_date:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                                {formErrors[
                                                    `items.${idx}.expiry_date`
                                                ] && (
                                                    <p className="text-xs text-destructive">
                                                        {
                                                            formErrors[
                                                                `items.${idx}.expiry_date`
                                                            ]
                                                        }
                                                    </p>
                                                )}
                                            </>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">
                                                Not tracked
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {i.quantity} {i.unit}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        ${i.unit_cost.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        ${i.subtotal.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-right font-semibold"
                                >
                                    Total
                                </TableCell>
                                <TableCell className="text-right font-semibold">
                                    ${p.total_amount.toFixed(2)}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}
