import { TrendingDown, TrendingUp, Printer } from 'lucide-react';
import type { ReactNode } from 'react';

interface StatCardProps {
    label: string;
    value: string;
    change: number;
    trend: 'up' | 'down';
    icon?: ReactNode;
}

export default function StatCard({
    label,
    value,
    change,
    trend,
    icon = <Printer className="size-6" aria-hidden="true" />,
}: StatCardProps) {
    const isUp = trend === 'up';
    const TrendIcon = isUp ? TrendingUp : TrendingDown;

    return (
        <article className="flex items-end justify-between rounded-lg border border-gray-100 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center gap-4">
                <span className="hidden rounded-full bg-gray-100 p-2 text-gray-600 sm:block dark:bg-neutral-800 dark:text-neutral-300">
                    {icon}
                </span>

                <div>
                    <p className="text-sm text-gray-500 dark:text-neutral-400">
                        {label}
                    </p>
                    <p className="text-2xl font-medium text-gray-900 dark:text-neutral-100">
                        {value}
                    </p>
                </div>
            </div>

            <div
                className={`inline-flex gap-2 rounded-sm p-1 ${
                    isUp
                        ? 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400'
                        : 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400'
                }`}
            >
                <TrendIcon className="size-4" aria-hidden="true" />
                <span className="sr-only">
                    {isUp ? 'Increase' : 'Decrease'}:{' '}
                </span>
                <span className="text-xs font-medium">
                    {change.toFixed(2)}%
                </span>
            </div>
        </article>
    );
}
