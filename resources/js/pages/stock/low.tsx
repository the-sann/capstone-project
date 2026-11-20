import { Head, Link } from '@inertiajs/react';
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
import stock from '@/routes/stock';

interface Row {
    id: number;
    sku: string;
    name: string;
    category: string | null;
    unit: string;
    current_stock: number;
    min_stock: number;
    shortfall: number;
}

export default function Low({ materials }: { materials: Row[] }) {
    return (
        <>
            <Head title="Low Stock Alert" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Low Stock Alert
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Materials at or below their minimum level.
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={stock.index()}>Back</Link>
                    </Button>
                </div>

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>SKU</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">
                                    In stock
                                </TableHead>
                                <TableHead className="text-right">
                                    Minimum
                                </TableHead>
                                <TableHead className="text-right">
                                    To reorder
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {materials.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        All materials are above their minimum
                                        level.
                                    </TableCell>
                                </TableRow>
                            )}
                            {materials.map((m) => (
                                <TableRow key={m.id}>
                                    <TableCell className="font-mono text-xs">
                                        {m.sku}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {m.name}
                                    </TableCell>
                                    <TableCell>{m.category ?? '-'}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant="destructive">
                                            {m.current_stock} {m.unit}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {m.min_stock}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {m.shortfall} {m.unit}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}
