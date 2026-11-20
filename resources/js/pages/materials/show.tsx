import { Head, Link } from '@inertiajs/react';
import {
    ArrowDownToLine,
    ArrowUpFromLine,
    Package,
    Pencil,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import materials from '@/routes/materials';
import stock from '@/routes/stock';

interface Props {
    material: {
        id: number;
        sku: string;
        name: string;
        category: string | null;
        unit: string;
        description: string | null;
        image_path: string | null;
        current_stock: number;
        min_stock: number;
        unit_cost: number;
        track_expiry: boolean;
        is_active: boolean;
        is_low_stock: boolean;
    };
    batches: {
        id: number;
        batch_no: string | null;
        expiry_date: string | null;
        days_left: number | null;
        quantity: number;
        unit_cost: number;
    }[];
    movements: {
        id: number;
        date: string;
        type: 'in' | 'out' | 'adjustment';
        reason: string | null;
        quantity: number;
        balance_after: number;
        user: string | null;
    }[];
}

export default function MaterialShow({
    material: m,
    batches,
    movements,
}: Props) {
    return (
        <>
            <Head title={m.name} />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {m.name}
                        </h1>
                        <p className="mt-1 font-mono text-sm text-muted-foreground">
                            {m.sku}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={stock.in()}>
                                <ArrowDownToLine className="mr-1 size-4" />{' '}
                                Stock in
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={stock.out()}>
                                <ArrowUpFromLine className="mr-1 size-4" />{' '}
                                Stock out
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={materials.edit(m.id)}>
                                <Pencil className="mr-1 size-4" /> Edit
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={materials.list()}>Back</Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
                    {/* Big picture */}
                    <Dialog>
                        <div className="overflow-hidden rounded-xl border bg-muted">
                            {m.image_path ? (
                                <DialogTriggerImage
                                    src={`/storage/${m.image_path}`}
                                    alt={m.name}
                                />
                            ) : (
                                <div className="flex aspect-square items-center justify-center">
                                    <Package className="size-16 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                        {m.image_path && (
                            <DialogContent className="max-w-3xl p-2">
                                <DialogTitle className="sr-only">
                                    {m.name}
                                </DialogTitle>
                                <img
                                    src={`/storage/${m.image_path}`}
                                    alt={m.name}
                                    className="max-h-[80vh] w-full rounded-md object-contain"
                                />
                            </DialogContent>
                        )}
                    </Dialog>

                    {/* Details */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap gap-2">
                            {m.is_low_stock && (
                                <Badge variant="destructive">Low stock</Badge>
                            )}
                            {!m.is_active && (
                                <Badge variant="secondary">Inactive</Badge>
                            )}
                            {m.category && (
                                <Badge variant="outline">{m.category}</Badge>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <Stat
                                label="In stock"
                                value={`${m.current_stock} ${m.unit}`}
                                danger={m.is_low_stock}
                            />
                            <Stat
                                label="Minimum"
                                value={`${m.min_stock} ${m.unit}`}
                            />
                            <Stat
                                label="Unit cost"
                                value={`$${m.unit_cost.toFixed(2)}`}
                            />
                            <Stat
                                label="Stock value"
                                value={`$${(m.current_stock * m.unit_cost).toFixed(2)}`}
                            />
                        </div>

                        {m.description && (
                            <div>
                                <h2 className="text-sm font-medium text-muted-foreground">
                                    Description
                                </h2>
                                <p className="mt-1 text-sm">{m.description}</p>
                            </div>
                        )}
                        <p className="text-sm text-muted-foreground">
                            Expiry tracking: {m.track_expiry ? 'On' : 'Off'}
                        </p>
                    </div>
                </div>

                {/* Batches */}
                <section className="flex flex-col gap-2">
                    <h2 className="text-lg font-semibold">Batches in stock</h2>
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Batch</TableHead>
                                    <TableHead>Expiry</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Remaining
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Unit cost
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {batches.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="py-6 text-center text-muted-foreground"
                                        >
                                            No stock in any batch.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {batches.map((b) => (
                                    <TableRow key={b.id}>
                                        <TableCell>
                                            {b.batch_no ?? '-'}
                                        </TableCell>
                                        <TableCell>
                                            {b.expiry_date ?? '-'}
                                        </TableCell>
                                        <TableCell>
                                            {b.days_left === null ? (
                                                '-'
                                            ) : b.days_left < 0 ? (
                                                <Badge variant="destructive">
                                                    Expired
                                                </Badge>
                                            ) : b.days_left <= 30 ? (
                                                <Badge variant="secondary">
                                                    {b.days_left}d left
                                                </Badge>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">
                                                    {b.days_left}d left
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {b.quantity} {m.unit}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            ${b.unit_cost.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </section>

                {/* Recent movements */}
                <section className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                            Recent movements
                        </h2>
                        <Button variant="ghost" size="sm" asChild>
                            <Link
                                href={stock.history({
                                    query: { material: m.id },
                                })}
                            >
                                View all
                            </Link>
                        </Button>
                    </div>
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead className="text-right">
                                        Qty
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Balance
                                    </TableHead>
                                    <TableHead>By</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {movements.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="py-6 text-center text-muted-foreground"
                                        >
                                            No movements yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {movements.map((x) => (
                                    <TableRow key={x.id}>
                                        <TableCell className="text-xs whitespace-nowrap">
                                            {x.date}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    x.type === 'out'
                                                        ? 'destructive'
                                                        : x.type === 'in'
                                                          ? 'default'
                                                          : 'secondary'
                                                }
                                            >
                                                {x.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="capitalize">
                                            {x.reason ?? '-'}
                                        </TableCell>
                                        <TableCell
                                            className={`text-right ${x.quantity < 0 ? 'text-destructive' : ''}`}
                                        >
                                            {x.quantity > 0 ? '+' : ''}
                                            {x.quantity}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {x.balance_after}
                                        </TableCell>
                                        <TableCell>{x.user ?? '-'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </section>
            </div>
        </>
    );
}

function Stat({
    label,
    value,
    danger,
}: {
    label: string;
    value: string;
    danger?: boolean;
}) {
    return (
        <div className="rounded-lg border bg-card p-3">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p
                className={`mt-1 text-lg font-semibold ${danger ? 'text-destructive' : ''}`}
            >
                {value}
            </p>
        </div>
    );
}

function DialogTriggerImage({ src, alt }: { src: string; alt: string }) {
    return (
        <DialogTrigger asChild>
            <button type="button" className="block w-full cursor-zoom-in">
                <img
                    src={src}
                    alt={alt}
                    className="aspect-square w-full object-cover"
                />
            </button>
        </DialogTrigger>
    );
}
