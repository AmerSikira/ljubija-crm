import React from 'react';
import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
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

type Message = {
    id: number;
    author_type: 'user' | 'admin';
    author_id: number;
    author_name: string;
    message: string;
    created_at: string;
};

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

export default function TicketShow({ ticket, messages }: { ticket: Ticket; messages: Message[] }) {
    const { data, setData, post, processing, errors } = useForm({
        message: '',
    });

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
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <h1 className="text-2xl font-bold">{ticket.subject}</h1>
                        <div className="text-sm text-muted-foreground break-words">
                            Zadnja aktivnost: {formatDateTime(ticket.last_activity_at)}
                        </div>
                    </div>
                    <Badge variant={ticket.status === 'odgovoreno' ? 'secondary' : 'default'} className="w-fit">
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
                                            message.author_type === 'admin'
                                                ? 'border-border bg-muted/50'
                                                : 'border-border bg-background'
                                        }`}
                                    >
                                        <div className="flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
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
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <Button variant="outline" asChild className="w-full sm:w-auto">
                                        <Link href={route('tickets.index')}>Nazad na listu</Link>
                                    </Button>
                                    <Button variant="destructive" type="button" className="w-full sm:w-auto" onClick={handleTicketDelete}>
                                        Obriši poruku
                                    </Button>
                                </div>
                                <Button type="submit" className="w-full sm:w-auto" disabled={processing}>
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
