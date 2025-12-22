import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { DatePicker } from '@/components/date-picker';

type FormState = {
    first_name: string;
    last_name: string;
    status: 'preselio' | 'nestao';
    birth_date: string;
    status_date: string;
    birth_place: string;
    status_place: string;
    short_info: string;
    full_info: string;
    family_info: string;
    published: boolean;
    main_image: File | null;
    gallery: File[] | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Početna stranica', href: '/dashboard' },
    { title: 'Memorijal', href: '/memorials' },
    { title: 'Dodaj osobu', href: '/memorials/create' },
];

export default function MemorialCreate() {
    const { data, setData, post, processing, errors } = useForm<FormState>({
        first_name: '',
        last_name: '',
        status: 'preselio',
        birth_date: '',
        status_date: '',
        birth_place: '',
        status_place: '',
        short_info: '',
        full_info: '',
        family_info: '',
        published: true,
        main_image: null,
        gallery: null,
    });

    const handleDateChange = (field: 'birth_date' | 'status_date', date?: Date) => {
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
        post(route('memorials.store'), { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dodaj osobu" />
            <ContentHolder>
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Dodaj osobu</h1>
                    <Button variant="ghost" asChild>
                        <Link href={route('memorials.index')}>Odustani</Link>
                    </Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Podaci</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="first_name">Ime</Label>
                                    <Input
                                        id="first_name"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                    />
                                    {errors.first_name && <span className="text-sm text-destructive">{errors.first_name}</span>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="last_name">Prezime</Label>
                                    <Input
                                        id="last_name"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                    />
                                    {errors.last_name && <span className="text-sm text-destructive">{errors.last_name}</span>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label>Status</Label>
                                    <Select value={data.status} onValueChange={(v) => setData('status', v as 'preselio' | 'nestao')}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Odaberite status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="preselio">Preselio</SelectItem>
                                            <SelectItem value="nestao">Nestao</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label>Datum rođenja</Label>
                                    <DatePicker handleChange={(date) => handleDateChange('birth_date', date)} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label>Datum smrti ili nestanka</Label>
                                    <DatePicker handleChange={(date) => handleDateChange('status_date', date)} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label>Mjesto rođenja</Label>
                                    <Input
                                        value={data.birth_place}
                                        onChange={(e) => setData('birth_place', e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label>Mjesto smrti ili nestanka</Label>
                                    <Input
                                        value={data.status_place}
                                        onChange={(e) => setData('status_place', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <Label>Slika</Label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData('main_image', e.target.files?.[0] ?? null)}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label>Galerija (opciono)</Label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => setData('gallery', e.target.files ? Array.from(e.target.files) : null)}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label>Kratke informacije</Label>
                                <Textarea
                                    value={data.short_info}
                                    onChange={(e) => setData('short_info', e.target.value)}
                                    placeholder="Unesite kratke informacije"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Detaljne informacije</Label>
                                <Textarea
                                    value={data.full_info}
                                    onChange={(e) => setData('full_info', e.target.value)}
                                    placeholder="Unesite detalje"
                                    className="min-h-[150px]"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Porodica</Label>
                                <Textarea
                                    value={data.family_info}
                                    onChange={(e) => setData('family_info', e.target.value)}
                                    placeholder="Informacije o porodici"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="published"
                                    checked={data.published}
                                    onCheckedChange={(val) => setData('published', Boolean(val))}
                                />
                                <Label htmlFor="published">Objavi na Memorijalu</Label>
                            </div>

                            <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" asChild>
                                    <Link href={route('memorials.index')}>Odustani</Link>
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
