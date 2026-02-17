import { ActionsMenu } from '@/components/actions-menu';
import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';

type MektebEntry = {
    id: number;
    title: string;
    short_description: string;
    main_image_url?: string | null;
    published: boolean;
};

export default function MektebIndex({ entries, isAdmin }: { entries: MektebEntry[]; isAdmin: boolean }) {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<'all' | 'published' | 'draft'>('all');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Početna stranica', href: '/dashboard' },
        { title: 'Mekteb', href: '/mekteb' },
    ];

    const filteredEntries = useMemo(() => {
        const query = search.trim().toLowerCase();
        return (entries ?? []).filter((entry) => {
            const matchesSearch =
                !query ||
                entry.title.toLowerCase().includes(query) ||
                entry.short_description.toLowerCase().includes(query);

            const matchesStatus =
                status === 'all' || (status === 'published' ? entry.published : !entry.published);

            return matchesSearch && matchesStatus;
        });
    }, [entries, search, status]);

    const renderPreview = (value: string) => (value.length > 180 ? `${value.slice(0, 180)}...` : value);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mekteb" />
            <ContentHolder>
                <div className="mb-4 space-y-3">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <h1 className="text-2xl font-bold">Mekteb</h1>
                        {isAdmin && (
                            <Button asChild>
                                <Link href={route('mekteb.create')}>Dodaj novo</Link>
                            </Button>
                        )}
                    </div>

                    <form
                        className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:items-center"
                        onSubmit={(event) => event.preventDefault()}
                    >
                        <Input
                            placeholder="Pretraga po naslovu ili opisu"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                        <Select value={status} onValueChange={(value) => setStatus(value as 'all' | 'published' | 'draft')}>
                            <SelectTrigger>
                                <SelectValue placeholder="Svi statusi" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Svi statusi</SelectItem>
                                <SelectItem value="published">Objavljeno</SelectItem>
                                <SelectItem value="draft">Neobjavljeno</SelectItem>
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
                                    setSearch('');
                                    setStatus('all');
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
                                    <TableHead className="w-32">Status</TableHead>
                                    <TableHead className="w-40 text-right">Opcije</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredEntries.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                                            {search || status !== 'all' ? 'Nema rezultata pretrage' : 'Nema objava za prikaz.'}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredEntries.map((entry) => (
                                        <TableRow key={entry.id}>
                                            <TableCell className="font-medium">{entry.title}</TableCell>
                                            <TableCell className="text-muted-foreground">{renderPreview(entry.short_description)}</TableCell>
                                            <TableCell>
                                                <Badge variant={entry.published ? 'secondary' : 'outline'}>
                                                    {entry.published ? 'Objavljeno' : 'Neobjavljeno'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <ActionsMenu
                                                    actions={[
                                                        {
                                                            type: 'item',
                                                            label: 'Detalji',
                                                            href: route('mekteb.show', entry.id),
                                                        },
                                                        ...(isAdmin
                                                            ? [
                                                                {
                                                                    type: 'item' as const,
                                                                    label: 'Uredi',
                                                                    href: route('mekteb.edit', entry.id),
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
