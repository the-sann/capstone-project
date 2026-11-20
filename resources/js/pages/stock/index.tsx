import { Head, Link } from '@inertiajs/react';
import {
    ArrowDownToLine,
    ArrowRight,
    ArrowUpFromLine,
    CalendarX,
    History,
    SlidersHorizontal,
    TriangleAlert,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import stock from '@/routes/stock';

interface Props {
    stats: { low_stock: number; expiring: number };
}

export default function StockIndex({ stats }: Props) {
    const actions = [
        {
            title: 'Stock In',
            description: 'Add stock to a material with batch and expiry date.',
            icon: ArrowDownToLine,
            href: stock.in().url,
        },
        {
            title: 'Stock Out',
            description:
                'Remove used, damaged or lost stock (earliest expiry first).',
            icon: ArrowUpFromLine,
            href: stock.out().url,
        },
        {
            title: 'Stock Adjustment',
            description:
                'Correct quantities after a stock count or write off expired items.',
            icon: SlidersHorizontal,
            href: stock.adjustments().url, // page coming later
        },
        {
            title: 'Stock History',
            description: 'Full ledger of every stock movement.',
            icon: History,
            href: stock.history().url, // page coming later
        },
        {
            title: 'Expiry Tracking',
            description: 'Batches that are expired or expiring soon.',
            icon: CalendarX,
            href: stock.expiry().url, // page coming later
            count: stats.expiring,
        },
        {
            title: 'Low Stock Alert',
            description: 'Materials at or below their minimum level.',
            icon: TriangleAlert,
            href: stock.low().url, // page coming later
            count: stats.low_stock,
        },
    ];

    return (
        <>
            <Head title="Stock Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Stock Management
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Monitor and update material stock quantities.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {actions.map((a) => {
                        const Icon = a.icon;
                        return (
                            <Link
                                key={a.title}
                                href={a.href}
                                className="group rounded-xl border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="rounded-lg bg-muted p-3">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                                </div>
                                <div className="mt-5">
                                    <div className="flex items-center gap-2">
                                        <h2 className="font-semibold">
                                            {a.title}
                                        </h2>
                                        {!!a.count && (
                                            <Badge variant="destructive">
                                                {a.count}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {a.description}
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
