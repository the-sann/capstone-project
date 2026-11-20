import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import materials from '@/routes/materials';

interface Props {
    material: {
        id: number;
        material_category_id: number;
        sku: string;
        name: string;
        unit: string;
        min_stock: string;
        unit_cost: string;
        track_expiry: boolean;
        is_active: boolean;
        description: string | null;
        image_path: string | null;
    } | null;
    categories: { id: number; name: string }[];
}

export default function MaterialForm({ material, categories }: Props) {
    const isEdit = !!material;

    const form = useForm({
        material_category_id: material
            ? String(material.material_category_id)
            : '',
        sku: material?.sku ?? '',
        name: material?.name ?? '',
        unit: material?.unit ?? '',
        min_stock: material?.min_stock ?? '0',
        unit_cost: material?.unit_cost ?? '0',
        track_expiry: material?.track_expiry ?? true,
        is_active: material?.is_active ?? true,
        description: material?.description ?? '',
        opening_stock: '',
        opening_expiry_date: '',
        image: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            form.transform((d) => ({ ...d, _method: 'put' }));
            form.post(materials.update(material!.id).url, {
                forceFormData: true,
            });
        } else {
            form.post(materials.store().url, { forceFormData: true });
        }
    };

    const field = (
        key: keyof typeof form.data,
        label: string,
        type = 'text',
    ) => (
        <div className="grid gap-1.5">
            <Label htmlFor={key}>{label}</Label>
            <Input
                id={key}
                type={type}
                step={type === 'number' ? '0.01' : undefined}
                value={form.data[key] as string}
                onChange={(e) => form.setData(key, e.target.value)}
            />
            {form.errors[key] && (
                <p className="text-sm text-destructive">{form.errors[key]}</p>
            )}
        </div>
    );

    return (
        <>
            <Head title={isEdit ? 'Edit material' : 'Add material'} />
            <form
                onSubmit={submit}
                className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4"
            >
                <h1 className="text-xl font-semibold">
                    {isEdit ? 'Edit material' : 'Add material'}
                </h1>

                <div className="grid gap-4 sm:grid-cols-2">
                    {field('sku', 'SKU')}
                    {field('name', 'Name')}

                    <div className="grid gap-1.5">
                        <Label>Category</Label>
                        <Select
                            value={form.data.material_category_id}
                            onValueChange={(v) =>
                                form.setData('material_category_id', v)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((c) => (
                                    <SelectItem key={c.id} value={String(c.id)}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {form.errors.material_category_id && (
                            <p className="text-sm text-destructive">
                                {form.errors.material_category_id}
                            </p>
                        )}
                    </div>

                    {field('unit', 'Unit (box, pcs, ml...)')}
                    {field('min_stock', 'Low stock threshold', 'number')}
                    {field('unit_cost', 'Unit cost', 'number')}
                </div>

                {!isEdit && (
                    <div className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
                        <p className="text-sm text-muted-foreground sm:col-span-2">
                            Optional: record the quantity you already have on
                            the shelf.
                        </p>
                        {field('opening_stock', 'Opening stock', 'number')}
                        {form.data.track_expiry &&
                            field('opening_expiry_date', 'Expiry date', 'date')}
                    </div>
                )}

                <div className="grid gap-1.5">
                    <Label htmlFor="image">Photo</Label>
                    {(form.data.image || material?.image_path) && (
                        <img
                            src={
                                form.data.image
                                    ? URL.createObjectURL(form.data.image)
                                    : material!.image_path!
                            }
                            alt="Preview"
                            className="size-24 rounded-lg border object-cover"
                        />
                    )}
                    <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            form.setData('image', e.target.files?.[0] ?? null)
                        }
                    />
                    {form.errors.image && (
                        <p className="text-sm text-destructive">
                            {form.errors.image}
                        </p>
                    )}
                </div>

                <div className="grid gap-1.5">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={form.data.description}
                        onChange={(e) =>
                            form.setData('description', e.target.value)
                        }
                    />
                </div>

                <div className="flex gap-6">
                    <label className="flex items-center gap-2 text-sm">
                        <Checkbox
                            checked={form.data.track_expiry}
                            onCheckedChange={(v) =>
                                form.setData('track_expiry', !!v)
                            }
                        />
                        Track expiry
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                        <Checkbox
                            checked={form.data.is_active}
                            onCheckedChange={(v) =>
                                form.setData('is_active', !!v)
                            }
                        />
                        Active
                    </label>
                </div>

                <div className="flex gap-2">
                    <Button type="submit" disabled={form.processing}>
                        {isEdit ? 'Save changes' : 'Create material'}
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href={materials.list()}>Cancel</Link>
                    </Button>
                </div>
            </form>
        </>
    );
}
