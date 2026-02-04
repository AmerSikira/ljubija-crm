import React from 'react';
import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Head, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDateEU, formatDateTimeEU } from '@/lib/utils';

type Expense = {
    id: number;
    type: string;
    title: string;
    description?: string | null;
    amount: number;
    paid_at?: string | null;
    created_by?: string | null;
    created_at?: string | null;
};

const formatMoney = (val: number) =>
    new Intl.NumberFormat('bs-BA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);

const breadcrumbs = (id: number): BreadcrumbItem[] => [
    { title: 'Početna stranica', href: '/dashboard' },
    { title: 'Rashodi', href: '/expenses' },
    { title: `Rashod #${id}`, href: `/expenses/${id}` },
];

export default function ExpenseShow({ expense }: { expense: Expense }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs(expense.id)}>
            <Head title={`Rashod #${expense.id}`} />
            <ContentHolder>
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{expense.title}</h1>
                        <p className="text-sm text-muted-foreground">
                            Isplaćeno: {formatDateEU(expense.paid_at) || '-'}
                        </p>
                    </div>
                    <Button variant="ghost" asChild>
                        <Link href={route('expenses.index')}>Nazad</Link>
                    </Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Detalji rashoda</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <p className="text-sm text-muted-foreground">Vrsta</p>
                            <p className="font-medium">{expense.type}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Iznos</p>
                            <p className="text-lg font-semibold">{formatMoney(expense.amount)} KM</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Opis</p>
                            <p>{expense.description || 'Nema opisa'}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <p className="text-sm text-muted-foreground">Datum isplate</p>
                                <p>{formatDateEU(expense.paid_at) || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Evidentirao</p>
                                <p>{expense.created_by ?? '-'}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Kreirano</p>
                            <p>{formatDateTimeEU(expense.created_at) || '-'}</p>
                        </div>
                    </CardContent>
                </Card>
            </ContentHolder>
        </AppLayout>
    );
}
