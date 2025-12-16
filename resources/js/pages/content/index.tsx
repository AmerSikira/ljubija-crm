import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

type ContentItem = {
    id: number;
    title: string;
    description: string;
    description_preview?: string | null;
    type: 'dova' | 'hadis';
    type_label: string;
};

export default function ContentIndex({
    items,
}: {
    items: ContentItem[];
}) {
    const { props } = usePage();
    const role = (props as any)?.auth?.user?.role ?? '';
    const isAdmin = role === 'admin';

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Početna stranica', href: '/dashboard' },
        { title: 'Dove i hadisi', href: '/content-items' },
    ];

    const renderPreview = (item: ContentItem) => {
        if (item.description_preview) return item.description_preview;
        if (item.description.length > 180) {
            return `${item.description.slice(0, 180)}...`;
        }
        return item.description;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dove i hadisi" />
            <ContentHolder>
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Dove i hadisi</h1>
                    {isAdmin && (
                        <Button asChild>
                            <Link href={route('content-items.create')}>Dodaj novo</Link>
                        </Button>
                    )}
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Naslov</TableHead>
                                    <TableHead>Opis</TableHead>
                                    <TableHead className="w-32">Tip</TableHead>
                                    <TableHead className="w-40 text-right">Opcije</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                                            Nema unosa za prikaz.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.title}</TableCell>
                                            <TableCell className="text-muted-foreground">{renderPreview(item)}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{item.type_label}</Badge>
                                            </TableCell>
                                            <TableCell className="flex items-center justify-end gap-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={route('content-items.show', item.id)}>Pregled</Link>
                                                </Button>
                                                {isAdmin && (
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={route('content-items.edit', item.id)}>Uredi</Link>
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </ContentHolder>
        </AppLayout>
    );
}
