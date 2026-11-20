import { Head, Link, router } from '@inertiajs/react';
import { Eye, Package, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import materials from '@/routes/materials';

interface MaterialRow {
    id: number;
    sku: string;
    name: string;
    unit: string;
    category: string | null;
    current_stock: number;
    min_stock: number;
    unit_cost: number;
    is_low_stock: boolean;
    is_active: boolean;
    image_path: string | null;
}

interface Props {
    materials: {
        data: MaterialRow[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    categories: { id: number; name: string }[];
    filters: { search?: string; category?: string; low?: string };
}

export default function MaterialsIndex({
    materials: list,
    categories,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const apply = (params: Record<string, string | undefined>) =>
        router.get(
            materials.list().url, // /materials/all
            { ...filters, ...params },
            { preserveState: true, replace: true },
        );

    // Debounced search
    useEffect(() => {
        if (search === (filters.search ?? '')) return;
        const t = setTimeout(() => apply({ search: search || undefined }), 300);
        return () => clearTimeout(t);
    }, [search]);

    return (
        <>
            <Head title="Materials" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Materials</h1>
                    <Button asChild>
                        <Link href={materials.create()}>
                            <Plus className="mr-1 size-4" /> Add material
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                    <div className="relative">
                        <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name or SKU"
                            className="w-64 pl-8"
                        />
                    </div>

                    <Select
                        value={filters.category ?? 'all'}
                        onValueChange={(v) =>
                            apply({ category: v === 'all' ? undefined : v })
                        }
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="All categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All categories</SelectItem>
                            {categories.map((c) => (
                                <SelectItem key={c.id} value={String(c.id)}>
                                    {c.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        variant={filters.low ? 'default' : 'outline'}
                        onClick={() =>
                            apply({ low: filters.low ? undefined : '1' })
                        }
                    >
                        Low stock only
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
                                    Stock
                                </TableHead>
                                <TableHead className="text-right">
                                    Min
                                </TableHead>
                                <TableHead className="text-right">
                                    Unit cost
                                </TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {list.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        No materials found.
                                    </TableCell>
                                </TableRow>
                            )}
                            {list.data.map((m) => (
                                <TableRow key={m.id}>
                                    <TableCell className="font-mono text-xs">
                                        {m.sku}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            {m.image_path ? (
                                                <img
                                                    src={`/storage/${m.image_path}`}
                                                    alt={m.name}
                                                    className="size-10 rounded-md border object-cover"
                                                />
                                            ) : (
                                                <div className="flex size-10 items-center justify-center rounded-md border bg-muted">
                                                    <Package className="size-4 text-muted-foreground" />
                                                </div>
                                            )}
                                            {m.name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {m.name}
                                    </TableCell>
                                    <TableCell>{m.category ?? '-'}</TableCell>
                                    <TableCell className="text-right">
                                        {m.current_stock} {m.unit}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {m.min_stock}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        ${m.unit_cost.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="space-x-1">
                                        {m.is_low_stock && (
                                            <Badge variant="destructive">
                                                Low stock
                                            </Badge>
                                        )}
                                        {!m.is_active && (
                                            <Badge variant="secondary">
                                                Inactive
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            asChild
                                            title="View"
                                        >
                                            <Link href={materials.show(m.id)}>
                                                <Eye className="size-4" />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            asChild
                                        >
                                            <Link href={materials.edit(m.id)}>
                                                Edit
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                if (
                                                    confirm(
                                                        `Delete "${m.name}"?`,
                                                    )
                                                ) {
                                                    router.delete(
                                                        materials.destroy(m.id)
                                                            .url,
                                                        {
                                                            preserveScroll: true,
                                                        },
                                                    );
                                                }
                                            }}
                                        >
                                            <Trash2 className="size-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex flex-wrap gap-1">
                    {list.links.map((l, i) => (
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
