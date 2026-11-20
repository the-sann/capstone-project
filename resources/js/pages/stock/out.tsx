import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import stock from '@/routes/stock';

interface MaterialOption {
    id: number;
    sku: string;
    name: string;
    unit: string;
    usable_stock: number;
}

interface Line {
    material_id: number;
    sku: string;
    name: string;
    unit: string;
    usable_stock: number;
    quantity: string;
}

export default function StockOut({
    materials,
}: {
    materials: MaterialOption[];
}) {
    const form = useForm<{
        reason: string;
        note: string;
        items: Line[];
    }>({
        reason: 'used',
        note: '',
        items: [],
    });

    const [code, setCode] = useState('');
    const [lookupError, setLookupError] = useState('');
    const errors = form.errors as Record<string, string>;

    const addBySku = () => {
        const sku = code.trim().toUpperCase();
        if (!sku) return;

        const m = materials.find((x) => x.sku.toUpperCase() === sku);
        if (!m) {
            setLookupError(`SKU "${sku}" not found.`);
            return;
        }
        if (form.data.items.some((l) => l.material_id === m.id)) {
            setLookupError(`${m.name} is already in the list.`);
            return;
        }
        if (m.usable_stock <= 0) {
            setLookupError(`${m.name} has no usable stock.`);
            return;
        }

        form.setData('items', [
            ...form.data.items,
            {
                material_id: m.id,
                sku: m.sku,
                name: m.name,
                unit: m.unit,
                usable_stock: m.usable_stock,
                quantity: '1',
            },
        ]);
        setCode('');
        setLookupError('');
    };

    const updateQty = (i: number, quantity: string) =>
        form.setData(
            'items',
            form.data.items.map((l, idx) =>
                idx === i ? { ...l, quantity } : l,
            ),
        );

    const removeLine = (i: number) =>
        form.setData(
            'items',
            form.data.items.filter((_, idx) => idx !== i),
        );

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(stock.issue().url, {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    return (
        <>
            <Head title="Stock Out" />
            <form
                onSubmit={submit}
                className="mx-auto flex w-full flex-col gap-4 p-4"
            >
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Stock Out
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Remove several materials at once. Stock is taken from
                        the batch that expires first.
                    </p>
                </div>

                <div className="grid gap-1.5 rounded-lg border p-4">
                    <Label htmlFor="sku">Add item</Label>
                    <div className="flex gap-2">
                        <Input
                            id="sku"
                            list="out-sku-list"
                            value={code}
                            placeholder="Type or pick a SKU, then press Enter"
                            onChange={(e) => {
                                setCode(e.target.value);
                                setLookupError('');
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addBySku();
                                }
                            }}
                        />
                        <datalist id="out-sku-list">
                            {materials.map((m) => (
                                <option key={m.id} value={m.sku}>
                                    {m.name}
                                </option>
                            ))}
                        </datalist>
                        <Button type="button" onClick={addBySku}>
                            <Plus className="mr-1 size-4" /> Add
                        </Button>
                    </div>
                    {lookupError && (
                        <p className="text-sm text-destructive">
                            {lookupError}
                        </p>
                    )}
                    {errors.items && (
                        <p className="text-sm text-destructive">
                            {errors.items}
                        </p>
                    )}
                </div>

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>SKU</TableHead>
                                <TableHead>Material</TableHead>
                                <TableHead className="text-right">
                                    Available
                                </TableHead>
                                <TableHead className="w-32">Quantity</TableHead>
                                <TableHead />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {form.data.items.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        No items yet. Enter a SKU above.
                                    </TableCell>
                                </TableRow>
                            )}
                            {form.data.items.map((l, i) => (
                                <TableRow
                                    key={l.material_id}
                                    className="align-top"
                                >
                                    <TableCell className="font-mono text-xs">
                                        {l.sku}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {l.name}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {l.usable_stock} {l.unit}
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            max={l.usable_stock}
                                            value={l.quantity}
                                            onChange={(e) =>
                                                updateQty(i, e.target.value)
                                            }
                                        />
                                        {errors[`items.${i}.quantity`] && (
                                            <p className="mt-1 text-xs text-destructive">
                                                {errors[`items.${i}.quantity`]}
                                            </p>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeLine(i)}
                                        >
                                            <Trash2 className="size-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
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
                                <SelectItem value="used">Used</SelectItem>
                                <SelectItem value="damaged">Damaged</SelectItem>
                                <SelectItem value="lost">Lost</SelectItem>
                                <SelectItem value="returned">
                                    Returned to supplier
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-1.5">
                        <Label htmlFor="note">Note</Label>
                        <Textarea
                            id="note"
                            rows={1}
                            placeholder="e.g. Used for patient #42"
                            value={form.data.note}
                            onChange={(e) =>
                                form.setData('note', e.target.value)
                            }
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        type="submit"
                        disabled={
                            form.processing || form.data.items.length === 0
                        }
                    >
                        Remove stock
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href={stock.index()}>Back</Link>
                    </Button>
                </div>
            </form>
        </>
    );
}
