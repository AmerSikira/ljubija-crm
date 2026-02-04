import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { formatDateTimeEU } from '@/lib/utils';
import { useState } from 'react';

type SlotRow = {
    id: number;
    letter: string;
    number: number;
    status: 'available' | 'reserved';
    reservation: null | {
        id: number;
        reserved_at: string;
        expires_at: string | null;
        user: { id: number; name: string } | null;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Početna stranica', href: '/dashboard' },
    { title: 'Zauzeće mezara', href: '/graves' },
];

const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

type Paginated<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
};

export default function GravesIndex({
    slots,
    filters,
    stats,
    canReserve,
}: {
    slots: Paginated<SlotRow>;
    filters: { letter?: string | null; number?: number | null; status?: string };
    stats: { total: number; reserved: number; available: number };
    canReserve: boolean;
}) {
    const { props } = usePage();
    const flash = (props as any)?.flash ?? {};
    const reservationResult = flash?.reservation_result;
    const [rows, setRows] = useState<Array<{ letter: string; number: string }>>([{ letter: 'A', number: '' }]);
    const [noExpiry, setNoExpiry] = useState(true);

    const { data, setData } = useForm({
        letter: filters.letter ?? '',
        number: filters.number?.toString() ?? '',
        status: filters.status ?? 'all',
    });

    const { data: reserveData, setData: setReserveData, post, processing } = useForm({
        expires_at: '',
    });

    const addRow = () => setRows([...rows, { letter: 'A', number: '' }]);
    const removeRow = (index: number) => setRows(rows.filter((_, i) => i !== index));

    const submitFilters = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('graves.index'),
            {
                letter: data.letter || null,
                number: data.number || null,
                status: data.status || 'all',
            },
            { preserveScroll: true, preserveState: true }
        );
    };

    const reserveSlots = (e: React.FormEvent) => {
        e.preventDefault();
        const slotsPayload = rows
            .map((row) => ({
                letter: row.letter.trim().toUpperCase(),
                number: Number(row.number),
            }))
            .filter((row) => row.letter && row.number);

        post(route('graves.reserve'), {
            data: {
                slots: slotsPayload,
                expires_at: noExpiry ? null : reserveData.expires_at || null,
            },
            preserveScroll: true,
        });
    };

    const statusLabel = (slot: SlotRow) => {
        if (slot.status === 'available') return 'Slobodno';
        if (slot.reservation?.expires_at) {
            return `Ističe: ${formatDateTimeEU(slot.reservation.expires_at)}`;
        }
        return `Zauzeto: ${formatDateTimeEU(slot.reservation?.reserved_at ?? null)}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Zauzeće mezara" />
            <ContentHolder className="space-y-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Zauzeće mezara</h1>
                        <p className="text-sm text-muted-foreground">
                            Ukupno: {stats.total} • Slobodno: {stats.available} • Zauzeto: {stats.reserved}
                        </p>
                    </div>
                </div>

                {flash.success && (
                    <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                        {flash.success}
                    </div>
                )}
                {flash.error && (
                    <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                        {flash.error}
                    </div>
                )}
                {reservationResult && (
                        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                            <div className="font-semibold">{reservationResult.message}</div>
                            {reservationResult.failed?.length > 0 && (
                                <ul className="mt-1 list-disc pl-5">
                                    {reservationResult.failed.map((f: any, idx: number) => (
                                        <li key={`${f.letter}-${f.number}-${idx}`}>
                                            {f.letter}-{f.number}: {f.reason}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                )}

                {canReserve && (
                <Card>
                    <CardHeader>
                        <CardTitle>Zauzmi mjesta</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={reserveSlots} className="space-y-4">
                            <div className="flex flex-col gap-3">
                                {rows.map((row, index) => (
                                    <div key={index} className="grid grid-cols-1 gap-2 md:grid-cols-[120px_160px_40px] md:items-center">
                                        <Select
                                            value={row.letter}
                                            onValueChange={(val) =>
                                                setRows(rows.map((r, i) => (i === index ? { ...r, letter: val } : r)))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Red" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {letters.map((letter) => (
                                                    <SelectItem key={letter} value={letter}>
                                                        {letter}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            type="number"
                                            min={1}
                                            max={100}
                                            placeholder="Broj"
                                            value={row.number}
                                            onChange={(e) =>
                                                setRows(rows.map((r, i) => (i === index ? { ...r, number: e.target.value } : r)))
                                            }
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeRow(index)}
                                            aria-label="Ukloni red"
                                            disabled={rows.length === 1}
                                        >
                                            ×
                                        </Button>
                                    </div>
                                ))}
                                <div>
                                    <Button type="button" variant="outline" onClick={addRow}>
                                        Dodaj mjesto
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:items-center">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="noExpiry"
                                        checked={noExpiry}
                                        onCheckedChange={(val) => setNoExpiry(Boolean(val))}
                                    />
                                    <Label htmlFor="noExpiry">Bez isteka</Label>
                                </div>
                                <Input
                                    type="datetime-local"
                                    value={reserveData.expires_at}
                                    onChange={(e) => setReserveData('expires_at', e.target.value)}
                                    disabled={noExpiry}
                                />
                                <Button type="submit" disabled={processing}>
                                    Zauzmi
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Pregled mjesta</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={submitFilters} className="grid grid-cols-1 gap-2 md:grid-cols-5 md:items-end">
                            <div className="flex flex-col gap-1">
                                <Label>Red</Label>
                                <Select value={data.letter || 'all'} onValueChange={(val) => setData('letter', val === 'all' ? '' : val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Svi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Svi</SelectItem>
                                        {letters.map((letter) => (
                                            <SelectItem key={letter} value={letter}>
                                                {letter}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label>Broj</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    max={100}
                                    value={data.number}
                                    onChange={(e) => setData('number', e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label>Status</Label>
                                <Select value={data.status} onValueChange={(val) => setData('status', val)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Svi</SelectItem>
                                        <SelectItem value="available">Slobodno</SelectItem>
                                        <SelectItem value="reserved">Zauzeto</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-2 md:col-span-2 md:justify-end">
                                <Button type="submit" variant="secondary">
                                    Pretraži
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setData({ letter: '', number: '', status: 'all' });
                                        router.get(route('graves.index'), {}, { preserveScroll: true });
                                    }}
                                >
                                    Reset
                                </Button>
                            </div>
                        </form>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Red</TableHead>
                                    <TableHead>Broj</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Datum zauzeća</TableHead>
                                    <TableHead>Ističe</TableHead>
                                    <TableHead className="text-right">Akcije</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {slots.data.length ? (
                                    slots.data.map((slot) => (
                                        <TableRow key={slot.id}>
                                            <TableCell>{slot.letter}</TableCell>
                                            <TableCell>{slot.number}</TableCell>
                                            <TableCell>{statusLabel(slot)}</TableCell>
                                            <TableCell>
                                                {slot.reservation?.reserved_at ? formatDateTimeEU(slot.reservation.reserved_at) : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {slot.reservation
                                                    ? slot.reservation.expires_at
                                                        ? formatDateTimeEU(slot.reservation.expires_at)
                                                        : 'Bez isteka'
                                                    : '-'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {canReserve && slot.status === 'reserved' && slot.reservation ? (
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() =>
                                                            router.post(route('graves.remove', slot.reservation?.id), {}, { preserveScroll: true })
                                                        }
                                                    >
                                                        Ukloni zauzeće
                                                    </Button>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">—</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                                            Nema rezultata.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <div className="flex justify-end gap-2">
                            {slots.links.map((link, index) => (
                                <Button
                                    key={index}
                                    asChild
                                    variant={link.active ? 'secondary' : 'outline'}
                                    disabled={!link.url}
                                >
                                    <Link href={link.url ?? '#'} preserveScroll dangerouslySetInnerHTML={{ __html: link.label }} />
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </ContentHolder>
        </AppLayout>
    );
}
