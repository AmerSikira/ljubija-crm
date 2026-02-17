import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import ContentHolder from '@/components/content-holder';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { formatDateEU } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Početna stranica',
        href: '/dashboard',
    },
    {
        title: 'Moje uplate',
        href: '/my-payments',
    },
];

type Payment = {
    id: number;
    amount: number;
    type_of_payment: string;
    date_of_payment: string;
};

export default function Index({ payments }: { payments: Payment[] }) {
    const formatDate = (value?: string | null) => formatDateEU(value) || '';
    const [search, setSearch] = React.useState('');

    const filteredPayments = React.useMemo(() => {
        const query = search.trim().toLowerCase();
        return (payments ?? []).filter((payment) => {
            const type = (payment.type_of_payment ?? '').toLowerCase();
            const date = formatDate(payment.date_of_payment).toLowerCase();
            const amount = String(payment.amount ?? '').toLowerCase();
            return !query || type.includes(query) || date.includes(query) || amount.includes(query);
        });
    }, [payments, search]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Moje uplate" />
            <ContentHolder>
                <div className="mb-4 space-y-3">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <h1 className="text-2xl font-bold">Moje uplate</h1>
                    </div>

                    <form
                        className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:items-center"
                        onSubmit={(event) => event.preventDefault()}
                    >
                        <Input
                            placeholder="Pretraga po vrsti, datumu ili iznosu"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />

                        <div className="flex items-center gap-2">
                            <Button type="submit" variant="secondary" className="w-full sm:w-auto">
                                Pretraži
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full sm:w-auto"
                                onClick={() => setSearch('')}
                            >
                                Reset
                            </Button>
                        </div>
                    </form>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Iznos</TableHead>
                                    <TableHead>Vrsta</TableHead>
                                    <TableHead>Datum uplate</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPayments.length > 0 ? (
                                    filteredPayments.map((payment) => (
                                        <TableRow key={payment.id}>
                                            <TableCell>{payment.id}</TableCell>
                                            <TableCell>{payment.amount}</TableCell>
                                            <TableCell>{payment.type_of_payment}</TableCell>
                                            <TableCell>{formatDate(payment.date_of_payment)}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                                            {search ? 'Nema rezultata pretrage' : 'Nema uplata'}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </ContentHolder>
        </AppLayout>
    );
}
