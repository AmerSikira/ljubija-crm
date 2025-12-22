import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

type MektebEntry = {
    id: number;
    title: string;
    short_description: string;
    full_description: string;
    main_image_url?: string | null;
    gallery_urls?: string[];
    published: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Početna stranica', href: '/dashboard' },
    { title: 'Mekteb', href: '/mekteb' },
];

export default function MektebShow({ entry, isAdmin }: { entry: MektebEntry; isAdmin: boolean }) {
    const images = [entry.main_image_url, ...(entry.gallery_urls ?? [])].filter(Boolean);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index >= images.length) setIndex(0);
    }, [images.length, index]);

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: entry.title, href: `/mekteb/${entry.id}` }]}>
            <Head title={`Mekteb - ${entry.title}`} />
            <ContentHolder className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">{entry.title}</h1>
                    {isAdmin && !entry.published && <span className="text-sm font-semibold text-amber-600">Nije objavljeno</span>}
                </div>

                {images.length > 0 && (
                    <div className="space-y-2">
                        <div className="relative flex items-center justify-center rounded-lg border bg-muted/20 p-3">
                            <img
                                src={images[index]}
                                alt={`Slika ${index + 1}`}
                                className="h-72 w-full rounded-md object-cover md:h-96"
                            />
                            {images.length > 1 && (
                                <>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        className="absolute left-3 top-1/2 -translate-y-1/2"
                                        onClick={() => setIndex((prev) => (prev - 1 + images.length) % images.length)}
                                    >
                                        ‹
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        className="absolute right-3 top-1/2 -translate-y-1/2"
                                        onClick={() => setIndex((prev) => (prev + 1) % images.length)}
                                    >
                                        ›
                                    </Button>
                                </>
                            )}
                        </div>
                        {images.length > 1 && (
                            <div className="flex justify-center gap-2">
                                {images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setIndex(idx)}
                                        className={`h-2 w-2 rounded-full ${idx === index ? 'bg-primary' : 'bg-muted-foreground/50'}`}
                                        aria-label={`Prikaži sliku ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <Card>
                    <CardContent className="space-y-3">
                        <p className="font-semibold text-lg">Kratki opis</p>
                        <p className="text-muted-foreground whitespace-pre-line">{entry.short_description}</p>
                        <div className="pt-2">
                            <p className="font-semibold text-lg mb-2">Puni opis</p>
                            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: entry.full_description }} />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-between">
                    <Button variant="ghost" asChild>
                        <Link href={route('mekteb.index')}>Nazad na Mekteb</Link>
                    </Button>
                    {isAdmin && (
                        <div className="flex gap-2">
                            <Button variant="outline" asChild>
                                <Link href={route('mekteb.edit', entry.id)}>Uredi</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </ContentHolder>
        </AppLayout>
    );
}
