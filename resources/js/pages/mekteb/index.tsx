import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

type MektebEntry = {
    id: number;
    title: string;
    short_description: string;
    main_image_url?: string | null;
    published: boolean;
};

export default function MektebIndex({ entries, isAdmin }: { entries: MektebEntry[]; isAdmin: boolean }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Početna stranica', href: '/dashboard' },
        { title: 'Mekteb', href: '/mekteb' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mekteb" />
            <ContentHolder>
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Mekteb</h1>
                    {isAdmin && (
                        <Button asChild>
                            <Link href={route('mekteb.create')}>Dodaj novu objavu</Link>
                        </Button>
                    )}
                </div>

                {entries.length === 0 ? (
                    <p className="text-muted-foreground">Nema objava za prikaz.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {entries.map((entry) => (
                            <Card key={entry.id} className={!entry.published ? 'border-dashed' : ''}>
                                <CardContent className="p-0">
                                    {entry.main_image_url ? (
                                        <img
                                            src={entry.main_image_url}
                                            alt={entry.title}
                                            className="h-48 w-full rounded-t-md object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-48 items-center justify-center rounded-t-md bg-muted text-muted-foreground">
                                            Nema slike
                                        </div>
                                    )}
                                    <div className="space-y-2 p-4">
                                        <h3 className="text-lg font-semibold">{entry.title}</h3>
                                        <p className="text-sm text-muted-foreground">{entry.short_description}</p>
                                        {!entry.published && isAdmin && (
                                            <p className="text-xs font-semibold text-amber-600">Nije objavljeno</p>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between p-4">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={route('mekteb.show', entry.id)}>Više informacija</Link>
                                    </Button>
                                    {isAdmin && (
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={route('mekteb.edit', entry.id)}>Uredi</Link>
                                        </Button>
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
