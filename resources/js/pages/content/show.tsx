import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

type ContentItem = {
    id: number;
    title: string;
    description: string;
    type: 'dova' | 'hadis';
    type_label: string;
};

export default function ContentShow({ item }: { item: ContentItem }) {
    const { props } = usePage();
    const role = (props as any)?.auth?.user?.role ?? '';
    const isAdmin = role === 'admin';

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Početna stranica', href: '/dashboard' },
        { title: 'Dove i hadisi', href: '/content-items' },
        { title: 'Pregled', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Dove i hadisi - ${item.title}`} />
            <ContentHolder>
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold">{item.title}</h1>
                        <Badge variant="secondary">{item.type_label}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        {isAdmin && (
                            <Button variant="outline" asChild>
                                <Link href={route('content-items.edit', item.id)}>Uredi</Link>
                            </Button>
                        )}
                        <Button variant="ghost" asChild>
                            <Link href={route('content-items.index')}>Nazad na listu</Link>
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Opis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="whitespace-pre-line leading-relaxed">{item.description}</p>
                    </CardContent>
                </Card>
            </ContentHolder>
        </AppLayout>
    );
}
