import React from 'react';
import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Head, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDateEU } from '@/lib/utils';

type UnverifiedUser = {
    id: number;
    name?: string | null;
    email: string;
    role: string;
    created_at?: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Početna stranica', href: '/dashboard' },
    { title: 'Neverifikovani članovi', href: '/unverified-users' },
];

const formatDate = (value?: string) => formatDateEU(value) || '-';

export default function UnverifiedIndex({ users = [], isAdmin }: { users: UnverifiedUser[]; isAdmin: boolean }) {
    const [search, setSearch] = React.useState('');

    const filteredUsers = React.useMemo(() => {
        const query = search.trim().toLowerCase();
        return (users ?? []).filter((user) => {
            const name = (user.name ?? '').toLowerCase();
            const email = (user.email ?? '').toLowerCase();
            const role = (user.role ?? '').toLowerCase();
            return !query || name.includes(query) || email.includes(query) || role.includes(query);
        });
    }, [search, users]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Neverifikovani članovi" />
            <ContentHolder>
                <div className="mb-4 space-y-3">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <h1 className="text-2xl font-bold">Neverifikovani članovi</h1>
                        <p className="text-sm text-muted-foreground">
                            {isAdmin
                                ? 'Korisnici bez dodijeljenog člana. Možete ih ukloniti ako nisu validni.'
                                : 'Vaš račun još nema dodijeljenog člana. Obratite se administratoru.'}
                        </p>
                    </div>

                    {isAdmin && (
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
                    )}
                </div>

                {isAdmin ? (
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
                                                <TableCell>{user.name || '-'}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell className="capitalize">{user.role}</TableCell>
                                                <TableCell>{formatDate(user.created_at)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => router.delete(route('unverified-users.destroy', { user: user.id }))}
                                                    >
                                                        Obriši
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center text-muted-foreground">
                                                {search ? 'Nema rezultata pretrage' : 'Nema neverifikovanih korisnika'}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="rounded-lg border bg-card p-4">
                        <p className="mb-2 font-semibold">Nemate pristup aplikaciji.</p>
                        <p className="text-sm text-muted-foreground">
                            Vaš korisnički račun još nije povezan sa članskim profilom. Molimo kontaktirajte administratora da vas doda kao člana.
                        </p>
                    </div>
                )}
            </ContentHolder>
        </AppLayout>
    );
}
