import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { RichEditor } from '@/components/rich-editor';
import { Button as DestructiveButton } from '@/components/ui/button';

type DzematPage = {
    id?: number;
    title: string;
    content: string;
    gallery: { id: number; url: string }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Početna stranica', href: '/dashboard' },
    { title: 'Džemat Ljubija', href: '/dzemat' },
    { title: 'Uredi', href: '/dzemat/edit' },
];

export default function DzematEdit({ page }: { page: DzematPage | null }) {
    const { data, setData, post, processing, errors } = useForm({
        title: page?.title ?? 'Džemat Ljubija',
        content: page?.content ?? '',
        gallery: page?.gallery ?? [],
        gallery_uploads: [] as File[] | [],
        removed_media_ids: [] as number[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dzemat.update'), { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Uredi Džemat Ljubija" />
            <ContentHolder>
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Uredi Džemat Ljubija</h1>
                    <Button variant="ghost" asChild>
                        <Link href={route('dzemat.show')}>Nazad</Link>
                    </Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Podaci</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-2">
                                <Label>Naslov</Label>
                                <Input value={data.title} onChange={(e) => setData('title', e.target.value)} />
                                {errors.title && <span className="text-sm text-destructive">{errors.title}</span>}
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Sadržaj</Label>
                                <RichEditor value={data.content} onChange={(val) => setData('content', val)} error={errors.content} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Galerija</Label>
                                {data.gallery && data.gallery.length > 0 && (
                                    <div className="flex flex-wrap gap-3">
                                        {data.gallery.map((img) => (
                                            <div key={img.id} className="relative">
                                                <img src={img.url} className="h-20 w-20 rounded-md object-cover" />
                                                <DestructiveButton
                                                    type="button"
                                                    size="sm"
                                                    variant="destructive"
                                                    className="absolute -right-2 -top-2 h-6 w-6 rounded-full p-0 text-xs"
                                                    onClick={() => {
                                                        setData('removed_media_ids', [...data.removed_media_ids.filter((id: number) => id !== img.id), img.id]);
                                                        setData(
                                                            'gallery',
                                                            data.gallery.filter((g) => g.id !== img.id)
                                                        );
                                                    }}
                                                >
                                                    ×
                                                </DestructiveButton>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <Input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => setData('gallery_uploads', e.target.files ? Array.from(e.target.files) : [])}
                                />
                                {errors.gallery_uploads && <span className="text-sm text-destructive">{errors.gallery_uploads as string}</span>}
                            </div>
                            <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" asChild>
                                    <Link href={route('dzemat.show')}>Otkaži</Link>
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
