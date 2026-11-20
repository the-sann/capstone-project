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

interface Batch {
    id: number;
    material: string;
    unit: string;
    batch_no: string | null;
    expiry_date: string;
    quantity: number;
    days_left: number;
}

export default function Expiry({
    batches,
    days,
}: {
    batches: Batch[];
    days: number;
}) {
    return (
        <>
            <Head title="Expiry Tracking" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Expiry Tracking
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Expired batches and batches expiring soon. Write off
                            expired stock in Stock Adjustment.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Select
                            value={String(days)}
                            onValueChange={(v) =>
                                router.get(
                                    stock.expiry().url,
                                    { days: v },
                                    { preserveState: true, replace: true },
                                )
                            }
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="30">Next 30 days</SelectItem>
                                <SelectItem value="60">Next 60 days</SelectItem>
                                <SelectItem value="90">Next 90 days</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" asChild>
                            <Link href={stock.index()}>Back</Link>
                        </Button>
                    </div>
                </div>

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Material</TableHead>
                                <TableHead>Batch</TableHead>
                                <TableHead>Expiry date</TableHead>
                                <TableHead className="text-right">
                                    Remaining
                                </TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {batches.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        Nothing expiring in this period.
                                    </TableCell>
                                </TableRow>
                            )}
                            {batches.map((b) => (
                                <TableRow key={b.id}>
                                    <TableCell className="font-medium">
                                        {b.material}
                                    </TableCell>
                                    <TableCell>{b.batch_no ?? '-'}</TableCell>
                                    <TableCell>{b.expiry_date}</TableCell>
                                    <TableCell className="text-right">
                                        {b.quantity} {b.unit}
                                    </TableCell>
                                    <TableCell>
                                        {b.days_left < 0 ? (
                                            <Badge variant="destructive">
                                                Expired {Math.abs(b.days_left)}d
                                                ago
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary">
                                                {b.days_left}d left
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {b.days_left < 0 && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                asChild
                                            >
                                                <Link
                                                    href={stock.adjustments()}
                                                >
                                                    Write off
                                                </Link>
                                            </Button>
                                        )}
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
