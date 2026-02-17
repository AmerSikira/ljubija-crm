import React from 'react';
import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ActionsMenu } from '@/components/actions-menu';
import { formatDateEU } from '@/lib/utils';

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

const formatDate = (value?: string) => formatDateEU(value) || '-';

export default function UsersIndex({ users = [], roleLabels = {} }: { users: User[]; roleLabels: Record<string, string> }) {
    const [search, setSearch] = React.useState('');

    const filteredUsers = React.useMemo(() => {
        const query = search.trim().toLowerCase();
        return (users ?? []).filter((user) => {
            const name = (user.name ?? '').toLowerCase();
            const email = (user.email ?? '').toLowerCase();
            const role = (roleLabels[user.role] ?? user.role ?? '').toLowerCase();
            return !query || name.includes(query) || email.includes(query) || role.includes(query);
        });
    }, [roleLabels, search, users]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Korisnici" />
            <ContentHolder>
                <div className="mb-4 space-y-3">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <h1 className="text-2xl font-bold">Korisnici</h1>
                        <p className="text-sm text-muted-foreground">Administratorski pregled svih korisnika.</p>
                    </div>

                    <form
                        className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:items-center"
                        onSubmit={(event) => event.preventDefault()}
                    >
                        <Input
                            placeholder="Pretraga po imenu, emailu ili ulozi"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />

                        <div className="flex items-center gap-2">
                            <Button type="submit" variant="secondary" className="w-full sm:w-auto">
                                Pretraži
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full sm:w-auto"
                                onClick={() => setSearch('')}
                            >
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
                                    <TableHead>ID</TableHead>
                                    <TableHead>Ime</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Uloga</TableHead>
                                    <TableHead>Kreiran</TableHead>
                                    <TableHead className="w-40 text-right">Opcije</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.length ? (
                                    filteredUsers.map((user) => (
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
                                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                                            {search ? 'Nema rezultata pretrage' : 'Nema korisnika'}
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
