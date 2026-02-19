import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import ContentHolder from '@/components/content-holder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/date-picker';
import MemberAutocomplete, { type MemberOption } from '@/components/member-autocomplete';
import { XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

type BoardPayload = {
    id: number;
    start_date?: string | null;
    end_date?: string | null;
    is_current: boolean;
    roles: {
        president?: number | null;
        president_name?: string | null;
        vice_president?: number | null;
        vice_president_name?: string | null;
        finance?: number | null;
        finance_name?: string | null;
        members: number[];
        external_members?: string[];
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Početna stranica', href: '/dashboard' },
    { title: 'Upravni odbor', href: '/boards' },
    { title: 'Uredi odbor', href: '/boards' },
];

const roleOrder = ['president', 'vice_president', 'finance'];

export default function EditBoard({
    board,
    members,
    roleLabels,
}: {
    board: BoardPayload;
    members: MemberOption[];
    roleLabels: Record<string, string>;
}) {
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();

    const { data, setData, post } = useForm({
        start_date: board.start_date || '',
        end_date: board.end_date || '',
        is_current: board.is_current,
        roles: {
            president: board.roles.president || null,
            president_name: board.roles.president_name || '',
            vice_president: board.roles.vice_president || null,
            vice_president_name: board.roles.vice_president_name || '',
            finance: board.roles.finance || null,
            finance_name: board.roles.finance_name || '',
            members: (board.roles.members || []) as Array<number | null>,
            external_members: (board.roles.external_members || []) as string[],
        },
    });

    const parseDate = (value?: string | null) => {
        if (!value) return undefined;
        const [day, month, year] = value.split('.');
        const parsed = new Date(Number(year), Number(month) - 1, Number(day));
        return isNaN(parsed.getTime()) ? undefined : parsed;
    };

    useEffect(() => {
        setStartDate(parseDate(board.start_date));
        setEndDate(parseDate(board.end_date));
    }, [board.start_date, board.end_date]);

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
        post(route('boards.update', board.id), {
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

    const addExternalMemberField = () => {
        setData('roles', { ...data.roles, external_members: [...(data.roles.external_members ?? []), ''] });
    };

    const updateExternalMemberAt = (index: number, value: string) => {
        const next = [...(data.roles.external_members ?? [])];
        next[index] = value;
        setData('roles', { ...data.roles, external_members: next });
    };

    const removeExternalMemberField = (index: number) => {
        const next = [...(data.roles.external_members ?? [])];
        next.splice(index, 1);
        setData('roles', { ...data.roles, external_members: next });
    };

    const setDateValue = (key: 'start_date' | 'end_date', value?: Date) => {
        if (key === 'start_date') setStartDate(value);
        if (key === 'end_date') setEndDate(value);
        setData(key, formatDate(value));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Uredi odbor" />
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
                                        onChange={(val) =>
                                            setData('roles', {
                                                ...data.roles,
                                                [roleKey]: val,
                                                [`${roleKey}_name`]: val ? '' : (data.roles as any)[`${roleKey}_name`],
                                            })
                                        }
                                        placeholder="Počnite kucati ime"
                                    />
                                    <Input
                                        placeholder="Upišite ime ako osoba nije član"
                                        value={(data.roles as any)[`${roleKey}_name`] ?? ''}
                                        onChange={(e) =>
                                            setData('roles', {
                                                ...data.roles,
                                                [`${roleKey}_name`]: e.target.value,
                                                [roleKey]: e.target.value ? null : (data.roles as any)[roleKey],
                                            })
                                        }
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
                                                    variant="outline"
                                                    size="icon"
                                                    className="shrink-0"
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
                                    <Button type="button" variant="outline" onClick={addMemberField} className="w-full sm:w-auto">
                                        Dodaj novog člana
                                    </Button>
                                </div>
                                <div className="pt-2">
                                    <Label>Vanjski članovi (nisu članovi džemata)</Label>
                                    {(data.roles.external_members ?? []).length === 0 && (
                                        <p className="text-sm text-muted-foreground">
                                            Dodajte vanjskog člana pomoću dugmeta ispod.
                                        </p>
                                    )}
                                    <div className="mt-2 flex flex-col gap-3">
                                        {(data.roles.external_members ?? []).map((name, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <Input
                                                    value={name}
                                                    placeholder="Ime i prezime"
                                                    onChange={(e) => updateExternalMemberAt(index, e.target.value)}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    className="shrink-0"
                                                    onClick={() => removeExternalMemberField(index)}
                                                    aria-label="Ukloni člana"
                                                >
                                                    <XIcon className="size-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-2">
                                        <Button type="button" variant="outline" onClick={addExternalMemberField} className="w-full sm:w-auto">
                                            Dodaj vanjskog člana
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <Button variant="outline" asChild className="w-full sm:w-auto">
                            <Link href={route('boards.index')}>Nazad</Link>
                        </Button>
                        <Button type="submit" className="w-full sm:w-auto">Sačuvaj odbor</Button>
                    </div>
                </form>
            </ContentHolder>
        </AppLayout>
    );
}
