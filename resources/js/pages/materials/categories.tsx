import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import materialCategories from '@/routes/material-categories';

interface Category {
    id: number;
    name: string;
    description: string | null;
    materials_count: number;
}

export default function Categories({ categories }: { categories: Category[] }) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);

    const form = useForm({ name: '', description: '' });

    const openCreate = () => {
        setEditing(null);
        form.reset();
        form.clearErrors();
        setOpen(true);
    };

    const openEdit = (c: Category) => {
        setEditing(c);
        form.setData({ name: c.name, description: c.description ?? '' });
        form.clearErrors();
        setOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => setOpen(false),
        };

        if (editing) {
            form.put(materialCategories.update(editing.id).url, options);
        } else {
            form.post(materialCategories.store().url, options);
        }
    };

    const remove = (c: Category) => {
        if (confirm(`Delete category "${c.name}"?`)) {
            router.delete(materialCategories.destroy(c.id).url, {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="Material Categories" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Material Categories
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Organize clinic materials into groups.
                        </p>
                    </div>
                    <Button onClick={openCreate}>
                        <Plus className="mr-1 size-4" /> Add category
                    </Button>
                </div>

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">
                                    Materials
                                </TableHead>
                                <TableHead />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        No categories yet.
                                    </TableCell>
                                </TableRow>
                            )}
                            {categories.map((c) => (
                                <TableRow key={c.id}>
                                    <TableCell className="font-medium">
                                        {c.name}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {c.description ?? '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {c.materials_count}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => openEdit(c)}
                                        >
                                            <Pencil className="size-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => remove(c)}
                                        >
                                            <Trash2 className="size-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <form onSubmit={submit} className="grid gap-4">
                        <DialogHeader>
                            <DialogTitle>
                                {editing ? 'Edit category' : 'Add category'}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="grid gap-1.5">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData('name', e.target.value)
                                }
                                autoFocus
                            />
                            {form.errors.name && (
                                <p className="text-sm text-destructive">
                                    {form.errors.name}
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

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={form.processing}>
                                {editing ? 'Save changes' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
