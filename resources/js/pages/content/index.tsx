import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ActionsMenu } from '@/components/actions-menu';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';

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
    filters,
}: {
    items: ContentItem[];
    filters?: { search?: string; type?: string };
}) {
    const { props } = usePage();
    const role = (props as any)?.auth?.user?.role ?? '';
    const isAdmin = role === 'admin';
    const { data, setData } = useForm({
        search: filters?.search ?? '',
        type: (filters?.type as 'dova' | 'hadis' | '') ?? '',
    });

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
                <div className="mb-4 space-y-3">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <h1 className="text-2xl font-bold">Dove i hadisi</h1>
                        {isAdmin && (
                            <Button asChild>
                                <Link href={route('content-items.create')}>Dodaj novo</Link>
                            </Button>
                        )}
                    </div>

                    <form
                        className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:items-center"
                        onSubmit={(e) => {
                            e.preventDefault();
                            router.get(
                                route('content-items.index'),
                                { search: data.search, type: data.type === 'all' ? '' : data.type },
                                { preserveScroll: true, preserveState: true }
                            );
                        }}
                    >
                        <Input
                            placeholder="Pretraga po naslovu ili opisu"
                            value={data.search}
                            onChange={(e) => setData('search', e.target.value)}
                        />
                        <Select
                            value={data.type}
                            onValueChange={(value) => setData('type', value as 'dova' | 'hadis' | 'all')}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Svi tipovi" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Svi tipovi</SelectItem>
                                <SelectItem value="dova">Dova</SelectItem>
                                <SelectItem value="hadis">Hadis</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="flex items-center gap-2">
                            <Button type="submit" variant="secondary" className="w-full sm:w-auto">
                                Pretraži
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full sm:w-auto"
                                onClick={() => {
                                    setData({ search: '', type: 'all' });
                                    router.get(route('content-items.index'), {}, { preserveScroll: true });
                                }}
                            >
                                Reset
                            </Button>
                        </div>
                    </form>
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
                                            <TableCell className="text-right">
                                                <ActionsMenu
                                                    actions={[
                                                        {
                                                            type: 'item',
                                                            label: 'Detalji',
                                                            href: route('content-items.show', item.id),
                                                        },
                                                        ...(isAdmin
                                                            ? [
                                                                {
                                                                    type: 'item' as const,
                                                                    label: 'Uredi',
                                                                    href: route('content-items.edit', item.id),
                                                                },
                                                                { type: 'separator' as const },
                                                                {
                                                                    type: 'item' as const,
                                                                    label: 'Obriši',
                                                                    variant: 'destructive',
                                                                    onSelect: () => router.delete(route('content-items.destroy', item.id)),
                                                                },
                                                            ]
                                                            : []),
                                                    ]}
                                                />
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
