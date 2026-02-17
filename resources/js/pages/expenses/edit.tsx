import React from 'react';
import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Head, router, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ExpensePayload = {
    id: number;
    type: string;
    title: string;
    description?: string | null;
    amount: number;
    paid_at?: string | null;
};

const breadcrumbs = (id: number): BreadcrumbItem[] => [
    { title: 'Početna stranica', href: '/dashboard' },
    { title: 'Rashodi', href: '/expenses' },
    { title: `Uredi #${id}`, href: `/expenses/${id}/edit` },
];

export default function EditExpense({ expense, types }: { expense: ExpensePayload; types: string[] }) {
    const { data, setData, post, processing, errors } = useForm({
        type: expense.type,
        title: expense.title,
        description: expense.description ?? '',
        amount: expense.amount,
        paid_at: expense.paid_at ?? '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('expenses.update', { expense: expense.id }));
    };

    const handleDelete = () => {
        router.delete(route('expenses.destroy', { expense: expense.id }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(expense.id)}>
            <Head title={`Uredi rashod #${expense.id}`} />
            <ContentHolder>
                <div className="mb-4">
                    <h1 className="text-2xl font-bold">Uredi rashod</h1>
                </div>
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Detalji rashoda</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="type">Vrsta rashoda *</Label>
                                <Select
                                    value={data.type}
                                    onValueChange={(val) => setData('type', val)}
                                >
                                    <SelectTrigger id="type">
                                        <SelectValue placeholder="Odaberite vrstu rashoda" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {types.map((t) => (
                                            <SelectItem key={t} value={t}>
                                                {t}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.type && <span className="text-sm text-destructive">{errors.type}</span>}
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="title">Naziv *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                />
                                {errors.title && <span className="text-sm text-destructive">{errors.title}</span>}
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="description">Opis</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Detalji rashoda"
                                />
                                {errors.description && <span className="text-sm text-destructive">{errors.description}</span>}
                            </div>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="amount">Iznos (KM) *</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.amount}
                                        onChange={(e) => setData('amount', e.target.value)}
                                    />
                                    {errors.amount && <span className="text-sm text-destructive">{errors.amount}</span>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="paid_at">Datum isplate *</Label>
                                    <Input
                                        id="paid_at"
                                        type="date"
                                        value={data.paid_at}
                                        onChange={(e) => setData('paid_at', e.target.value)}
                                    />
                                    {errors.paid_at && <span className="text-sm text-destructive">{errors.paid_at}</span>}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing}>Spremi</Button>
                                <Button type="button" variant="destructive" onClick={handleDelete}>Obriši</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </ContentHolder>
        </AppLayout>
    );
}
