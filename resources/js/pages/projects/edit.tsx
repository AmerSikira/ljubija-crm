import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { DatePicker } from '@/components/date-picker';

type Project = {
    id: number;
    name: string;
    description: string;
    budget: number;
    start_date?: string | null;
    end_date?: string | null;
    final_budget?: number | null;
    completion_time?: string | null;
    main_image_url?: string | null;
    gallery_urls?: string[];
};

const breadcrumbsBase: BreadcrumbItem[] = [
    { title: 'Početna stranica', href: '/dashboard' },
    { title: 'Projekti', href: '/projects' },
];

export default function ProjectEdit({ project }: { project: Project }) {
    const { data, setData, post, processing, errors } = useForm({
        name: project.name,
        description: project.description,
        budget: project.budget?.toString() ?? '',
        start_date: project.start_date ?? '',
        end_date: project.end_date ?? '',
        final_budget: project.final_budget?.toString() ?? '',
        completion_time: project.completion_time ?? '',
        main_image: null as File | null,
        gallery: null as File[] | null,
    });

    const handleDateChange = (field: 'start_date' | 'end_date', date?: Date) => {
        if (!date) {
            setData(field, '');
            return;
        }
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        setData(field, `${day}.${month}.${year}`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('projects.update', project.id), { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={[...breadcrumbsBase, { title: 'Uredi projekat', href: `/projects/${project.id}/edit` }]}>
            <Head title={`Uredi projekat - ${project.name}`} />
            <ContentHolder>
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Uredi projekat</h1>
                    <Button variant="ghost" asChild>
                        <Link href={route('projects.index')}>Odustani</Link>
                    </Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Detalji</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="name">Naziv</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Unesite naziv projekta"
                                    />
                                    {errors.name && <span className="text-sm text-destructive">{errors.name}</span>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="budget">Budžet (KM)</Label>
                                    <Input
                                        id="budget"
                                        type="number"
                                        step="0.01"
                                        value={data.budget}
                                        onChange={(e) => setData('budget', e.target.value)}
                                        placeholder="npr. 10000"
                                    />
                                    {errors.budget && <span className="text-sm text-destructive">{errors.budget}</span>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="start_date">Početak projekta</Label>
                                    <DatePicker handleChange={(date) => handleDateChange('start_date', date)} />
                                    {errors.start_date && <span className="text-sm text-destructive">{errors.start_date}</span>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="end_date">Kraj projekta</Label>
                                    <DatePicker handleChange={(date) => handleDateChange('end_date', date)} />
                                    {errors.end_date && <span className="text-sm text-destructive">{errors.end_date}</span>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="final_budget">Finalni budžet (KM)</Label>
                                    <Input
                                        id="final_budget"
                                        type="number"
                                        step="0.01"
                                        value={data.final_budget}
                                        onChange={(e) => setData('final_budget', e.target.value)}
                                        placeholder="npr. 12000"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="completion_time">Vrijeme završetka</Label>
                                    <Input
                                        id="completion_time"
                                        value={data.completion_time}
                                        onChange={(e) => setData('completion_time', e.target.value)}
                                        placeholder="npr. 6 mjeseci"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="description">Opis</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Unesite opis projekta"
                                    className="min-h-[140px]"
                                />
                                {errors.description && <span className="text-sm text-destructive">{errors.description}</span>}
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="main_image">Glavna slika</Label>
                                    {project.main_image_url && (
                                        <img src={project.main_image_url} alt="Glavna slika" className="h-24 w-24 rounded-md object-cover" />
                                    )}
                                    <Input
                                        type="file"
                                        id="main_image"
                                        accept="image/*"
                                        onChange={(e) => setData('main_image', e.target.files?.[0] ?? null)}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="gallery">Galerija (više slika)</Label>
                                    {project.gallery_urls && project.gallery_urls.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {project.gallery_urls.map((url, idx) => (
                                                <img key={idx} src={url} alt="Galerija" className="h-16 w-16 rounded-md object-cover" />
                                            ))}
                                        </div>
                                    )}
                                    <Input
                                        type="file"
                                        id="gallery"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => setData('gallery', e.target.files ? Array.from(e.target.files) : null)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" asChild>
                                    <Link href={route('projects.index')}>Odustani</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Sačuvaj
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </ContentHolder>
        </AppLayout>
    );
}
