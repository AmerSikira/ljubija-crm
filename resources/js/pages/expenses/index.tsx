import React from 'react';
import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ActionsMenu } from '@/components/actions-menu';
import { Card, CardContent } from '@/components/ui/card';
import { formatDateEU } from '@/lib/utils';

type Expense = {
    id: number;
    type?: string | null;
    title: string;
    description?: string | null;
    amount: number;
    paid_at?: string | null;
    created_by?: string | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Početna stranica', href: '/dashboard' },
    { title: 'Rashodi', href: '/expenses' },
];

const formatMoney = (val: number) =>
    new Intl.NumberFormat('bs-BA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);

export default function ExpensesIndex({ expenses, filters }: { expenses: Expense[]; filters?: { search?: string } }) {
    const { props } = usePage();
    const role = (props as any)?.auth?.user?.role ?? '';
    const isManager = role === 'admin' || role === 'manager';

    const { data, setData } = useForm({
        search: filters?.search ?? '',
    });

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get(route('expenses.index'), { search: data.search }, { preserveScroll: true, preserveState: true });
    };

    const reset = () => {
        setData('search', '');
        router.get(route('expenses.index'), {}, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rashodi" />
            <ContentHolder>
                <div className="mb-4 space-y-3">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <h1 className="text-2xl font-bold">Rashodi</h1>
                        {isManager && (
                            <Button asChild>
                                <Link href={route('expenses.create')}>
                                    Dodaj novo
                                </Link>
                            </Button>
                        )}
                    </div>

                    <form onSubmit={handleSearch} className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:items-center">
                        <Input
                            placeholder="Pretraži po nazivu ili opisu"
                            value={data.search}
                            onChange={(e) => setData('search', e.target.value)}
                        />

                        <div className="flex items-center gap-2">
                            <Button type="submit" variant="secondary" className="w-full sm:w-auto">Pretraži</Button>
                            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={reset}>Reset</Button>
                        </div>
                    </form>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Vrsta</TableHead>
                                    <TableHead>Naziv</TableHead>
                                    <TableHead>Opis</TableHead>
                                    <TableHead>Iznos (KM)</TableHead>
                                    <TableHead>Datum isplate</TableHead>
                                    <TableHead>Kreirano</TableHead>
                                    <TableHead className="w-40 text-right">Opcije</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {expenses.length ? (
                                    expenses.map((expense) => (
                                        <TableRow key={expense.id}>
                                            <TableCell>{expense.type}</TableCell>
                                            <TableCell>
                                                <Link href={route('expenses.show', { expense: expense.id })} className="font-medium hover:underline">
                                                    {expense.title}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="max-w-md truncate">{expense.description || '-'}</TableCell>
                                            <TableCell>{formatMoney(expense.amount)}</TableCell>
                                            <TableCell>{formatDateEU(expense.paid_at) || '-'}</TableCell>
                                            <TableCell>{expense.created_by ?? '-'}</TableCell>
                                            <TableCell className="text-right">
                                                <ActionsMenu
                                                    actions={[
                                                        { type: 'item', label: 'Detalji', href: route('expenses.show', { expense: expense.id }) },
                                                        ...(isManager
                                                            ? [
                                                                { type: 'item' as const, label: 'Uredi', href: route('expenses.edit', { expense: expense.id }) },
                                                                { type: 'separator' as const },
                                                                {
                                                                    type: 'item' as const,
                                                                    label: 'Obriši',
                                                                    variant: 'destructive',
                                                                    onSelect: () => router.delete(route('expenses.destroy', { expense: expense.id })),
                                                                },
                                                            ]
                                                            : []),
                                                    ]}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                                            Nema rashoda
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
