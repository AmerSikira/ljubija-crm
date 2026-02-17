import { useEffect, useState, useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import ContentHolder from "@/components/content-holder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Početna stranica', href: '/dashboard' },
    { title: 'Vijesti', href: '/articles' },
    { title: 'Pregled vijesti', href: '#' },
];

export default function Show({ article }: any) {
    const images = useMemo(() => {
        const galleryOnly = (article.gallery_urls ?? []).filter(Boolean);
        return article.image_url ? [article.image_url, ...galleryOnly] : galleryOnly;
    }, [article.image_url, article.gallery_urls]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index >= images.length) setIndex(0);
    }, [images.length, index]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vijesti" />
            <ContentHolder className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
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
                                        {images.map((_: string, idx: number) => (
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

                        <div
                            className="prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: article.intro }}
                        />
                        <div
                            className="prose prose-sm max-w-none article-content"
                            dangerouslySetInnerHTML={{ __html: article.main_text }}
                        />
                    </CardContent>
                </Card>
            </ContentHolder>
        </AppLayout>
    );
}
