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
import { useState } from 'react';
import { RichEditor } from '@/components/rich-editor';

type FormState = {
    title: string;
    short_description: string;
    full_description: string;
    published: boolean;
    main_image: File | null;
    gallery: File[] | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Početna stranica', href: '/dashboard' },
    { title: 'Mekteb', href: '/mekteb' },
    { title: 'Dodaj objavu', href: '/mekteb/create' },
];

export default function MektebCreate() {
    const { data, setData, post, processing, errors } = useForm<FormState>({
        title: '',
        short_description: '',
        full_description: '',
        published: true,
        main_image: null,
        gallery: null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('mekteb.store'), { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dodaj objavu" />
            <ContentHolder>
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Dodaj objavu</h1>
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
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData('main_image', e.target.files?.[0] ?? null)}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label>Galerija</Label>
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
