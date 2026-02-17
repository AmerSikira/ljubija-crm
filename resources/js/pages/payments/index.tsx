import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import ContentHolder from '@/components/content-holder';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/date-picker';
import { ActionsMenu } from '@/components/actions-menu';
import { Card, CardContent } from '@/components/ui/card';
import { formatDateEU } from '@/lib/utils';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Početna stranica',
        href: '/dashboard',
    },
    {
        title: 'Uplate',
        href: '/payments',
    },
];

type Payment = {
    id: number;
    amount: number;
    type_of_payment: string;
    date_of_payment: string;
    member: {
        first_name: string;
        last_name: string;
        email?: string | null;
        phone?: string | null;
    };
};

type Pagination<T> = {
    data: T[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
};

export default function Index({ payments, filters }: { payments: Pagination<Payment>; filters: { name?: string; amount?: string; date?: string } }) {
    const formatDate = (value?: string | null) => formatDateEU(value) || '';

    const formatPickerDate = (date?: Date | null) => {
        if (!date) return '';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const parsePickerDate = (value?: string | null) => {
        if (!value) return undefined;
        const [d, m, y] = value.split('/').map(Number);
        if (!d || !m || !y) return undefined;
        return new Date(y, m - 1, d, 12);
    };

    const { data, setData } = useForm({
        name: filters.name ?? '',
        amount: filters.amount ?? '',
        date: filters.date ?? '',
    });

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get(route('payments'), { name: data.name, amount: data.amount, date: data.date }, { preserveState: true, preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Uplate" />
            <ContentHolder>
                <div className="mb-4 space-y-3">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <h1 className="text-2xl font-bold">Uplate</h1>
                        <Button asChild>
                            <Link href={route('payments.create')}>
                                Dodaj novo
                            </Link>
                        </Button>
                    </div>

                    <form onSubmit={handleSearch} className="grid grid-cols-1 gap-2 sm:grid-cols-5 sm:items-center">
                        <Input
                            placeholder="Ime ili prezime"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <Input
                            placeholder="Iznos"
                            type="number"
                            step="0.01"
                            value={data.amount}
                            onChange={(e) => setData('amount', e.target.value)}
                        />
                        <DatePicker
                            selected={parsePickerDate(data.date)}
                            handleChange={(date) => setData('date', formatPickerDate(date))}
                        />
                        <Button type="submit" variant="secondary" className="w-full sm:w-auto">
                            Pretraži
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={() => {
                                setData({ name: '', amount: '', date: '' });
                                router.get(route('payments'), {}, { preserveScroll: true });
                            }}
                        >
                            Reset
                        </Button>
                    </form>
                </div>
                <p className="text-sm text-muted-foreground my-2">Prikazuje se zadnjih 20 uplata po stranici.</p>
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Iznos</TableHead>
                                    <TableHead>Datum uplate</TableHead>
                                    <TableHead>Vrsta</TableHead>
                                    <TableHead>Ime i prezime</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Telefon</TableHead>
                                    <TableHead className="w-40 text-right">Opcije</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.data.length > 0 ? (
                                    payments.data.map((payment) => (
                                        <TableRow key={payment.id}>
                                            <TableCell>{payment.id}</TableCell>
                                            <TableCell>{payment.amount}</TableCell>
                                            <TableCell>{formatDate(payment.date_of_payment)}</TableCell>
                                            <TableCell>{payment.type_of_payment}</TableCell>

                                            <TableCell>{payment.member.first_name} {payment.member.last_name}</TableCell>
                                            <TableCell>{payment.member.email}</TableCell>
                                            <TableCell>{payment.member.phone}</TableCell>
                                            <TableCell className="text-right">
                                                <ActionsMenu
                                                    actions={[
                                                        {
                                                            type: 'item',
                                                            label: 'Detalji',
                                                            href: route('payments.edit', { payment: payment.id }),
                                                        },
                                                        {
                                                            type: 'item',
                                                            label: 'Uredi',
                                                            href: route('payments.edit', { payment: payment.id }),
                                                        },
                                                        { type: 'separator' },
                                                        {
                                                            type: 'item',
                                                            label: 'Obriši',
                                                            variant: 'destructive',
                                                            onSelect: () => router.delete(route('payments.destroy', { payment: payment.id })),
                                                        },
                                                    ]}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center text-muted-foreground">
                                            Nema uplata
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <div className="flex justify-end gap-2 mt-4">
                    {payments.links.map((link, index) => (
                        <Button
                            key={index}
                            asChild
                            variant={link.active ? 'secondary' : 'outline'}
                            disabled={!link.url}
                        >
                            <Link
                                href={link.url ?? '#'}
                                preserveScroll
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        </Button>
                    ))}
                </div>
            </ContentHolder>

        </AppLayout>
    );
}
