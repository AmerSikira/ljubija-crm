import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type Memorial = {
    id: number;
    full_name: string;
    status_label: string;
    birth_date?: string | null;
    status_date?: string | null;
    birth_place?: string | null;
    status_place?: string | null;
    short_info?: string | null;
    full_info?: string | null;
    family_info?: string | null;
    main_image_url?: string | null;
    gallery_urls?: string[];
    published: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Početna stranica', href: '/dashboard' },
    { title: 'Memorijal', href: '/memorials' },
];

export default function MemorialShow({ memorial, isAdmin }: { memorial: Memorial; isAdmin: boolean }) {
    const images = [memorial.main_image_url, ...(memorial.gallery_urls ?? [])].filter(Boolean);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index >= images.length) setIndex(0);
    }, [images.length, index]);

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: memorial.full_name, href: `/memorials/${memorial.id}` }]}>
            <Head title={`Memorijal - ${memorial.full_name}`} />
            <ContentHolder className="space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">{memorial.full_name}</h1>
                    <Badge>{memorial.status_label}</Badge>
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

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ključne informacije</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <InfoItem label="Datum rođenja" value={memorial.birth_date} />
                            <InfoItem label="Status" value={memorial.status_label} />
                            <InfoItem label="Datum smrti ili nestanka" value={memorial.status_date} />
                            <InfoItem label="Mjesto rođenja" value={memorial.birth_place} />
                            <InfoItem label="Mjesto smrti ili nestanka" value={memorial.status_place} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Kratke informacije</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground whitespace-pre-line">{memorial.short_info || 'Nema unosa.'}</p>
                        </CardContent>
                    </Card>

                    {memorial.full_info && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Detalji</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="whitespace-pre-line leading-relaxed">{memorial.full_info}</p>
                            </CardContent>
                        </Card>
                    )}

                    {memorial.family_info && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Porodica</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="whitespace-pre-line leading-relaxed">{memorial.family_info}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <Button variant="ghost" asChild>
                        <Link href={route('memorials.index')}>Nazad na Memorijal</Link>
                    </Button>
                    {isAdmin && (
                        <div className="flex gap-2">
                            <Button variant="outline" asChild>
                                <Link href={route('memorials.edit', memorial.id)}>Uredi</Link>
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => router.delete(route('memorials.destroy', memorial.id))}
                            >
                                Obriši
                            </Button>
                        </div>
                    )}
                </div>
            </ContentHolder>
        </AppLayout>
    );
}

function InfoItem({ label, value }: { label: string; value?: string | null }) {
    return (
        <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="font-semibold">{value || '-'}</span>
        </div>
    );
}
