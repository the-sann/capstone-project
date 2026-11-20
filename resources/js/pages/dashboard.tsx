// import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { dashboard } from '@/routes';
import RevenueChart from '@/components/app/chart';
import StatCard from '@/components/app/stat-card';
import { Head, usePage } from '@inertiajs/react';
import type { PageProps } from '@inertiajs/core';

interface RevenueRange {
    labels: string[];
    values: number[];
}

interface DashboardProps extends PageProps {
    translations: {
        welcome: string;
        dashboard: string;
    };
    revenueRanges: {
        '6m': RevenueRange;
        '12m': RevenueRange;
    };
}

export default function Dashboard() {
    const { translations, revenueRanges } = usePage<DashboardProps>().props;

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1>{translations.welcome}</h1>
                <p>{translations.dashboard}</p>

                <div className="grid gap-4 md:grid-cols-2">
                    <StatCard
                        label="Profit"
                        value="$240.94"
                        change={67.81}
                        trend="up"
                    />
                    <StatCard
                        label="Profit"
                        value="$240.94"
                        change={67.81}
                        trend="down"
                    />
                </div>

                <RevenueChart revenueRanges={revenueRanges} />
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
