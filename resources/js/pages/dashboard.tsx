import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import ContentHolder from '@/components/content-holder';
import { useEffect, useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Početna stranica',
        href: '/dashboard',
    },
];

export default function Dashboard({ articles, daily_content }: any) {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 30000);
        return () => clearInterval(id);
    }, []);

    const cities = useMemo(
        () => [
            { label: 'San Francisco', tz: 'America/Los_Angeles' },
            { label: 'Chicago', tz: 'America/Chicago' },
            { label: 'New York', tz: 'America/New_York' },
            { label: 'London', tz: 'Europe/London' },
            { label: 'Ljubija', tz: 'Europe/Sarajevo' },
            { label: 'Cairo', tz: 'Africa/Cairo' },
            { label: 'Mecca', tz: 'Asia/Riyadh' },
            { label: 'Karachi', tz: 'Asia/Karachi' },
            { label: 'Kuala Lumpur', tz: 'Asia/Kuala_Lumpur' },
            { label: 'Perth', tz: 'Australia/Perth' },
            { label: 'Tokyo', tz: 'Asia/Tokyo' },
            { label: 'Sydney', tz: 'Australia/Sydney' },
        ],
        []
    );

    const formatTime = (timeZone: string) =>
        new Intl.DateTimeFormat('bs-BA', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone,
        }).format(now);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Početna stranica" />
            <ContentHolder>
                <div className="mb-6 space-y-2">
                    <div className="rounded-lg border bg-card p-3 shadow-sm">
                        <h2 className="mb-2 text-lg font-semibold">Trenutna vremena</h2>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                            {cities.map((city) => (
                                <div
                                    key={city.label}
                                    className={`flex items-center justify-between rounded-md border px-3 py-2 shadow-xs ${
                                        city.label === 'Ljubija'
                                            ? 'border-primary/30 bg-primary/5'
                                            : 'bg-background'
                                    }`}
                                >
                                    <div className="text-sm font-medium">{city.label}</div>
                                    <div className="text-lg font-semibold tabular-nums">{formatTime(city.tz)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mb-8 rounded-lg border bg-card p-4 shadow-sm">
                    <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-xl font-semibold">Uputa dana</h2>
                        {daily_content?.type_label && (
                            <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                {daily_content.type_label}
                            </span>
                        )}
                    </div>
                    {daily_content ? (
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold">{daily_content.title}</h3>
                            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{daily_content.description}</p>
                        </div>
                    ) : (
                        <p className="text-muted-foreground">Nema dostupne upute za prikaz.</p>
                    )}
                </div>
                <h1 className="mb-4 font-bold text-2xl">Vijesti iz džemata</h1>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {articles.length === 0 && (
                        <div className="sm:col-span-2 xl:col-span-3 2xl:col-span-4">
                            <div className="flex h-48 w-full items-center justify-center rounded-lg border text-gray-600">
                                Ovdje će biti objavljene vijesti
                            </div>
                        </div>
                    )}

                    {articles.map((article: any) => (
                        <a href={`/articles/show/${article.id}`} key={article.id} className="block">
                            <div className="overflow-hidden rounded-lg border shadow-lg">
                                {article.image_url ? (
                                    <img
                                        src={article.image_url}
                                        alt={article.title}
                                        className="h-48 w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-48 w-full items-center justify-center bg-gray-200">
                                        <span className="text-gray-500">Nema slike</span>
                                    </div>
                                )}
                                <div className="p-4">
                                    <h2 className="mb-2 text-xl font-bold">{article.title}</h2>
                                    <div
                                        className="max-h-24 overflow-hidden text-base text-gray-700"
                                        dangerouslySetInnerHTML={{ __html: article.intro ?? '' }}
                                    />
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
                {articles.length > 0 && (
                    <div className="mt-6 flex justify-center">
                        <Button asChild className="w-full sm:w-auto">
                            <Link href={route('articles')}>
                                Pogledaj sve vijesti
                            </Link>
                        </Button>
                    </div>
                )}
                <hr className="my-6" />
            </ContentHolder>
        </AppLayout>
    );
}
