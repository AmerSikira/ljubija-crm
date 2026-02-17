import React from 'react';
import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Head, useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { type BreadcrumbItem } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string | null;
    created_at?: string;
};

export default function UsersEdit({ user, roleLabels = {} }: { user: User; roleLabels: Record<string, string> }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Početna stranica', href: '/dashboard' },
        { title: 'Korisnici', href: '/users' },
        { title: 'Uredi korisnika', href: `/users/${user.id}` },
    ];
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name: user.name ?? '',
        role: user.role ?? 'subscriber',
        avatar: user.avatar ?? '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('users.update', { user: user.id }), { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Uredi korisnika" />
            <ContentHolder>
                <Card>
                    <CardHeader>
                        <CardTitle>Uredi korisnika</CardTitle>
                        <p className="text-sm text-muted-foreground">Email i lozinka se ne mogu mijenjati.</p>
                    </CardHeader>
                    <CardContent>
                        <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="name">Ime</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={user.email} disabled />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="role">Uloga</Label>
                                <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder="Odaberite ulogu" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(roleLabels).map(([value, label]) => (
                                            <SelectItem key={value} value={value}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.role} />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="avatar">Avatar URL</Label>
                                <Input
                                    id="avatar"
                                    type="text"
                                    value={data.avatar ?? ''}
                                    onChange={(e) => setData('avatar', e.target.value)}
                                    placeholder="https://..."
                                />
                                <InputError message={errors.avatar} />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    Spremi promjene
                                </Button>
                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-muted-foreground">Sačuvano</p>
                                </Transition>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </ContentHolder>
        </AppLayout>
    );
}
