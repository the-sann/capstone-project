import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Trash2, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import purchases from '@/routes/purchases';
import suppliersRoute from '@/routes/suppliers';

interface MaterialOption {
    id: number;
    sku: string;
    name: string;
    unit: string;
    unit_cost: number;
    track_expiry: boolean;
}
interface Line {
    material_id: number;
    sku: string;
    name: string;
    unit: string;
    track_expiry: boolean;
    quantity: string;
    unit_cost: string;
    batch_no: string;
    expiry_date: string;
}
interface Props {
    suppliers: { id: number; name: string }[];
    materials: MaterialOption[];
}

export default function PurchaseCreate({ suppliers, materials }: Props) {
    const form = useForm<{
        supplier_id: string;
        purchase_date: string;
        note: string;
        items: Line[];
    }>({
        supplier_id: '',
        purchase_date: new Date().toISOString().slice(0, 10),
        note: '',
        items: [],
    });

    const [code, setCode] = useState('');
    const [lookupError, setLookupError] = useState('');
    const [supplierOpen, setSupplierOpen] = useState(false);
    const supplierForm = useForm({ name: '', phone: '', email: '' });

    const errors = form.errors as Record<string, string>;

    const addBySku = () => {
        const sku = code.trim().toUpperCase().split(' ')[0]; // datalist may insert "SKU - Name"
        if (!sku) return;

        const m = materials.find((x) => x.sku.toUpperCase() === sku);
        if (!m) {
            setLookupError(
                `SKU "${sku}" not found. Add the material first, then purchase it.`,
            );
            return;
        }
        if (form.data.items.some((l) => l.material_id === m.id)) {
            setLookupError(
                `${m.name} is already in this purchase. Change its quantity below.`,
            );
            return;
        }

        form.setData('items', [
            ...form.data.items,
            {
                material_id: m.id,
                sku: m.sku,
                name: m.name,
                unit: m.unit,
                track_expiry: m.track_expiry,
                quantity: '1',
                unit_cost: String(m.unit_cost),
                batch_no: '',
                expiry_date: '',
            },
        ]);
        setCode('');
        setLookupError('');
    };

    const updateLine = (i: number, patch: Partial<Line>) =>
        form.setData(
            'items',
            form.data.items.map((l, idx) =>
                idx === i ? { ...l, ...patch } : l,
            ),
        );

    const removeLine = (i: number) =>
        form.setData(
            'items',
            form.data.items.filter((_, idx) => idx !== i),
        );

    const total = form.data.items.reduce(
        (sum, l) =>
            sum +
            (parseFloat(l.quantity) || 0) * (parseFloat(l.unit_cost) || 0),
        0,
    );

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(purchases.store().url);
    };

    const saveSupplier = (e: React.FormEvent) => {
        e.preventDefault();
        supplierForm.post(suppliersRoute.store().url, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                supplierForm.reset();
                setSupplierOpen(false);
            },
        });
    };

    return (
        <>
            <Head title="New Purchase" />
            <form onSubmit={submit} className="flex flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        New Purchase
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Items are added by SKU from your materials list. New
                        SKUs can't be created here.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="grid gap-1.5">
                        <Label>Supplier</Label>
                        <div className="flex gap-2">
                            <Select
                                value={form.data.supplier_id}
                                onValueChange={(v) =>
                                    form.setData('supplier_id', v)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select supplier" />
                                </SelectTrigger>
                                <SelectContent>
                                    {suppliers.map((s) => (
                                        <SelectItem
                                            key={s.id}
                                            value={String(s.id)}
                                        >
                                            {s.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => setSupplierOpen(true)}
                            >
                                <UserPlus className="size-4" />
                            </Button>
                        </div>
                        {errors.supplier_id && (
                            <p className="text-sm text-destructive">
                                {errors.supplier_id}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-1.5">
                        <Label htmlFor="purchase_date">Purchase date</Label>
                        <Input
                            id="purchase_date"
                            type="date"
                            value={form.data.purchase_date}
                            onChange={(e) =>
                                form.setData('purchase_date', e.target.value)
                            }
                        />
                        {errors.purchase_date && (
                            <p className="text-sm text-destructive">
                                {errors.purchase_date}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-1.5">
                        <Label htmlFor="note">Note</Label>
                        <Textarea
                            id="note"
                            rows={1}
                            value={form.data.note}
                            onChange={(e) =>
                                form.setData('note', e.target.value)
                            }
                        />
                    </div>
                </div>

                <div className="grid gap-1.5 rounded-lg border p-4">
                    <Label htmlFor="sku">Add item by SKU</Label>
                    <div className="flex gap-2">
                        <Input
                            id="sku"
                            list="sku-list"
                            value={code}
                            placeholder="Type SKU, e.g. ANE-001, then press Enter"
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
                        <datalist id="sku-list">
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
                            {lookupError}{' '}
                            {lookupError.includes('not found') && (
                                <Link
                                    href="/materials/create"
                                    className="underline"
                                >
                                    Add material
                                </Link>
                            )}
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
                                <TableHead className="w-28">Qty</TableHead>
                                <TableHead className="w-28">
                                    Unit cost
                                </TableHead>
                                <TableHead className="w-36">
                                    Batch no.
                                </TableHead>
                                <TableHead className="w-40">Expiry</TableHead>
                                <TableHead className="text-right">
                                    Subtotal
                                </TableHead>
                                <TableHead />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {form.data.items.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
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
                                    <TableCell>
                                        <div className="font-medium">
                                            {l.name}
                                        </div>
                                        {errors[`items.${i}.material_id`] && (
                                            <p className="text-xs text-destructive">
                                                {
                                                    errors[
                                                        `items.${i}.material_id`
                                                    ]
                                                }
                                            </p>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={l.quantity}
                                            onChange={(e) =>
                                                updateLine(i, {
                                                    quantity: e.target.value,
                                                })
                                            }
                                        />
                                        <span className="text-xs text-muted-foreground">
                                            {l.unit}
                                        </span>
                                        {errors[`items.${i}.quantity`] && (
                                            <p className="text-xs text-destructive">
                                                {errors[`items.${i}.quantity`]}
                                            </p>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={l.unit_cost}
                                            onChange={(e) =>
                                                updateLine(i, {
                                                    unit_cost: e.target.value,
                                                })
                                            }
                                        />
                                        {errors[`items.${i}.unit_cost`] && (
                                            <p className="text-xs text-destructive">
                                                {errors[`items.${i}.unit_cost`]}
                                            </p>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            value={l.batch_no}
                                            onChange={(e) =>
                                                updateLine(i, {
                                                    batch_no: e.target.value,
                                                })
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {l.track_expiry ? (
                                            <Input
                                                type="date"
                                                value={l.expiry_date}
                                                onChange={(e) =>
                                                    updateLine(i, {
                                                        expiry_date:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        ) : (
                                            <span className="text-xs text-muted-foreground">
                                                Not tracked
                                            </span>
                                        )}
                                        {errors[`items.${i}.expiry_date`] && (
                                            <p className="text-xs text-destructive">
                                                {
                                                    errors[
                                                        `items.${i}.expiry_date`
                                                    ]
                                                }
                                            </p>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        $
                                        {(
                                            (parseFloat(l.quantity) || 0) *
                                            (parseFloat(l.unit_cost) || 0)
                                        ).toFixed(2)}
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

                <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold">
                        Total: ${total.toFixed(2)}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={purchases.index()}>Cancel</Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                form.processing || form.data.items.length === 0
                            }
                        >
                            Save purchase
                        </Button>
                    </div>
                </div>
            </form>

            <Dialog open={supplierOpen} onOpenChange={setSupplierOpen}>
                <DialogContent>
                    <form onSubmit={saveSupplier} className="grid gap-4">
                        <DialogHeader>
                            <DialogTitle>Add supplier</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-1.5">
                            <Label htmlFor="s-name">Name</Label>
                            <Input
                                id="s-name"
                                value={supplierForm.data.name}
                                onChange={(e) =>
                                    supplierForm.setData('name', e.target.value)
                                }
                            />
                            {supplierForm.errors.name && (
                                <p className="text-sm text-destructive">
                                    {supplierForm.errors.name}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="s-phone">Phone</Label>
                            <Input
                                id="s-phone"
                                value={supplierForm.data.phone}
                                onChange={(e) =>
                                    supplierForm.setData(
                                        'phone',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="s-email">Email</Label>
                            <Input
                                id="s-email"
                                type="email"
                                value={supplierForm.data.email}
                                onChange={(e) =>
                                    supplierForm.setData(
                                        'email',
                                        e.target.value,
                                    )
                                }
                            />
                            {supplierForm.errors.email && (
                                <p className="text-sm text-destructive">
                                    {supplierForm.errors.email}
                                </p>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setSupplierOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={supplierForm.processing}
                            >
                                Save supplier
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
