import { Head, Link, useForm } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import stock from '@/routes/stock';

interface Batch {
    id: number;
    material: string;
    unit: string;
    batch_no: string | null;
    expiry_date: string | null;
    quantity: number;
    is_expired: boolean;
}

export default function Adjustments({ batches }: { batches: Batch[] }) {
    const form = useForm({
        batch_id: '',
        counted_quantity: '',
        reason: 'correction',
        note: '',
    });
    const selected = batches.find((b) => String(b.id) === form.data.batch_id);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(stock.adjust().url, {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    return (
        <>
            <Head title="Stock Adjustment" />
            <form
                onSubmit={submit}
                className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4"
            >
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Stock Adjustment
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Set a batch to the quantity you counted. To write off
                        expired stock, enter 0 with reason Expired.
                    </p>
                </div>

                <div className="grid gap-1.5">
                    <Label>Batch</Label>
                    <Select
                        value={form.data.batch_id}
                        onValueChange={(v) => {
                            const b = batches.find((x) => String(x.id) === v);
                            form.setData((d) => ({
                                ...d,
                                batch_id: v,
                                counted_quantity: String(b?.quantity ?? ''),
                                reason: b?.is_expired
                                    ? 'expired'
                                    : 'correction',
                            }));
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select batch" />
                        </SelectTrigger>
                        <SelectContent>
                            {batches.map((b) => (
                                <SelectItem key={b.id} value={String(b.id)}>
                                    {b.material} | {b.batch_no ?? 'no batch'} |
                                    exp {b.expiry_date ?? 'n/a'} | {b.quantity}{' '}
                                    {b.unit}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {selected?.is_expired && (
                        <Badge variant="destructive" className="w-fit">
                            Expired batch
                        </Badge>
                    )}
                    {form.errors.batch_id && (
                        <p className="text-sm text-destructive">
                            {form.errors.batch_id}
                        </p>
                    )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-1.5">
                        <Label htmlFor="counted">
                            Counted quantity
                            {selected
                                ? ` (system: ${selected.quantity} ${selected.unit})`
                                : ''}
                        </Label>
                        <Input
                            id="counted"
                            type="number"
                            step="0.01"
                            value={form.data.counted_quantity}
                            onChange={(e) =>
                                form.setData('counted_quantity', e.target.value)
                            }
                        />
                        {form.errors.counted_quantity && (
                            <p className="text-sm text-destructive">
                                {form.errors.counted_quantity}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-1.5">
                        <Label>Reason</Label>
                        <Select
                            value={form.data.reason}
                            onValueChange={(v) => form.setData('reason', v)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="correction">
                                    Stock count correction
                                </SelectItem>
                                <SelectItem value="expired">Expired</SelectItem>
                                <SelectItem value="damaged">Damaged</SelectItem>
                                <SelectItem value="lost">Lost</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid gap-1.5">
                    <Label htmlFor="note">Note</Label>
                    <Textarea
                        id="note"
                        value={form.data.note}
                        onChange={(e) => form.setData('note', e.target.value)}
                    />
                </div>

                <div className="flex gap-2">
                    <Button type="submit" disabled={form.processing}>
                        Save adjustment
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href={stock.index()}>Back</Link>
                    </Button>
                </div>
            </form>
        </>
    );
}
