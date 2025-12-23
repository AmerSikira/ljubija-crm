import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

type DzematPage = {
    id: number;
    title: string;
    content: string;
    gallery_urls: string[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Početna stranica', href: '/dashboard' },
    { title: 'Džemat Ljubija', href: '/dzemat' },
];

export default function DzematIndex({ page }: { page: DzematPage | null }) {
    const { props } = usePage();
    const role = (props as any)?.auth?.user?.role ?? '';
    const isAdmin = role === 'admin';
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const gallery = page?.gallery_urls ?? [];

    useEffect(() => {
        if (activeIndex >= gallery.length) {
            setActiveIndex(0);
        }
    }, [activeIndex, gallery.length]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Džemat Ljubija" />
            <ContentHolder className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">{page?.title ?? 'Džemat Ljubija'}</h1>
                    {isAdmin && (
                        <Button asChild>
                            <Link href={route('dzemat.edit')}>Uredi</Link>
                        </Button>
                    )}
                </div>

                {page ? (
                    <>
                        {gallery.length ? (
                            <div className="space-y-3">
                                <button
                                    type="button"
                                    className="w-full overflow-hidden rounded-md border"
                                    onClick={() => setLightboxOpen(true)}
                                >
                                    <img
                                        src={gallery[activeIndex]}
                                        alt={`Galerija ${activeIndex + 1}`}
                                        className="h-72 w-full object-cover sm:h-80 md:h-96"
                                    />
                                </button>
                                <div className="flex gap-2 overflow-x-auto pb-1">
                                    {gallery.map((url, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setActiveIndex(idx)}
                                            className={`overflow-hidden rounded-md border ${idx === activeIndex ? 'ring-2 ring-primary' : ''}`}
                                        >
                                            <img
                                                src={url}
                                                alt={`Galerija ${idx + 1}`}
                                                className="h-16 w-24 object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        <div
                            className="prose prose-sm max-w-none article-content"
                            dangerouslySetInnerHTML={{ __html: page.content }}
                        />

                        {lightboxOpen && gallery.length > 0 && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                                <button
                                    type="button"
                                    className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1 text-white hover:bg-white/30"
                                    onClick={() => setLightboxOpen(false)}
                                >
                                    Zatvori
                                </button>
                                {gallery.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 px-3 py-2 text-white hover:bg-white/30"
                                            onClick={() =>
                                                setActiveIndex((prev) => (prev - 1 + gallery.length) % gallery.length)
                                            }
                                        >
                                            ‹
                                        </button>
                                        <button
                                            type="button"
                                            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 px-3 py-2 text-white hover:bg-white/30"
                                            onClick={() => setActiveIndex((prev) => (prev + 1) % gallery.length)}
                                        >
                                            ›
                                        </button>
                                    </>
                                )}
                                <img
                                    src={gallery[activeIndex]}
                                    alt={`Galerija ${activeIndex + 1}`}
                                    className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-muted-foreground">Nema podataka za prikaz.</p>
                )}
            </ContentHolder>
        </AppLayout>
    );
}
