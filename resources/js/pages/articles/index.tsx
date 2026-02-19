import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Member } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import ContentHolder from '@/components/content-holder';
import { ActionsMenu } from '@/components/actions-menu';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateEU } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Početna stranica',
        href: '/dashboard',
    },
    {
        title: 'Vijesti',
        href: '/articles',
    },
];

export default function Index({ articles }: Member[] | any) {
    const { props } = usePage();
    const role = (props as any)?.auth?.user?.role ?? '';
    const isAdmin = role === 'admin';
    const isManager = role === 'admin' || role === 'manager';
    const [search, setSearch] = React.useState('');
    const [date, setDate] = React.useState('');

    const stripHtml = (value?: string) => (value ? value.replace(/<[^>]*>/g, '') : '');
    const filteredArticles = React.useMemo(() => {
        const query = search.trim().toLowerCase();
        return (articles ?? []).filter((article: any) => {
            const title = (article.title ?? '').toLowerCase();
            const intro = stripHtml(article.intro ?? '').toLowerCase();
            const main = stripHtml(article.main_text ?? '').toLowerCase();
            const matchesQuery =
                !query ||
                title.includes(query) ||
                intro.includes(query) ||
                main.includes(query);

            const articleDate = (article.created_at ?? '').slice(0, 10);
            const matchesDate = !date || articleDate === date;

            return matchesQuery && matchesDate;
        });
    }, [articles, date, search]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vijesti" />
            <ContentHolder>
                <Card>
                    <CardHeader className="space-y-3">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <CardTitle>Vijesti</CardTitle>
                            {isManager && (
                                <Button asChild>
                                    <Link href={route('articles.create')}>Dodaj novo</Link>
                                </Button>
                            )}
                        </div>
                        <form
                            className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:items-center"
                            onSubmit={(e) => {
                                e.preventDefault();
                            }}
                        >
                            <Input
                                placeholder="Pretraga po naslovu ili sadržaju..."
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                            />
                            <Input
                                type="date"
                                value={date}
                                onChange={(event) => setDate(event.target.value)}
                            />
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="secondary"
                                    type="submit"
                                    className="w-full sm:w-auto"
                                >
                                    Pretraži
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full sm:w-auto"
                                    onClick={() => {
                                        setSearch('');
                                        setDate('');
                                    }}
                                >
                                    Reset
                                </Button>
                            </div>
                        </form>
                    </CardHeader>
                    <CardContent className="p-0 pt-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Slika</TableHead>
                                    <TableHead>Naslov</TableHead>
                                    <TableHead>Uvod</TableHead>
                                    <TableHead>Datum</TableHead>
                                    <TableHead className="w-40 text-right">Opcije</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredArticles.length > 0 ? (
                                    filteredArticles.map((article: any) => {
                                        return (
                                            <TableRow key={article.id}>
                                                <TableCell>{article.id}</TableCell>
                                                <TableCell>
                                                    <Link href={route('articles.show', { article: article.id })}>
                                                        <img
                                                            src={article.image_url}
                                                            className="h-16 w-16 rounded-md object-cover"
                                                            alt={article.title ?? 'Vijest'}
                                                        />
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    <Link href={route('articles.show', { article: article.id })} className="hover:underline">
                                                        {article.title}
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="max-w-[360px] text-sm text-muted-foreground">
                                                    <div
                                                        className="max-h-20 overflow-hidden"
                                                        dangerouslySetInnerHTML={{ __html: article.intro ?? '' }}
                                                    />
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                                                    {article.created_at ? formatDateEU(article.created_at) : '-'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <ActionsMenu
                                                        actions={[
                                                            {
                                                                type: 'item',
                                                                label: 'Detalji',
                                                                href: route('articles.show', { article: article.id }),
                                                            },
                                                            ...(isManager
                                                                ? [
                                                                    {
                                                                        type: 'item' as const,
                                                                        label: 'Uredi',
                                                                        href: route('articles.edit', { article: article.id }),
                                                                    },
                                                                ]
                                                                : []),
                                                            ...(isAdmin
                                                                ? [
                                                                    { type: 'separator' as const },
                                                                    {
                                                                        type: 'item' as const,
                                                                        label: 'Obriši',
                                                                        variant: 'destructive',
                                                                        onSelect: () =>
                                                                            router.delete(route('articles.destroy', { article: article.id })),
                                                                    },
                                                                ]
                                                                : []),
                                                        ]}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                                            {search || date ? 'Nema rezultata pretrage' : 'Nema vijesti'}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </ContentHolder>
        </AppLayout>
    );
}
