import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';

type Memorial = {
    id: number;
    full_name: string;
    status_label: string;
    status_date?: string | null;
    short_info_preview?: string | null;
    main_image_url?: string | null;
    published: boolean;
};

export default function MemorialsIndex({ memorials }: { memorials: Memorial[] }) {
    const { props } = usePage();
    const role = (props as any)?.auth?.user?.role ?? '';
    const isAdmin = role === 'admin';

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Početna stranica', href: '/dashboard' },
        { title: 'Memorijal', href: '/memorials' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Memorijal" />
            <ContentHolder>
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Memorijal</h1>
                    {isAdmin && (
                        <Button asChild>
                            <Link href={route('memorials.create')}>Dodaj osobu</Link>
                        </Button>
                    )}
                </div>

                {memorials.length === 0 ? (
                    <p className="text-muted-foreground">Nema zapisa za prikaz.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {memorials.map((m) => (
                            <Card key={m.id} className={!m.published ? 'border-dashed' : ''}>
                                <CardContent className="p-0">
                                    {m.main_image_url ? (
                                        <img
                                            src={m.main_image_url}
                                            alt={m.full_name}
                                            className="h-52 w-full rounded-t-md object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-52 items-center justify-center rounded-t-md bg-muted text-muted-foreground">
                                            Nema slike
                                        </div>
                                    )}
                                    <div className="space-y-2 p-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold">{m.full_name}</h3>
                                            <Badge>{m.status_label}</Badge>
                                        </div>
                                        {m.status_date && <p className="text-sm text-muted-foreground">{m.status_date}</p>}
                                        <p className="text-sm text-muted-foreground">{m.short_info_preview || '...'}</p>
                                        {!m.published && isAdmin && (
                                            <p className="text-xs font-semibold text-amber-600">Nije objavljeno</p>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between p-4">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={route('memorials.show', m.id)}>Više informacija</Link>
                                    </Button>
                                    {isAdmin && (
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={route('memorials.edit', m.id)}>Uredi</Link>
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => router.delete(route('memorials.destroy', m.id))}
                                            >
                                                Obriši
                                            </Button>
                                        </div>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </ContentHolder>
        </AppLayout>
    );
}
