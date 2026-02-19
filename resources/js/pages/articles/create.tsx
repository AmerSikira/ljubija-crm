import React, { useMemo } from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import ContentHolder from "@/components/content-holder";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RichEditor } from '@/components/rich-editor';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import InputError from "@/components/input-error";

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


export default function Create () {
     const { data, setData, post, processing, errors } = useForm({
        title: '',
        intro: '',
        main_text: '',
        images: [] as File[] | [],
    });

    const selectedImageNames = useMemo(
        () => (data.images ?? []).map((file) => file.name),
        [data.images]
    );

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post('/articles', { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dodaj vijest" />
            <ContentHolder>
                <Card>
                    <CardHeader className="space-y-2">
                        <CardTitle>Dodaj vijest</CardTitle>
                        <CardDescription>Unesite naslov, uvod, glavni tekst i opcionalno dodajte slike.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="grid grid-cols-1 gap-5" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="title">Naslov</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Unesite naslov vijesti"
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label>Uvod</Label>
                                <RichEditor
                                    label={undefined}
                                    value={data.intro}
                                    onChange={(value) => setData('intro', value)}
                                    error={errors.intro}
                                    enableImages
                                />
                                <InputError message={errors.intro} />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label>Glavni tekst</Label>
                                <RichEditor
                                    label={undefined}
                                    value={data.main_text}
                                    onChange={(value) => setData('main_text', value)}
                                    error={errors.main_text}
                                    enableImages
                                />
                                <InputError message={errors.main_text} />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="images">Slike</Label>
                                <Input
                                    id="images"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => setData('images', e.target.files ? Array.from(e.target.files) : [])}
                                />
                                {selectedImageNames.length > 0 && (
                                    <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                                        Odabrano slika: {selectedImageNames.length}
                                        <div className="mt-1 max-h-10 overflow-hidden">{selectedImageNames.join(', ')}</div>
                                    </div>
                                )}
                                <InputError message={errors.images} />
                            </div>

                            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                <Button type="button" variant="outline" asChild className="w-full sm:w-auto">
                                    <Link href={route('articles')}>Otkaži</Link>
                                </Button>
                                <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                                    Spremite vijest
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </ContentHolder>
        </AppLayout>
    );
}
