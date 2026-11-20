import { Head, Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import stock from '@/routes/stock';

interface Row {
    id: number;
    date: string;
    material: string;
    unit: string;
    batch_no: string | null;
    type: 'in' | 'out' | 'adjustment';
    reason: string | null;
    quantity: number;
    balance_after: number;
    note: string | null;
    user: string | null;
}

interface Props {
    movements: {
        data: Row[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    materials: { id: number; name: string }[];
    filters: { material?: string; type?: string };
}

export default function History({ movements, materials, filters }: Props) {
    const apply = (params: Record<string, string | undefined>) =>
        router.get(
            stock.history().url,
            { ...filters, ...params },
            { preserveState: true, replace: true },
        );

    return (
        <>
            <Head title="Stock History" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Stock History
                    </h1>
                    <Button variant="outline" asChild>
                        <Link href={stock.index()}>Back</Link>
                    </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Select
                        value={filters.material ?? 'all'}
                        onValueChange={(v) =>
                            apply({ material: v === 'all' ? undefined : v })
                        }
                    >
                        <SelectTrigger className="w-56">
                            <SelectValue placeholder="All materials" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All materials</SelectItem>
                            {materials.map((m) => (
                                <SelectItem key={m.id} value={String(m.id)}>
                                    {m.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.type ?? 'all'}
                        onValueChange={(v) =>
                            apply({ type: v === 'all' ? undefined : v })
                        }
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="All types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All types</SelectItem>
                            <SelectItem value="in">In</SelectItem>
                            <SelectItem value="out">Out</SelectItem>
                            <SelectItem value="adjustment">
                                Adjustment
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Material</TableHead>
                                <TableHead>Batch</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead className="text-right">
                                    Qty
                                </TableHead>
                                <TableHead className="text-right">
                                    Balance
                                </TableHead>
                                <TableHead>By</TableHead>
                                <TableHead>Note</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {movements.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={9}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        No movements yet.
                                    </TableCell>
                                </TableRow>
                            )}
                            {movements.data.map((m) => (
                                <TableRow key={m.id}>
                                    <TableCell className="text-xs whitespace-nowrap">
                                        {m.date}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {m.material}
                                    </TableCell>
                                    <TableCell>{m.batch_no ?? '-'}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                m.type === 'out'
                                                    ? 'destructive'
                                                    : m.type === 'in'
                                                      ? 'default'
                                                      : 'secondary'
                                            }
                                        >
                                            {m.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="capitalize">
                                        {m.reason ?? '-'}
                                    </TableCell>
                                    <TableCell
                                        className={`text-right ${m.quantity < 0 ? 'text-destructive' : ''}`}
                                    >
                                        {m.quantity > 0 ? '+' : ''}
                                        {m.quantity} {m.unit}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {m.balance_after}
                                    </TableCell>
                                    <TableCell>{m.user ?? '-'}</TableCell>
                                    <TableCell className="max-w-48 truncate text-muted-foreground">
                                        {m.note ?? '-'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex flex-wrap gap-1">
                    {movements.links.map((l, i) => (
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
