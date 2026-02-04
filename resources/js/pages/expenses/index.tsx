import React from 'react';
import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { ActionsMenu } from '@/components/actions-menu';
import { formatDateEU } from '@/lib/utils';

type Expense = {
    id: number;
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
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Input
                            placeholder="Pretraži po nazivu ili opisu"
                            value={data.search}
                            onChange={(e) => setData('search', e.target.value)}
                            className="w-full sm:w-80"
                        />
                        <div className="flex gap-2">
                            <Button type="submit" variant="secondary">Pretraži</Button>
                            <Button type="button" variant="outline" onClick={reset}>Reset</Button>
                        </div>
                    </form>
                    {isManager && (
                        <Button asChild>
                            <Link href={route('expenses.create')}>
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Dodaj rashod
                            </Link>
                        </Button>
                    )}
                </div>

                <Table className="mt-4">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Vrsta</TableHead>
                            <TableHead>Naziv</TableHead>
                            <TableHead>Opis</TableHead>
                            <TableHead>Iznos (KM)</TableHead>
                            <TableHead>Datum isplate</TableHead>
                            <TableHead>Kreirano</TableHead>
                            <TableHead className="text-right">Akcije</TableHead>
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
                                <TableCell colSpan={6} className="text-center">
                                    Nema rashoda
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </ContentHolder>
        </AppLayout>
    );
}
