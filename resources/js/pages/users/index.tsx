import React from 'react';
import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ActionsMenu } from '@/components/actions-menu';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Početna stranica', href: '/dashboard' },
    { title: 'Korisnici', href: '/users' },
];

type User = {
    id: number;
    name?: string | null;
    email: string;
    role: string;
    avatar?: string | null;
    created_at?: string;
};

const formatDate = (value?: string) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('bs-BA');
};

export default function UsersIndex({ users = [], roleLabels = {} }: { users: User[]; roleLabels: Record<string, string> }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Korisnici" />
            <ContentHolder>
                <div className="mb-4">
                    <h1 className="text-2xl font-bold">Korisnici</h1>
                    <p className="text-sm text-muted-foreground">Administratorski pregled svih korisnika.</p>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Ime</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Uloga</TableHead>
                            <TableHead>Kreiran</TableHead>
                            <TableHead className="text-right">Akcije</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length ? (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell className="flex items-center gap-2">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt={user.name ?? user.email} className="h-8 w-8 rounded-full object-cover" />
                                        ) : null}
                                        <span>{user.name || '-'}</span>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell className="capitalize">{roleLabels[user.role] ?? user.role}</TableCell>
                                    <TableCell>{formatDate(user.created_at)}</TableCell>
                                    <TableCell className="text-right">
                                        <ActionsMenu
                                            actions={[
                                                {
                                                    type: 'item',
                                                    label: 'Uredi',
                                                    href: route('users.edit', { user: user.id }),
                                                },
                                            ]}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    Nema korisnika
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </ContentHolder>
        </AppLayout>
    );
}
