import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ActionsMenu } from '@/components/actions-menu';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { formatDateEU } from '@/lib/utils';

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projekti" />
            <ContentHolder>
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Projekti</h1>
                    {isAdmin && (
                        <Button asChild>
                            <Link href={route('projects.create')}>Dodaj projekat</Link>
                        </Button>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Lista projekata</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Naziv</TableHead>
                                    <TableHead>Opis</TableHead>
                                    <TableHead>Zainteresovani</TableHead>
                                    <TableHead>Početak projekta</TableHead>
                                    <TableHead className="text-right">Opcije</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projects.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                                            Nema projekata za prikaz.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    projects.data.map((project) => (
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
