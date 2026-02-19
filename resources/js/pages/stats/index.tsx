import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ArcElement);

type ChartDatum = { label: string; amount: number };
type PeriodDatum = { period: string; total: number };

type StatsProps = {
    filters: { start_date: string; end_date: string; type?: string; mode?: 'payments' | 'expenses' };
    types: string[];
    mode: 'payments' | 'expenses';
    userBreakdown: ChartDatum[];
    userTotal: number;
    userPeriods: PeriodDatum[];
    overallBreakdown: ChartDatum[];
    overallTotal: number;
    overallPeriods: PeriodDatum[];
    hasMember: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Početna stranica', href: '/dashboard' },
    { title: 'Statistika', href: '/stats' },
];

const formatMoney = (val: number) =>
    new Intl.NumberFormat('bs-BA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);

const getCssVar = (name: string, fallback: string) => {
    if (typeof window === 'undefined') return fallback;
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value || fallback;
};

const getChartPalette = (count: number) => {
    const vars = ['--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5'];
    const fallbacks = ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ef4444'];
    return Array.from({ length: count }).map((_, idx) => getCssVar(vars[idx % vars.length], fallbacks[idx % fallbacks.length]));
};

const commonChartOptions = () => ({
    responsive: true,
    maintainAspectRatio: false as const,
    plugins: {
        legend: { labels: { color: getCssVar('--foreground', '#111827') } },
    },
    scales: {
        x: {
            grid: { color: getCssVar('--border', '#e5e7eb') },
            ticks: { color: getCssVar('--muted-foreground', '#6b7280') },
        },
        y: {
            grid: { color: getCssVar('--border', '#e5e7eb') },
            ticks: { color: getCssVar('--muted-foreground', '#6b7280') },
        },
    },
});

function Bars({ data, title }: { data: ChartDatum[]; title: string }) {
    if (!data.length) {
        return <p className="text-sm text-muted-foreground">Nema podataka za prikaz.</p>;
    }
    const labels = data.map((d) => d.label);
    const values = data.map((d) => Number(d.amount));
    const colors = getChartPalette(data.length);
    return (
        <div className="space-y-3">
            <p className="text-sm font-semibold">{title}</p>
            <div className="h-[280px]">
                <Bar
                    data={{
                        labels,
                        datasets: [
                            {
                                label: title,
                                data: values,
                                backgroundColor: colors,
                            },
                        ],
                    }}
                    options={{
                        ...commonChartOptions(),
                        plugins: {
                            ...commonChartOptions().plugins,
                            legend: { display: false },
                            tooltip: {
                                callbacks: {
                                    label: (ctx) => `${ctx.label}: ${formatMoney(Number(ctx.parsed.y))} KM`,
                                },
                            },
                        },
                        scales: {
                            ...commonChartOptions().scales,
                            y: {
                                ...commonChartOptions().scales.y,
                                ticks: {
                                    color: getCssVar('--muted-foreground', '#6b7280'),
                                    callback: (val) => formatMoney(Number(val as number)),
                                },
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
}

function PeriodBars({ data, title }: { data: PeriodDatum[]; title: string }) {
    if (!data.length) {
        return <p className="text-sm text-muted-foreground">Nema podataka za prikaz.</p>;
    }
    const labels = data.map((d) => (d.period.includes('-') ? d.period.split('-').reverse().join('.') : d.period));
    const values = data.map((d) => Number(d.total));
    const colors = getChartPalette(data.length);
    return (
        <div className="space-y-3">
            <p className="text-sm font-semibold">{title}</p>
            <div className="h-[280px]">
                <Bar
                    data={{
                        labels,
                        datasets: [
                            {
                                label: title,
                                data: values,
                                backgroundColor: colors,
                            },
                        ],
                    }}
                    options={{
                        ...commonChartOptions(),
                        plugins: {
                            ...commonChartOptions().plugins,
                            legend: { display: false },
                            tooltip: {
                                callbacks: {
                                    label: (ctx) => `${ctx.label}: ${formatMoney(Number(ctx.parsed.y))} KM`,
                                },
                            },
                        },
                        scales: {
                            ...commonChartOptions().scales,
                            y: {
                                ...commonChartOptions().scales.y,
                                ticks: {
                                    color: getCssVar('--muted-foreground', '#6b7280'),
                                    callback: (val) => formatMoney(Number(val as number)),
                                },
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
}

function PieChart({ data, title }: { data: ChartDatum[]; title: string }) {
    if (!data.length) {
        return <p className="text-sm text-muted-foreground">Nema podataka za prikaz.</p>;
    }
    const labels = data.map((d) => d.label);
    const values = data.map((d) => Number(d.amount));
    const colors = getChartPalette(data.length);
    return (
        <div className="space-y-3">
            <p className="text-sm font-semibold">{title}</p>
            <div className="h-[280px]">
                <Pie
                    data={{
                        labels,
                        datasets: [
                            {
                                label: title,
                                data: values,
                                backgroundColor: colors,
                            },
                        ],
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { labels: { color: getCssVar('--foreground', '#111827') } },
                            tooltip: {
                                callbacks: {
                                    label: (ctx) => `${ctx.label}: ${formatMoney(Number(ctx.parsed))} KM`,
                                },
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
}

export default function StatsIndex({
    filters,
    types,
    mode,
    userBreakdown,
    userTotal,
    userPeriods,
    overallBreakdown,
    overallTotal,
    overallPeriods,
    hasMember,
}: StatsProps) {
    const { props } = usePage();
    const balance = (props as any)?.accountBalance ?? 0;
    const { data, setData } = useForm({
        start_date: filters.start_date,
        end_date: filters.end_date,
        type: filters.type ?? 'all',
        mode: mode ?? 'payments',
    });

    const isExpenses = data.mode === 'expenses';
    const isAllTypes = data.type === 'all' || data.type === '' || data.type === undefined;
    const breakdownLabel = isExpenses ? 'Po vrsti rashoda' : 'Po vrsti uplate';
    const periodLabel = isExpenses ? 'Po periodu rashoda' : 'Po periodu uplata';

    type NextFilters = { start_date: string; end_date: string; type: string; mode: 'payments' | 'expenses' };

    const submitFilters = (next: NextFilters) => {
        router.get(
            route('stats.index'),
            {
                start_date: next.start_date,
                end_date: next.end_date,
                type: next.type === 'all' ? '' : next.type,
                mode: next.mode,
            },
            { preserveScroll: true, preserveState: false, replace: true }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Statistika" />
            <ContentHolder className="space-y-6">
                <Card className="border-l-4 border-l-emerald-500">
                    <CardHeader className="pb-2">
                        <CardTitle>Trenutno stanje računa</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-semibold">{formatMoney(Number(balance))} KM</p>
                        <p className="text-sm text-muted-foreground">Obračun: početno stanje + uplate - rashodi</p>
                    </CardContent>
                </Card>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Statistika</h1>
                    </div>
                    <form
                        className="grid grid-cols-1 gap-3 md:grid-cols-5 md:items-end"
                        onSubmit={(e) => {
                            e.preventDefault();
                            submitFilters(data as NextFilters);
                        }}
                    >
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-muted-foreground">Od datuma</label>
                            <Input
                                type="date"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-muted-foreground">Do datuma</label>
                            <Input
                                type="date"
                                value={data.end_date}
                                onChange={(e) => setData('end_date', e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-muted-foreground">Vrsta</label>
                            <Select
                                value={data.type}
                                onValueChange={(val) => setData('type', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sve vrste" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Sve vrste</SelectItem>
                                    {types.map((t) => (
                                        <SelectItem key={t} value={t}>
                                            {t}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-muted-foreground">Podaci</label>
                            <Select
                                value={data.mode}
                                onValueChange={(val: 'payments' | 'expenses') => setData('mode', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Tip podataka" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="payments">Uplate</SelectItem>
                                    <SelectItem value="expenses">Rashodi</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-2 md:justify-end">
                            <Button type="submit" variant="secondary" className="w-full md:w-auto">
                                Primijeni
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    const next = {
                                        start_date: filters.start_date,
                                        end_date: filters.end_date,
                                        type: 'all',
                                        mode: mode ?? 'payments',
                                    };
                                    setData(next);
                                    submitFilters(next);
                                }}
                                className="w-full md:w-auto"
                            >
                                Reset
                            </Button>
                        </div>
                    </form>
                </div>

                <Card className="mt-2">
                    <CardHeader>
                        <CardTitle>Lično (moji podaci)</CardTitle>
                        {isExpenses && <p className="text-sm text-muted-foreground">Lični pregled nije dostupan za rashode.</p>}
                        {!isExpenses && !hasMember && (
                            <p className="text-sm text-muted-foreground">Nema pridruženog člana za prikaz ličnih uplata.</p>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-5">
                        {!isExpenses && hasMember && (
                            <div className="grid gap-4 md:grid-cols-2">
                                <Bars data={userBreakdown} title={breakdownLabel} />
                                <PeriodBars data={userPeriods} title={periodLabel} />
                            </div>
                        )}
                        {!isExpenses && hasMember && (
                            <div className="text-sm font-semibold">Ukupno uplaćeno na račun: {formatMoney(userTotal)} KM</div>
                        )}
                    </CardContent>
                </Card>

                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>Cijeli džemat</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Bars data={overallBreakdown} title={breakdownLabel} />
                            {isAllTypes ? (
                                <PieChart data={overallBreakdown} title={isExpenses ? 'Rashodi po tipu' : 'Uplate po tipu'} />
                            ) : (
                                <PeriodBars data={overallPeriods} title={periodLabel} />
                            )}
                        </div>
                        <div className="text-sm font-semibold">
                            {isExpenses ? 'Ukupno' : 'Ukupno uplaćeno na račun'}: {formatMoney(overallTotal)} KM
                        </div>
                    </CardContent>
                </Card>
            </ContentHolder>
        </AppLayout>
    );
}
