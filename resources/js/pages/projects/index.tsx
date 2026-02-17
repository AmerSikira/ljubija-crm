import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ActionsMenu } from '@/components/actions-menu';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { formatDateEU } from '@/lib/utils';
import { useMemo, useState } from 'react';

type Project = {
    id: number;
    name: string;
    description_preview?: string | null;
    interests_count: number;
    start_date?: string | null;
};

type Paginated<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Početna stranica', href: '/dashboard' },
    { title: 'Projekti', href: '/projects' },
];

export default function ProjectsIndex({ projects }: { projects: Paginated<Project> }) {
    const { props } = usePage();
    const role = (props as any)?.auth?.user?.role ?? '';
    const isAdmin = role === 'admin';
    const [search, setSearch] = useState('');

    const filteredProjects = useMemo(() => {
        const query = search.trim().toLowerCase();
        return (projects.data ?? []).filter((project) => {
            const name = (project.name ?? '').toLowerCase();
            const description = (project.description_preview ?? '').toLowerCase();
            return !query || name.includes(query) || description.includes(query);
        });
    }, [projects.data, search]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projekti" />
            <ContentHolder>
                <div className="mb-4 space-y-3">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <h1 className="text-2xl font-bold">Projekti</h1>
                        {isAdmin && (
                            <Button asChild>
                                <Link href={route('projects.create')}>Dodaj novo</Link>
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

                        <div className="flex items-center gap-1">
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
                                    <TableHead>Naziv</TableHead>
                                    <TableHead>Opis</TableHead>
                                    <TableHead>Zainteresovani</TableHead>
                                    <TableHead>Početak projekta</TableHead>
                                    <TableHead className="w-40 text-right">Opcije</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProjects.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                                            {search ? 'Nema rezultata pretrage' : 'Nema projekata za prikaz.'}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredProjects.map((project) => (
                                        <TableRow key={project.id}>
                                            <TableCell className="font-semibold">{project.name}</TableCell>
                                            <TableCell className="text-muted-foreground">{project.description_preview}</TableCell>
                                            <TableCell>{project.interests_count}</TableCell>
                                            <TableCell>{formatDateEU(project.start_date) || '-'}</TableCell>
                                            <TableCell className="text-right">
                                                <ActionsMenu
                                                    actions={[
                                                        {
                                                            type: 'item',
                                                            label: 'Detalji',
                                                            href: route('projects.show', project.id),
                                                        },
                                                        ...(isAdmin
                                                            ? [
                                                                {
                                                                    type: 'item' as const,
                                                                    label: 'Uredi',
                                                                    href: route('projects.edit', project.id),
                                                                },
                                                                { type: 'separator' as const },
                                                                {
                                                                    type: 'item' as const,
                                                                    label: 'Obriši',
                                                                    variant: 'destructive',
                                                                    onSelect: () =>
                                                                        router.delete(route('projects.destroy', project.id)),
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
