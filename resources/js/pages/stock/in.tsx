import { Head, Link, useForm } from '@inertiajs/react';
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

interface MaterialOption {
    id: number;
    sku: string;
    name: string;
    unit: string;
    track_expiry: boolean;
    unit_cost: string;
}

export default function StockIn({
    materials,
}: {
    materials: MaterialOption[];
}) {
    const form = useForm({
        material_id: '',
        quantity: '',
        unit_cost: '',
        batch_no: '',
        expiry_date: '',
        reason: 'opening',
        note: '',
    });

    const selected = materials.find(
        (m) => String(m.id) === form.data.material_id,
    );

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(stock.receive().url, {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    const error = (key: keyof typeof form.data) =>
        form.errors[key] && (
            <p className="text-sm text-destructive">{form.errors[key]}</p>
        );

    return (
        <>
            <Head title="Stock In" />
            <form
                onSubmit={submit}
                className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4"
            >
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Stock In
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Add stock to a material. Each entry creates a new batch.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-1.5 sm:col-span-2">
                        <Label>Material</Label>
                        <Select
                            value={form.data.material_id}
                            onValueChange={(v) => {
                                const m = materials.find(
                                    (x) => String(x.id) === v,
                                );
                                form.setData((d) => ({
                                    ...d,
                                    material_id: v,
                                    unit_cost: m?.unit_cost ?? '',
                                    expiry_date: '',
                                }));
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select material" />
                            </SelectTrigger>
                            <SelectContent>
                                {materials.map((m) => (
                                    <SelectItem key={m.id} value={String(m.id)}>
                                        {m.name} ({m.sku})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {error('material_id')}
                    </div>

                    <div className="grid gap-1.5">
                        <Label htmlFor="quantity">
                            Quantity{selected ? ` (${selected.unit})` : ''}
                        </Label>
                        <Input
                            id="quantity"
                            type="number"
                            step="0.01"
                            value={form.data.quantity}
                            onChange={(e) =>
                                form.setData('quantity', e.target.value)
                            }
                        />
                        {error('quantity')}
                    </div>

                    <div className="grid gap-1.5">
                        <Label htmlFor="unit_cost">Unit cost</Label>
                        <Input
                            id="unit_cost"
                            type="number"
                            step="0.01"
                            value={form.data.unit_cost}
                            onChange={(e) =>
                                form.setData('unit_cost', e.target.value)
                            }
                        />
                        {error('unit_cost')}
                    </div>

                    <div className="grid gap-1.5">
                        <Label htmlFor="batch_no">Batch / lot no.</Label>
                        <Input
                            id="batch_no"
                            value={form.data.batch_no}
                            onChange={(e) =>
                                form.setData('batch_no', e.target.value)
                            }
                        />
                        {error('batch_no')}
                    </div>

                    {selected?.track_expiry && (
                        <div className="grid gap-1.5">
                            <Label htmlFor="expiry_date">Expiry date</Label>
                            <Input
                                id="expiry_date"
                                type="date"
                                value={form.data.expiry_date}
                                onChange={(e) =>
                                    form.setData('expiry_date', e.target.value)
                                }
                            />
                            {error('expiry_date')}
                        </div>
                    )}

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
                                <SelectItem value="opening">
                                    Opening stock
                                </SelectItem>
                                <SelectItem value="returned">
                                    Returned
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {error('reason')}
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
                        Add stock
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href={stock.index()}>Back</Link>
                    </Button>
                </div>
            </form>
        </>
    );
}
