import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

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
    const canvasRef = useRef(null);
    const chartRef = useRef(null);
    const [selectedRange, setSelectedRange] = useState('6m');

    // Create the chart once on mount.
    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');

        const revenueFillGradient = ctx.createLinearGradient(0, 0, 0, 256);
        revenueFillGradient.addColorStop(0, 'rgba(79, 70, 229, 0.25)');
        revenueFillGradient.addColorStop(1, 'rgba(79, 70, 229, 0)');

        chartRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: REVENUE_RANGES_BY_PERIOD['6m'].labels,
                datasets: [
                    {
                        label: 'Revenue',
                        data: REVENUE_RANGES_BY_PERIOD['6m'].values,
                        borderColor: '#4f46e5',
                        backgroundColor: revenueFillGradient,
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: '#4f46e5',
                        pointHoverBorderColor: '#ffffff',
                        pointHoverBorderWidth: 2,
                        tension: 0.35,
                        fill: true,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (tooltipItem) =>
                                `$${tooltipItem.formattedValue}`,
                        },
                    },
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: '#4b5563' },
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: '#e5e7eb' },
                        ticks: {
                            color: '#4b5563',
                            callback: (tickValue) =>
                                `$${Number(tickValue) / 1000}k`,
                        },
                    },
                },
            },
        });

        return () => {
            chartRef.current?.destroy();
        };
    }, []);

    // Update the chart's data whenever the selected range changes.
    useEffect(() => {
        const chart = chartRef.current;
        if (!chart) return;

        const { labels, values } = REVENUE_RANGES_BY_PERIOD[selectedRange];
        chart.data.labels = labels;
        chart.data.datasets[0].data = values;
        chart.update();
    }, [selectedRange]);

    const { labels, values } = REVENUE_RANGES_BY_PERIOD[selectedRange];

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-gray-900">
                    Monthly revenue
                </h2>

                <div className="inline-flex rounded-md border border-gray-200 p-0.5 text-xs font-medium">
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
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-600'
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
