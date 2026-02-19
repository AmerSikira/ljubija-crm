import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import ContentHolder from '@/components/content-holder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

    const formatPublishedDate = (value?: string) => {
        if (!value) return '';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const introPreview = (value?: string) => {
        if (!value) return '';
        const plain = value.replace(/<[^>]*>/g, '').trim();
        if (plain.length <= 160) return plain;
        return `${plain.slice(0, 160)}...`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Početna stranica" />
            <ContentHolder className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Trenutna vremena</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                            {cities.map((city) => (
                                <div
                                    key={city.label}
                                    className={`flex items-center justify-between rounded-md border px-3 py-2 ${
                                        city.label === 'Ljubija'
                                            ? 'border-primary/40 bg-primary/10'
                                            : 'bg-background'
                                    }`}
                                >
                                    <div className="text-sm font-medium">{city.label}</div>
                                    <div className="text-lg font-semibold tabular-nums">{formatTime(city.tz)}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <CardTitle>Uputa dana</CardTitle>
                        </div>
                        {daily_content?.type_label && (
                            <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                {daily_content.type_label}
                            </span>
                        )}
                    </CardHeader>
                    <CardContent>
                    {daily_content ? (
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold">{daily_content.title}</h3>
                            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{daily_content.description}</p>
                        </div>
                    ) : (
                        <p className="text-muted-foreground">Nema dostupne upute za prikaz.</p>
                    )}
                    </CardContent>
                </Card>

                <div className="flex items-center justify-between">
                    <h1 className="font-bold text-2xl">Vijesti iz džemata</h1>
                    {articles.length > 0 && (
                        <Button asChild variant="outline" className="hidden sm:inline-flex">
                            <Link href={route('articles')}>
                                Sve vijesti
                            </Link>
                        </Button>
                    )}
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {articles.length === 0 && (
                        <div className="sm:col-span-2 xl:col-span-3 2xl:col-span-4">
                            <div className="flex h-48 w-full items-center justify-center rounded-lg border text-muted-foreground">
                                Ovdje će biti objavljene vijesti
                            </div>
                        </div>
                    )}

                    {articles.map((article: any) => (
                        <Link href={route('articles.show', { article: article.id })} key={article.id} className="block h-full">
                            <div className="flex h-full flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md">
                                {article.image_url ? (
                                    <img
                                        src={article.image_url}
                                        alt={article.title}
                                        className="h-44 w-full object-cover sm:h-48"
                                    />
                                ) : (
                                    <div className="flex h-44 w-full items-center justify-center bg-muted sm:h-48">
                                        <span className="text-muted-foreground">Nema slike</span>
                                    </div>
                                )}
                                <div className="px-4 pt-2 text-xs text-muted-foreground">
                                    {formatPublishedDate(article.created_at)}
                                </div>
                                <div className="flex flex-1 flex-col p-4">
                                    <h2 className="mb-2 text-lg font-bold leading-tight">{article.title}</h2>
                                    <p className="text-sm text-foreground/80">
                                        {introPreview(article.intro)}
                                    </p>
                                </div>
                            </div>
                        </Link>
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
