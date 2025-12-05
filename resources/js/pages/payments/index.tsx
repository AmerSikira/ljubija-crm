import React from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import ContentHolder from "@/components/content-holder";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/date-picker";


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
    const formatDate = (value?: string | null) => {
        if (!value) return '';
        const d = new Date(value);
        if (isNaN(d.getTime())) return value;
        return d.toLocaleDateString('en-GB'); // dd/mm/yyyy
    };

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
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 gap-2 sm:grid-cols-5 sm:items-center sm:gap-3">
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
                        
                            <Button type="submit" variant="secondary">Pretraži</Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setData({ name: '', amount: '', date: '' });
                                    router.get(route('payments'), {}, { preserveScroll: true });
                                }}
                            >
                                Reset
                            </Button>
                        
                    </form>
                    <Button asChild>
                        <Link href={route('payments.create')}>
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Dodaj uplatu
                        </Link>
                    </Button>
                </div>
                <p className="text-sm text-muted-foreground my-2">Prikazuje se zadnjih 20 uplata po stranici.</p>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                ID
                            </TableHead>
                            <TableHead>
                                Iznos
                            </TableHead>
                            <TableHead>
                                Datum uplate
                            </TableHead>
                            <TableHead>
                                Vrsta
                            </TableHead>
                            <TableHead>
                                Ime i prezime
                            </TableHead>
                            <TableHead>
                                Email
                            </TableHead>
                            <TableHead>
                                Telefon
                            </TableHead>
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
                                    <TableCell>
                                        <Button asChild>
                                            <Link href={route('payments.edit', { payment: payment.id })}>
                                                Uredi
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center">
                                    Nema uplata
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <div className="flex justify-end gap-2 mt-4">
                    {payments.links.map((link, index) => (
                        <Button
                            key={index}
                            asChild
                            variant={link.active ? "secondary" : "outline"}
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
