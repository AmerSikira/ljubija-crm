import React from 'react';
import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

type Ticket = {
    id: number;
    subject: string;
    status: string;
    admin_unread: boolean;
    user_unread: boolean;
    last_activity_at: string | null;
    created_at: string;
};

type Message = {
    id: number;
    author_type: 'user' | 'admin';
    author_id: number;
    author_name: string;
    message: string;
    created_at: string;
};

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

export default function TicketShow({ ticket, messages }: { ticket: Ticket; messages: Message[] }) {
    const { data, setData, post, processing, errors } = useForm({
        message: '',
    });
    const page = usePage();
    const authUser = (page.props as any)?.auth?.user;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('tickets.messages.store', { ticket: ticket.id }), {
            onSuccess: () => setData('message', ''),
        });
    };

    const handleTicketDelete = () => {
        if (!confirm('Da li ste sigurni da želite obrisati ovu poruku?')) return;
        router.delete(route('tickets.destroy', { ticket: ticket.id }), {
            preserveScroll: true,
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Početna stranica', href: '/dashboard' },
        { title: 'Poruke', href: '/tickets' },
        { title: ticket.subject, href: `/tickets/${ticket.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={ticket.subject} />
            <ContentHolder className="space-y-6">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold">{ticket.subject}</h1>
                        <div className="text-sm text-muted-foreground">
                            Zadnja aktivnost: {formatDateTime(ticket.last_activity_at)}
                        </div>
                    </div>
                    <Badge variant={ticket.status === 'odgovoreno' ? 'secondary' : 'default'}>
                        {statusLabel(ticket.status)}
                    </Badge>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Razgovor</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-3">
                            {messages.length ? (
                                messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`rounded-md border p-3 ${
                                            message.author_type === 'admin' ? 'bg-slate-50' : 'bg-white'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>{message.author_type === 'admin' ? 'Admin' : message.author_name}</span>
                                            <span>{formatDateTime(message.created_at)}</span>
                                        </div>
                                        <p className="mt-1 whitespace-pre-wrap text-sm">{message.message}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">Nema poruka.</p>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <Textarea
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                placeholder="Napišite novu poruku"
                                required
                                minLength={5}
                            />
                            <InputError message={errors.message} />
                            <div className="flex justify-between">
                                <div className="flex gap-2">
                                    <Button variant="ghost" asChild>
                                        <Link href={route('tickets.index')}>Nazad na listu</Link>
                                    </Button>
                                    <Button variant="destructive" type="button" onClick={handleTicketDelete}>
                                        Obriši poruku
                                    </Button>
                                </div>
                                <Button type="submit" disabled={processing}>
                                    Pošalji
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </ContentHolder>
        </AppLayout>
    );
}
