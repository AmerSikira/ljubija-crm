import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Member } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
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
                    <CardContent>
                        {filteredArticles.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {filteredArticles.map((article: any) => (
                                    <Card key={article.id} className="overflow-hidden">
                                        <Link href={route('articles.show', { article: article.id })}>
                                            <img
                                                src={article.image_url}
                                                className="h-44 w-full object-cover"
                                                alt={article.title ?? 'Vijest'}
                                            />
                                        </Link>
                                        <CardContent className="space-y-3 p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <Link
                                                    href={route('articles.show', { article: article.id })}
                                                    className="line-clamp-2 font-semibold hover:underline"
                                                >
                                                    {article.title}
                                                </Link>
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
                                            </div>

                                            <div
                                                className="line-clamp-3 text-sm text-muted-foreground"
                                                dangerouslySetInnerHTML={{ __html: article.intro ?? '' }}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                {article.created_at ? formatDateEU(article.created_at) : '-'}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <p className="py-6 text-center text-muted-foreground">
                                {search || date ? 'Nema rezultata pretrage' : 'Nema vijesti'}
                            </p>
                        )}
                    </CardContent>
                </Card>
            </ContentHolder>
        </AppLayout>
    );
}
