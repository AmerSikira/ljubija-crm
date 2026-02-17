import React from 'react';
import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Head, Link, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Početna stranica', href: '/dashboard' },
    { title: 'Poruke', href: '/tickets' },
    { title: 'Nova poruka', href: '/tickets/create' },
];

export default function TicketCreate() {
    const { data, setData, post, processing, errors } = useForm({
        subject: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('tickets.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nova poruka" />
            <ContentHolder className="space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Nova poruka</CardTitle>
                        <Button variant="ghost" asChild>
                            <Link href={route('tickets.index')}>Nazad na tikete</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="subject">Naslov</Label>
                                <Input
                                    id="subject"
                                    value={data.subject}
                                    onChange={(e) => setData('subject', e.target.value)}
                                    required
                                    maxLength={150}
                                />
                                <InputError message={errors.subject} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Poruka</Label>
                                <Textarea
                                    id="message"
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    required
                                    minLength={5}
                                    rows={5}
                                    placeholder="Opišite upit ili problem..."
                                />
                                <InputError message={errors.message} />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" type="button" asChild>
                                    <Link href={route('tickets.index')}>Otkaži</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Pošalji poruku
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </ContentHolder>
        </AppLayout>
    );
}
