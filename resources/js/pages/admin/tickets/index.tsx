import React from 'react';
import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ActionsMenu } from '@/components/actions-menu';

type Ticket = {
    id: number;
    subject: string;
    status: string;
    admin_unread: boolean;
    user_unread: boolean;
    last_activity_at: string | null;
    created_at: string;
    user: { id: number; name: string };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Početna stranica', href: '/dashboard' },
    { title: 'Poruke (admin)', href: '/admin/tickets' },
];

const formatDateTime = (value: string | null) => {
    if (!value) return '-';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? value : d.toLocaleString('bs-BA');
};

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

export default function AdminTicketsIndex({ tickets, filters }: { tickets: Ticket[]; filters?: { search?: string } }) {
    const { data, setData } = useForm({
        search: filters?.search ?? '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.tickets.index'), { search: data.search }, { preserveScroll: true, preserveState: true });
    };

    const handleReset = () => {
        setData('search', '');
        router.get(route('admin.tickets.index'), {}, { preserveScroll: true });
    };

    const handleDelete = (ticketId: number) => {
        if (!confirm('Da li ste sigurni da želite obrisati ovu poruku?')) return;
        router.delete(route('admin.tickets.destroy', { ticket: ticketId }), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Poruke (admin)" />
            <ContentHolder>
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Poruke</h1>
                    <Badge variant="secondary">Nepročitani: {tickets.filter((t) => t.admin_unread).length}</Badge>
                </div>

                <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
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
                            <TableHead>Korisnik</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Zadnja aktivnost</TableHead>
                            <TableHead>Stvoreno</TableHead>
                            <TableHead className="text-right">Akcije</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tickets.length ? (
                            tickets.map((ticket) => (
                                <TableRow key={ticket.id} className={ticket.admin_unread ? 'bg-primary/5' : ''}>
                                    <TableCell>
                                        <Link href={route('admin.tickets.show', { ticket: ticket.id })} className="font-medium hover:underline">
                                            {ticket.subject}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{ticket.user.name}</TableCell>
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
                                                { type: 'item', label: 'Odgovori', href: route('admin.tickets.show', { ticket: ticket.id }) },
                                                { type: 'item', label: 'Pogledaj', href: route('admin.tickets.show', { ticket: ticket.id }) },
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
                                <TableCell colSpan={6} className="text-center text-muted-foreground">
                                    Nema tiketa.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </ContentHolder>
        </AppLayout>
    );
}
