import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { formatDateEU } from '@/lib/utils';

type Project = {
    id: number;
    name: string;
    description: string;
    main_image_url?: string | null;
    gallery_urls?: string[];
    budget: number;
    start_date?: string | null;
    end_date?: string | null;
    final_budget?: number | null;
    completion_time?: string | null;
};

type Interest = {
    id: number;
    user: { id: number; name: string; email: string | null } | null;
    confirmed_at?: string | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Početna stranica', href: '/dashboard' },
    { title: 'Projekti', href: '/projects' },
];

export default function ProjectShow({
    project,
    interests,
    filters,
    currentInterest,
}: {
    project: Project;
    interests: Interest[];
    filters: { search?: string; status?: string };
    currentInterest: { id: number; confirmed_at?: string | null } | null;
}) {
    const { props } = usePage();
    const role = (props as any)?.auth?.user?.role ?? '';
    const isAdmin = role === 'admin';
    const { data, setData } = useForm({
        search: filters?.search ?? '',
        status: (filters?.status as string) ?? '',
    });
    const gallery = (project.gallery_urls ?? []).filter(Boolean);
    const images = [project.main_image_url, ...gallery].filter(Boolean);
    const [galleryIndex, setGalleryIndex] = useState(0);

    useEffect(() => {
        if (galleryIndex >= images.length) {
            setGalleryIndex(0);
        }
    }, [images.length, galleryIndex]);

    const handleJoin = () => {
        router.post(route('projects.join', project.id));
    };

    const handleConfirm = (interestId: number) => {
        router.post(route('projects.interests.confirm', { project: project.id, interest: interestId }));
    };

    const statusLabel = (interest: Interest) => (interest.confirmed_at ? 'Potvrđeno' : 'Na čekanju');

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: project.name, href: `/projects/${project.id}` }]}>
            <Head title={`Projekti - ${project.name}`} />
            <ContentHolder>
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <h1 className="text-2xl font-bold">{project.name}</h1>
                    {!currentInterest && (
                        <Button onClick={handleJoin}>Uključujem se i ja</Button>
                    )}
                    {currentInterest && (
                        <Badge variant="secondary">
                            {currentInterest.confirmed_at ? 'Već potvrđeni' : 'Već ste se uključili'}
                        </Badge>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Detalji projekta</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {images.length > 0 && (
                                <div className="space-y-2">
                                    <div className="relative flex items-center justify-center rounded-lg border bg-muted/20 p-3">
                                        <img
                                            src={images[galleryIndex]!}
                                            alt={`Slika ${galleryIndex + 1}`}
                                            className="h-72 w-full rounded-md object-cover md:h-96"
                                        />
                                        {images.length > 1 && (
                                            <>
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="sm"
                                                    className="absolute left-3 top-1/2 -translate-y-1/2"
                                                    onClick={() =>
                                                        setGalleryIndex((prev) => (prev - 1 + images.length) % images.length)
                                                    }
                                                >
                                                    ‹
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="sm"
                                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                                    onClick={() => setGalleryIndex((prev) => (prev + 1) % images.length)}
                                                >
                                                    ›
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                    {images.length > 1 && (
                                        <div className="flex justify-center gap-2">
                                            {images.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => setGalleryIndex(idx)}
                                                    className={`h-2 w-2 rounded-full ${
                                                        idx === galleryIndex ? 'bg-primary' : 'bg-muted-foreground/50'
                                                    }`}
                                                    aria-label={`Prikaži sliku ${idx + 1}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <InfoItem label="Budžet" value={project.budget ? `${project.budget} KM` : '-'} />
                                <InfoItem label="Početak projekta" value={formatDateEU(project.start_date) || '-'} />
                                <InfoItem label="Kraj projekta" value={formatDateEU(project.end_date) || '-'} />
                                <InfoItem label="Finalni budžet" value={project.final_budget ? `${project.final_budget} KM` : '-'} />
                                <InfoItem label="Vrijeme završetka" value={project.completion_time || '-'} />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Opis</h3>
                                <p className="text-muted-foreground whitespace-pre-line">{project.description}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Brzi podaci</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <InfoItem label="Zainteresovani" value={interests.length.toString()} />
                            {isAdmin && (
                                <div className="space-y-2">
                                    <Button asChild variant="outline" className="w-full">
                                        <Link href={route('projects.edit', project.id)}>Uredi projekat</Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-6">
                    <CardHeader>
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <CardTitle>Zainteresovani</CardTitle>
                            <form
                                className="grid grid-cols-1 gap-2 md:grid-cols-3 md:items-center"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    router.get(
                                        route('projects.show', project.id),
                                        { search: data.search, status: data.status === 'all' ? '' : data.status },
                                        { preserveScroll: true, preserveState: true }
                                    );
                                }}
                            >
                                <Input
                                    placeholder="Pretraži po imenu..."
                                    value={data.search}
                                    onChange={(e) => setData('search', e.target.value)}
                                />
                                <Select
                                    value={data.status}
                                    onValueChange={(value) => setData('status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Svi</SelectItem>
                                        <SelectItem value="confirmed">Potvrđeni</SelectItem>
                                        <SelectItem value="pending">Nepotvrđeni</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="flex items-center gap-2">
                                    <Button type="submit" variant="secondary" className="w-full md:w-auto">
                                        Pretraži
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full md:w-auto"
                                        onClick={() => {
                                            setData({ search: '', status: 'all' });
                                            router.get(route('projects.show', project.id), {}, { preserveScroll: true });
                                        }}
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ime i prezime</TableHead>
                                    <TableHead>Kontakt</TableHead>
                                    <TableHead>Status</TableHead>
                                    {isAdmin && <TableHead className="text-right">Opcije</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {interests.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={isAdmin ? 4 : 3} className="text-center text-muted-foreground">
                                            Nema zainteresovanih.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    interests.map((interest) => (
                                        <TableRow
                                            key={interest.id}
                                            className={interest.confirmed_at ? 'bg-green-100' : undefined}
                                        >
                                            <TableCell>{interest.user?.name ?? 'Nepoznato'}</TableCell>
                                            <TableCell className="text-muted-foreground">{interest.user?.email ?? '-'}</TableCell>
                                            <TableCell>
                                                <Badge variant={interest.confirmed_at ? 'default' : 'secondary'}>
                                                    {statusLabel(interest)}
                                                </Badge>
                                            </TableCell>
                                            {isAdmin && (
                                                <TableCell className="text-right">
                                                    {!interest.confirmed_at && (
                                                        <Button size="sm" onClick={() => handleConfirm(interest.id)}>
                                                            Potvrdi
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            )}
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

function InfoItem({ label, value }: { label: string; value?: string | null }) {
    return (
        <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="font-semibold">{value || '-'}</span>
        </div>
    );
}
