import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import ContentHolder from '@/components/content-holder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/date-picker';
import MemberAutocomplete, { type MemberOption } from '@/components/member-autocomplete';
import { XIcon } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Početna stranica', href: '/dashboard' },
    { title: 'Upravni odbor', href: '/boards' },
    { title: 'Kreiraj odbor', href: '/boards/create' },
];

const roleOrder = ['president', 'vice_president', 'mutevelija', 'finance'];

export default function CreateBoard({
    members,
    roleLabels,
}: {
    members: MemberOption[];
    roleLabels: Record<string, string>;
}) {
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);

    const { data, setData, post } = useForm({
        start_date: '',
        end_date: '',
        is_current: true,
        roles: {
            president: null as number | null,
            vice_president: null as number | null,
            mutevelija: null as number | null,
            finance: null as number | null,
            members: [] as Array<number | null>,
        },
    });

    const formatDate = (d?: Date) => {
        if (!d) return '';
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const members = data.roles.members.filter((id): id is number => typeof id === 'number');
        post(route('boards.store'), {
            data: {
                ...data,
                roles: {
                    ...data.roles,
                    members,
                },
            },
        });
    };

    const updateMemberAt = (index: number, memberId: number | null) => {
        const next = [...data.roles.members];
        next[index] = memberId;
        setData('roles', { ...data.roles, members: next });
    };

    const addMemberField = () => {
        setData('roles', { ...data.roles, members: [...data.roles.members, null] });
    };

    const removeMemberField = (index: number) => {
        const next = [...data.roles.members];
        next.splice(index, 1);
        setData('roles', { ...data.roles, members: next });
    };

    const setDateValue = (key: 'start_date' | 'end_date', value?: Date) => {
        if (key === 'start_date') setStartDate(value);
        if (key === 'end_date') setEndDate(value);
        setData(key, formatDate(value));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kreiraj odbor" />
            <ContentHolder>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Mandatni period</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <Label>Datum početka mandata</Label>
                                <DatePicker selected={startDate} handleChange={(date) => setDateValue('start_date', date)} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Datum završetka mandata</Label>
                                <DatePicker selected={endDate} handleChange={(date) => setDateValue('end_date', date)} />
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="is_current"
                                    checked={data.is_current}
                                    onCheckedChange={(checked) => setData('is_current', Boolean(checked))}
                                />
                                <Label htmlFor="is_current">Označi kao aktuelni odbor</Label>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Uloge u odboru</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4">
                            {roleOrder.map((roleKey) => (
                                <div key={roleKey} className="flex flex-col gap-2">
                                    <Label>{roleLabels[roleKey]}</Label>
                                    <MemberAutocomplete
                                        members={members}
                                        value={(data.roles[roleKey as keyof typeof data.roles] as number | null) ?? null}
                                        onChange={(val) => setData('roles', { ...data.roles, [roleKey]: val })}
                                        placeholder="Počnite kucati ime"
                                    />
                                </div>
                            ))}
                            <div className="flex flex-col gap-3">
                                <Label>{roleLabels.member}</Label>
                                {data.roles.members.length === 0 && (
                                    <p className="text-sm text-muted-foreground">Dodajte člana pomoću dugmeta ispod.</p>
                                )}
                                <div className="flex flex-col gap-3">
                                    {data.roles.members.map((memberId, index) => {
                                        const disabledIds = data.roles.members
                                            .map((id, idx) => (idx === index ? null : id))
                                            .filter((id): id is number => typeof id === 'number');

                                        return (
                                            <div key={index} className="flex items-center gap-2">
                                                <MemberAutocomplete
                                                    members={members}
                                                    value={memberId ?? null}
                                                    onChange={(val) => updateMemberAt(index, val)}
                                                    disabledIds={disabledIds}
                                                    placeholder="Počnite kucati ime"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeMemberField(index)}
                                                    aria-label="Ukloni člana"
                                                >
                                                    <XIcon className="size-4" />
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div>
                                    <Button type="button" variant="outline" onClick={addMemberField}>
                                        Dodaj novog člana
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-between">
                        <Button variant="outline" asChild>
                            <Link href={route('boards.index')}>Nazad</Link>
                        </Button>
                        <Button type="submit">Sačuvaj odbor</Button>
                    </div>
                </form>
            </ContentHolder>
        </AppLayout>
    );
}
