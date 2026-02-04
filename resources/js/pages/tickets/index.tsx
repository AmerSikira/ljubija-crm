import React from 'react';
import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ActionsMenu } from '@/components/actions-menu';
import { formatDateTimeEU } from '@/lib/utils';

type Ticket = {
    id: number;
    subject: string;
    status: string;
    admin_unread: boolean;
    user_unread: boolean;
    last_activity_at: string | null;
    created_at: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Početna stranica', href: '/dashboard' },
    { title: 'Poruke', href: '/tickets' },
];

const formatDateTime = (value: string | null) => formatDateTimeEU(value) || '-';

const statusLabel = (status: string) => {
    switch (status) {
        case 'odgovoreno':
            return 'Odgovoreno';
        case 'zatvoreno':
            return 'Zatvoreno';
        default:
            return 'Upit';
    }
};

export default function TicketsIndex({ tickets, filters }: { tickets: Ticket[]; filters?: { search?: string } }) {
    const { data, setData } = useForm({
        search: filters?.search ?? '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('tickets.index'), { search: data.search }, { preserveScroll: true, preserveState: true });
    };

    const handleReset = () => {
        setData('search', '');
        router.get(route('tickets.index'), {}, { preserveScroll: true });
    };

    const handleDelete = (ticketId: number) => {
        if (!confirm('Da li ste sigurni da želite obrisati ovu poruku?')) return;
        router.delete(route('tickets.destroy', { ticket: ticketId }), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Poruke" />
            <ContentHolder className="space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold">Poruke</h1>
                    <Button asChild>
                        <Link href={route('tickets.create')}>Nova poruka</Link>
                    </Button>
                </div>

                <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                        <Input
                            placeholder="Pretraži po naslovu"
                            value={data.search}
                            onChange={(e) => setData('search', e.target.value)}
                            className="w-full sm:w-72"
                        />
                        <div className="flex gap-2">
                            <Button type="submit" variant="secondary">
                                Pretraži
                            </Button>
                            <Button type="button" variant="outline" onClick={handleReset}>
                                Resetuj
                            </Button>
                        </div>
                    </div>
                </form>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Naslov</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Zadnja aktivnost</TableHead>
                            <TableHead>Kreirano</TableHead>
                            <TableHead className="text-right">Akcije</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tickets.length ? (
                            tickets.map((ticket) => (
                                <TableRow key={ticket.id} className={ticket.user_unread ? 'bg-primary/5' : ''}>
                                    <TableCell className="font-medium">
                                        <Link href={route('tickets.show', { ticket: ticket.id })} className="hover:underline">
                                            {ticket.subject}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={ticket.status === 'odgovoreno' ? 'secondary' : 'default'}>
                                            {statusLabel(ticket.status)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{formatDateTime(ticket.last_activity_at)}</TableCell>
                                    <TableCell>{formatDateTime(ticket.created_at)}</TableCell>
                                    <TableCell className="text-right">
                                        <ActionsMenu
                                            actions={[
                                                { type: 'item', label: 'Odgovori', href: route('tickets.show', { ticket: ticket.id }) },
                                                { type: 'item', label: 'Pogledaj', href: route('tickets.show', { ticket: ticket.id }) },
                                                { type: 'separator' },
                                                {
                                                    type: 'item',
                                                    label: 'Izbriši',
                                                    variant: 'destructive',
                                                    onSelect: () => handleDelete(ticket.id),
                                                },
                                            ]}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground">
                                    Još nema poruka.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </ContentHolder>
        </AppLayout>
    );
}
