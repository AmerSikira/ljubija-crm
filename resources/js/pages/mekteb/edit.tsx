import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { RichEditor } from '@/components/rich-editor';

type MektebEntry = {
    id: number;
    title: string;
    short_description: string;
    full_description: string;
    main_image_url?: string | null;
    gallery?: { id: number; url: string }[];
    published: boolean;
};

const breadcrumbsBase: BreadcrumbItem[] = [
    { title: 'Početna stranica', href: '/dashboard' },
    { title: 'Mekteb', href: '/mekteb' },
];

export default function MektebEdit({ entry }: { entry: MektebEntry }) {
    const { data, setData, post, processing, errors } = useForm({
        title: entry.title,
        short_description: entry.short_description,
        full_description: entry.full_description,
        published: entry.published,
        main_image: null as File | null,
        gallery: null as File[] | null,
        removed_media_ids: [] as number[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('mekteb.update', entry.id), { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={[...breadcrumbsBase, { title: 'Uredi objavu', href: `/mekteb/${entry.id}/edit` }]}>
            <Head title="Uredi objavu" />
            <ContentHolder>
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Uredi objavu</h1>
                    <Button variant="ghost" asChild>
                        <Link href={route('mekteb.index')}>Odustani</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Detalji</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-2">
                                <Label>Naslov</Label>
                                <Input value={data.title} onChange={(e) => setData('title', e.target.value)} />
                                {errors.title && <span className="text-sm text-destructive">{errors.title}</span>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label>Kratki opis</Label>
                                <Textarea
                                    value={data.short_description}
                                    onChange={(e) => setData('short_description', e.target.value)}
                                    placeholder="Sažetak objave"
                                />
                                {errors.short_description && (
                                    <span className="text-sm text-destructive">{errors.short_description}</span>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <RichEditor
                                    label="Puni opis"
                                    value={data.full_description}
                                    onChange={(val) => setData('full_description', val)}
                                    error={errors.full_description}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <Label>Glavna slika</Label>
                                    {entry.main_image_url && (
                                        <img src={entry.main_image_url} alt="Slika" className="h-24 w-24 rounded-md object-cover" />
                                    )}
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData('main_image', e.target.files?.[0] ?? null)}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label>Galerija</Label>
                                    {entry.gallery && entry.gallery.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {entry.gallery.map((img) => (
                                                <div key={img.id} className="relative">
                                                    <img src={img.url} className="h-16 w-16 rounded-md object-cover" />
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="destructive"
                                                        className="absolute -right-2 -top-2 h-6 w-6 rounded-full p-0 text-xs"
                                                        onClick={() =>
                                                            setData('removed_media_ids', [
                                                                ...data.removed_media_ids.filter((id: number) => id !== img.id),
                                                                img.id,
                                                            ])
                                                        }
                                                    >
                                                        ×
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => setData('gallery', e.target.files ? Array.from(e.target.files) : null)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="published"
                                    checked={data.published}
                                    onCheckedChange={(val) => setData('published', Boolean(val))}
                                />
                                <Label htmlFor="published">Objavljeno</Label>
                            </div>

                            <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" asChild>
                                    <Link href={route('mekteb.index')}>Odustani</Link>
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
