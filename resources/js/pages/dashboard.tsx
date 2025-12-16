import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import ContentHolder from "@/components/content-holder";
import { useEffect, useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Početna stranica',
        href: '/dashboard',
    },
];

export default function Dashboard({articles} : any) {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 30000);
        return () => clearInterval(id);
    }, []);

    const cities = useMemo(
        () => [
            { label: 'Pert', tz: 'Australia/Perth' },
            { label: 'Sidnej', tz: 'Australia/Sydney' },
            { label: 'San Francisko', tz: 'America/Los_Angeles' },
            { label: 'Čikago', tz: 'America/Chicago' },
            { label: 'Njujork', tz: 'America/New_York' },
            { label: 'London', tz: 'Europe/London' },
            { label: 'Ljubija', tz: 'Europe/Sarajevo' },
            { label: 'Istanbul', tz: 'Europe/Istanbul' },
            { label: 'Meka', tz: 'Asia/Riyadh' },
            { label: 'Damask', tz: 'Asia/Damascus' },
            { label: 'Tokio', tz: 'Asia/Tokyo' },
            { label: 'Moskva', tz: 'Europe/Moscow' },
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
                                    className="flex items-center justify-between rounded-md border bg-background px-3 py-2 shadow-xs"
                                >
                                    <div className="text-sm font-medium">{city.label}</div>
                                    <div className="text-lg font-semibold tabular-nums">{formatTime(city.tz)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <h1 className="mb-4 font-bold text-2xl">Vijesti iz džemata</h1>
                <div className="grid grid-cols-5">
            {articles.length === 0 && (
                <div className="col-span-5">
                    <div className="h-48 w-full border rounded-lg flex items-center justify-center text-gray-600">
                        Ovdje će biti objavljene vijesti
                    </div>
                </div>
            )}

            {articles.map((article: any) => (
                <a href={`/articles/show/${article.id}`} key={article.id} className="p-4">
                    <div className="border rounded-lg overflow-hidden shadow-lg">
                        {article.image_url ? (
                            <img
                                src={article.image_url}
                                alt={article.title}
                                className="w-full h-48 object-cover"
                            />
                        ) : (
                            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">Nema slike</span>
                            </div>
                        )}
                        <div className="p-4">
                            <h2 className="font-bold text-xl mb-2">{article.title}</h2>
                            <p className="text-gray-700 text-base">
                                {article.intro.length > 100 ? article.intro.substring(0, 100) + '...' : article.intro}
                            </p>
                        </div>
                    </div>
                </a>
            ))}
           </div>
            {articles.length > 0 && (
                <div className="flex justify-center">
                    <Button asChild>
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
