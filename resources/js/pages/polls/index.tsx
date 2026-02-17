import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import ContentHolder from '@/components/content-holder';
import { ActionsMenu } from '@/components/actions-menu';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type PollItem = {
    id: number;
    title: string;
    votes_count: number;
};

type Poll = {
    id: number;
    title: string;
    description?: string | null;
    votes_count?: number;
    items?: PollItem[];
    finished_at?: string | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Početna stranica',
        href: '/dashboard',
    },
    {
        title: 'Ankete',
        href: '/polls',
    },
];

export default function Index({ polls }: { polls: Poll[] }) {
    const { props } = usePage();
    const role = (props as any)?.auth?.user?.role ?? '';
    const isAdmin = role === 'admin';
    const isManager = role === 'admin' || role === 'manager';
    const [search, setSearch] = React.useState('');

    const filteredPolls = React.useMemo(() => {
        const query = search.trim().toLowerCase();
        return (polls ?? []).filter((poll) => {
            const title = (poll.title ?? '').toLowerCase();
            const description = (poll.description ?? '').toLowerCase();
            return !query || title.includes(query) || description.includes(query);
        });
    }, [polls, search]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ankete" />
            <ContentHolder>
                <div className="mb-4 space-y-3">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <h1 className="text-2xl font-bold">Ankete</h1>
                        {isManager && (
                            <Button asChild>
                                <Link href={route('polls.create')}>Dodaj novo</Link>
                            </Button>
                        )}
                    </div>

                    <form
                        className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:items-center"
                        onSubmit={(event) => event.preventDefault()}
                    >
                        <Input
                            placeholder="Pretraga po nazivu ili opisu"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />

                        <div className="flex items-center gap-2">
                            <Button type="submit" variant="secondary" className="w-full sm:w-auto">
                                Pretraži
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full sm:w-auto"
                                onClick={() => setSearch('')}
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
                                    <TableHead>ID</TableHead>
                                    <TableHead>Naziv</TableHead>
                                    <TableHead>Opis</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Broj opcija</TableHead>
                                    <TableHead>Ukupno glasova</TableHead>
                                    <TableHead className="w-40 text-right">Opcije</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPolls.length > 0 ? (
                                    filteredPolls.map((poll) => (
                                        <TableRow key={poll.id}>
                                            <TableCell>{poll.id}</TableCell>
                                            <TableCell>{poll.title}</TableCell>
                                            <TableCell className="max-w-xs truncate">{poll.description}</TableCell>
                                            <TableCell className="font-semibold">
                                                {poll.finished_at ? 'Završena' : 'Aktivna'}
                                            </TableCell>
                                            <TableCell>{poll.items?.length ?? 0}</TableCell>
                                            <TableCell>{poll.votes_count ?? 0}</TableCell>
                                            <TableCell className="text-right">
                                                <ActionsMenu
                                                    actions={[
                                                        {
                                                            type: 'item',
                                                            label: 'Detalji',
                                                            href: route('polls.show', { poll: poll.id }),
                                                        },
                                                        ...(isManager
                                                            ? [
                                                                {
                                                                    type: 'item' as const,
                                                                    label: 'Uredi',
                                                                    href: route('polls.edit', { poll: poll.id }),
                                                                    disabled: !!poll.finished_at,
                                                                },
                                                            ]
                                                            : []),
                                                        ...(isAdmin && !poll.finished_at
                                                            ? [
                                                                { type: 'separator' as const },
                                                                {
                                                                    type: 'item' as const,
                                                                    label: 'Obriši',
                                                                    variant: 'destructive',
                                                                    onSelect: () => router.delete(route('polls.destroy', { poll: poll.id })),
                                                                },
                                                            ]
                                                            : []),
                                                    ]}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                                            {search ? 'Nema rezultata pretrage' : 'Nema anketa'}
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
