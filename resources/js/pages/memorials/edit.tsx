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

type Memorial = {
    id: number;
    first_name: string;
    last_name: string;
    status: 'preselio' | 'nestao' | 'logoras' | 'nema_statusa';
    birth_date?: string | null;
    status_date?: string | null;
    birth_place?: string | null;
    status_place?: string | null;
    short_info?: string | null;
    full_info?: string | null;
    family_info?: string | null;
    published: boolean;
    main_image_url?: string | null;
    gallery_urls?: string[];
};

const breadcrumbsBase: BreadcrumbItem[] = [
    { title: 'Početna stranica', href: '/dashboard' },
    { title: 'Memorijal', href: '/memorials' },
];

export default function MemorialEdit({ memorial }: { memorial: Memorial }) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: memorial.first_name,
        last_name: memorial.last_name,
        status: memorial.status,
        birth_date: memorial.birth_date ?? '',
        status_date: memorial.status_date ?? '',
        birth_place: memorial.birth_place ?? '',
        status_place: memorial.status_place ?? '',
        short_info: memorial.short_info ?? '',
        full_info: memorial.full_info ?? '',
        family_info: memorial.family_info ?? '',
        published: memorial.published,
        main_image: null as File | null,
        gallery: null as File[] | null,
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
        post(route('memorials.update', memorial.id), { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={[...breadcrumbsBase, { title: 'Uredi osobu', href: `/memorials/${memorial.id}/edit` }]}>
            <Head title="Uredi osobu" />
            <ContentHolder>
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Uredi osobu</h1>
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
                                    <Select value={data.status} onValueChange={(v) => setData('status', v as Memorial['status'])}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Odaberite status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="preselio">Preselio</SelectItem>
                                            <SelectItem value="nestao">Nestao</SelectItem>
                                            <SelectItem value="logoras">Logoraš</SelectItem>
                                            <SelectItem value="nema_statusa">Nema statusa</SelectItem>
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
                                    {memorial.main_image_url && (
                                        <img src={memorial.main_image_url} alt="Slika" className="h-24 w-24 rounded-md object-cover" />
                                    )}
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData('main_image', e.target.files?.[0] ?? null)}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label>Galerija (opciono)</Label>
                                    {memorial.gallery_urls && memorial.gallery_urls.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {memorial.gallery_urls.map((url, idx) => (
                                                <img key={idx} src={url} alt="Galerija" className="h-16 w-16 rounded-md object-cover" />
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
