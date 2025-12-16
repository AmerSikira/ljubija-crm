import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

type ContentItem = {
    id: number;
    title: string;
    description: string;
    type: 'dova' | 'hadis';
};

export default function ContentEdit({ item }: { item: ContentItem }) {
    const { data, setData, post, processing, errors } = useForm<ContentItem>({
        id: item.id,
        title: item.title,
        description: item.description,
        type: item.type,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Početna stranica', href: '/dashboard' },
        { title: 'Dove i hadisi', href: '/content-items' },
        { title: 'Uredi', href: `/content-items/${item.id}/edit` },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('content-items.update', item.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Dove i hadisi - Uredi ${item.title}`} />
            <ContentHolder>
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Uredi zapis</h1>
                    <Button variant="ghost" asChild>
                        <Link href={route('content-items.index')}>Odustani</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Detalji</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="title">Naslov</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Unesite naslov"
                                />
                                {errors.title && <span className="text-sm text-destructive">{errors.title}</span>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="type">Tip</Label>
                                <Select value={data.type} onValueChange={(value: 'dova' | 'hadis') => setData('type', value)}>
                                    <SelectTrigger id="type">
                                        <SelectValue placeholder="Odaberite tip" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="dova">Dova</SelectItem>
                                        <SelectItem value="hadis">Hadis</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.type && <span className="text-sm text-destructive">{errors.type}</span>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="description">Opis</Label>
                                <textarea
                                    id="description"
                                    className="min-h-[150px] rounded-md border bg-background p-3"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Unesite opis"
                                />
                                {errors.description && <span className="text-sm text-destructive">{errors.description}</span>}
                            </div>

                            <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" type="button" asChild>
                                    <Link href={route('content-items.index')}>Odustani</Link>
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
