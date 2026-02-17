import React from 'react';
import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
    user: { id: number; name: string };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Početna stranica', href: '/dashboard' },
    { title: 'Poruke (admin)', href: '/admin/tickets' },
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
                <div className="mb-4 space-y-3">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <h1 className="text-2xl font-bold">Poruke</h1>
                        <Badge variant="secondary">Nepročitani: {tickets.filter((t) => t.admin_unread).length}</Badge>
                    </div>

                    <form onSubmit={handleSearch} className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:items-center">
                        <Input
                            placeholder="Pretraži po naslovu"
                            value={data.search}
                            onChange={(e) => setData('search', e.target.value)}
                        />

                        <div className="flex items-center gap-2">
                            <Button type="submit" variant="secondary" className="w-full sm:w-auto">
                                Pretraži
                            </Button>
                            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={handleReset}>
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
                                    <TableHead>Naslov</TableHead>
                                    <TableHead>Korisnik</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Zadnja aktivnost</TableHead>
                                    <TableHead>Kreirano</TableHead>
                                    <TableHead className="w-40 text-right">Opcije</TableHead>
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
                    </CardContent>
                </Card>
            </ContentHolder>
        </AppLayout>
    );
}
