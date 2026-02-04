import React from 'react';
import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Head, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
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
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Neverifikovani članovi" />
            <ContentHolder>
                <div className="mb-4">
                    <h1 className="text-2xl font-bold">Neverifikovani članovi</h1>
                    <p className="text-sm text-muted-foreground">
                        {isAdmin
                            ? 'Korisnici bez dodijeljenog člana. Možete ih ukloniti ako nisu validni.'
                            : 'Vaš račun još nema dodijeljenog člana. Obratite se administratoru.'}
                    </p>
                </div>

                {isAdmin ? (
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
                                    <TableCell colSpan={6} className="text-center">
                                        Nema neverifikovanih korisnika
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
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
