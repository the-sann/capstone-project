import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { useAppearance } from '@/hooks/use-appearance';

const REVENUE_RANGES_BY_PERIOD = {
    '6m': {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        values: [28000, 34000, 31000, 39000, 42000, 48000],
    },
    '12m': {
        labels: [
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
        ],
        values: [
            19000, 21500, 20000, 23500, 25000, 27000, 28000, 34000, 31000,
            39000, 42000, 48000,
        ],
    },
};

export default function RevenueChart() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const chartRef = useRef<Chart | null>(null);

    const [selectedRange, setSelectedRange] = useState('6m');

    const { appearance } = useAppearance();

    /*
     * Get the actual theme.
     *
     * light  -> light
     * dark   -> dark
     * system -> check user's OS preference
     */
    const isDark =
        appearance === 'dark' ||
        (appearance === 'system' &&
            window.matchMedia('(prefers-color-scheme: dark)').matches);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        /*
         * Colors change depending on the current theme.
         */
        const textColor = isDark ? '#9ca3af' : '#4b5563';
        const gridColor = isDark ? '#374151' : '#e5e7eb';

        const tooltipBackground = isDark ? '#1f2937' : '#ffffff';

        const tooltipTitleColor = isDark ? '#f9fafb' : '#111827';

        const tooltipBodyColor = isDark ? '#d1d5db' : '#374151';

        const tooltipBorderColor = isDark ? '#374151' : '#e5e7eb';

        /*
         * Gradient for the area under the line.
         */
        const revenueFillGradient = ctx.createLinearGradient(0, 0, 0, 256);

        revenueFillGradient.addColorStop(0, 'rgba(79, 70, 229, 0.25)');

        revenueFillGradient.addColorStop(1, 'rgba(79, 70, 229, 0)');

        /*
         * Destroy the previous chart before
         * creating a new one.
         *
         * This is important when switching
         * between light and dark mode.
         */
        chartRef.current?.destroy();

        chartRef.current = new Chart(ctx, {
            type: 'line',

            data: {
                labels: REVENUE_RANGES_BY_PERIOD[
                    selectedRange as keyof typeof REVENUE_RANGES_BY_PERIOD
                ].labels,

                datasets: [
                    {
                        label: 'Revenue',

                        data: REVENUE_RANGES_BY_PERIOD[
                            selectedRange as keyof typeof REVENUE_RANGES_BY_PERIOD
                        ].values,

                        borderColor: '#4f46e5',

                        backgroundColor: revenueFillGradient,

                        borderWidth: 2,

                        pointRadius: 0,

                        pointHoverRadius: 5,

                        pointHoverBackgroundColor: '#4f46e5',

                        pointHoverBorderColor: isDark ? '#111827' : '#ffffff',

                        pointHoverBorderWidth: 2,

                        tension: 0.35,

                        fill: true,
                    },
                ],
            },

            options: {
                responsive: true,

                maintainAspectRatio: false,

                interaction: {
                    mode: 'index',
                    intersect: false,
                },

                plugins: {
                    legend: {
                        display: false,
                    },

                    tooltip: {
                        backgroundColor: tooltipBackground,

                        titleColor: tooltipTitleColor,

                        bodyColor: tooltipBodyColor,

                        borderColor: tooltipBorderColor,

                        borderWidth: 1,

                        callbacks: {
                            label: (tooltipItem) =>
                                `$${tooltipItem.formattedValue}`,
                        },
                    },
                },

                scales: {
                    x: {
                        grid: {
                            display: false,
                        },

                        ticks: {
                            color: textColor,
                        },
                    },

                    y: {
                        beginAtZero: true,

                        grid: {
                            color: gridColor,
                        },

                        ticks: {
                            color: textColor,

                            callback: (tickValue) =>
                                `$${Number(tickValue) / 1000}k`,
                        },
                    },
                },
            },
        });

        return () => {
            chartRef.current?.destroy();
            chartRef.current = null;
        };
    }, [isDark, selectedRange]);

    const { labels, values } =
        REVENUE_RANGES_BY_PERIOD[
            selectedRange as keyof typeof REVENUE_RANGES_BY_PERIOD
        ];

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Monthly revenue
                </h2>

                <div className="inline-flex rounded-md border border-gray-200 p-0.5 text-xs font-medium dark:border-gray-700">
                    {Object.keys(REVENUE_RANGES_BY_PERIOD).map((rangeKey) => {
                        const isSelected = rangeKey === selectedRange;

                        return (
                            <button
                                key={rangeKey}
                                type="button"
                                aria-pressed={isSelected}
                                onClick={() => setSelectedRange(rangeKey)}
                                className={`rounded-sm px-2 py-1 ${
                                    isSelected
                                        ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                                        : 'text-gray-600 dark:text-gray-400'
                                }`}
                            >
                                {rangeKey.toUpperCase()}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="mt-4 h-64">
                <canvas
                    ref={canvasRef}
                    role="img"
                    aria-label="Monthly revenue, line chart"
                />
            </div>

            <table className="sr-only" aria-live="polite">
                <caption>Monthly revenue by month</caption>

                <thead>
                    <tr>
                        <th scope="col">Month</th>
                        <th scope="col">Revenue</th>
                    </tr>
                </thead>

                <tbody>
                    {labels.map((monthLabel, index) => (
                        <tr key={monthLabel}>
                            <th scope="row">{monthLabel}</th>

                            <td>${values[index].toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
