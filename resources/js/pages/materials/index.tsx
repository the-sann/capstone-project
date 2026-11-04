import { Head, Link } from '@inertiajs/react';
import { Package, PlusCircle, Boxes, Tags, ArrowRight } from 'lucide-react';

const materialActions = [
    {
        title: 'View Materials',
        description: 'View and manage all clinic materials.',
        icon: Package,
        href: '/materials',
    },
    {
        title: 'Add Material',
        description: 'Register new materials into the system.',
        icon: PlusCircle,
        href: '/materials/create',
    },
    {
        title: 'Stock Management',
        description: 'Monitor and update material stock quantities.',
        icon: Boxes,
        href: '/materials/stock',
    },
    {
        title: 'Material Categories',
        description: 'Organize and manage material categories.',
        icon: Tags,
        href: '/materials/categories',
    },
];

export default function Index() {
    return (
        <>
            <Head title="Materials" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Materials
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage clinic materials, inventory, and categories.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {materialActions.map((action) => {
                        const Icon = action.icon;

                        return (
                            <Link
                                key={action.title}
                                href={action.href}
                                className="group rounded-xl border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="rounded-lg bg-muted p-3">
                                        <Icon className="h-6 w-6" />
                                    </div>

                                    <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                                </div>

                                <div className="mt-5">
                                    <h2 className="font-semibold">
                                        {action.title}
                                    </h2>

                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {action.description}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
