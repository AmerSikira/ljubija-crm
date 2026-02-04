import React from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Member } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import ContentHolder from "@/components/content-holder";
import { PlusIcon } from "lucide-react";
import { ActionsMenu } from "@/components/actions-menu";
import { Input } from "@/components/ui/input";
import { formatDateEU } from "@/lib/utils";


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
    const truncate = (value: string, max = 140) =>
        value.length > max ? `${value.slice(0, max).trim()}…` : value;

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
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex flex-1 flex-wrap items-center gap-3">
                        <Input
                            placeholder="Pretraga po naslovu ili sadržaju..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="min-w-[220px] flex-1"
                        />
                        <Input
                            type="date"
                            value={date}
                            onChange={(event) => setDate(event.target.value)}
                            className="w-[170px]"
                        />
                        {(search || date) && (
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    setSearch('');
                                    setDate('');
                                }}
                            >
                                Resetuj
                            </Button>
                        )}
                    </div>
                    {isManager && (
                        <Button asChild>
                            <Link href={route('articles.create')}>
                                <PlusIcon className="w-4 h-4 mr-2" />
                                Dodaj vijest
                            </Link>
                        </Button>
                    )}
                </div>
                <Table className="mt-4 overflow-hidden rounded-lg border">
                    <TableHeader>
                        <TableRow className="bg-muted/40">
                            <TableHead>ID</TableHead>
                            <TableHead>Slika</TableHead>
                            <TableHead>Naslov</TableHead>
                            <TableHead>Uvod</TableHead>
                            <TableHead>Datum</TableHead>
                            <TableHead className="text-right">Akcije</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            filteredArticles.length > 0 ? (
                                filteredArticles.map((article: any, index: number) => {
                                    return (
                                        <TableRow key={index} className="hover:bg-muted/40">
                                            <TableCell>{article.id}</TableCell>
                                            <TableCell>
                                                <img
                                                    src={article.image_url}
                                                    className="h-16 w-16 rounded-md object-cover"
                                                    alt={article.title ?? 'Vijest'}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{article.title}</TableCell>
                                            <TableCell className="max-w-[360px] text-sm text-muted-foreground">
                                                {truncate(stripHtml(article.intro))}
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
                            )
                        }
                    </TableBody>
                </Table>
            </ContentHolder>

        </AppLayout>
    );
}
