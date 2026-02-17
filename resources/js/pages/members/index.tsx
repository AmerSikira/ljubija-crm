import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import ContentHolder from '@/components/content-holder';
import { Input } from '@/components/ui/input';
import { ActionsMenu } from '@/components/actions-menu';
import { Card, CardContent } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Početna stranica',
        href: '/dashboard',
    },
    {
        title: 'Članovi',
        href: '/members',
    },
];

type Member = {
    id: number;
    first_name: string;
    last_name: string;
    title?: string | null;
    fathers_name?: string | null;
    profile_image_url?: string | null;
    email?: string | null;
    phone?: string | null;
};

type Pagination<T> = {
    data: T[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
};

export default function Index({ members, filters }: { members: Pagination<Member>; filters?: { search?: string } }) {
    const { data, setData } = useForm({
        search: filters?.search ?? '',
    });

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get(route('members'), { search: data.search }, { preserveState: true, preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Članovi" />
            <ContentHolder>
                <div className="mb-4 space-y-3">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <h1 className="text-2xl font-bold">Članovi</h1>
                        <Button asChild>
                            <Link href={route('members.create')}>Dodaj novo</Link>
                        </Button>
                    </div>

                    <form onSubmit={handleSearch} className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:items-center">
                        <Input
                            placeholder="Pretraga po imenu, emailu ili telefonu"
                            value={data.search}
                            onChange={(e) => setData('search', e.target.value)}
                        />

                        <div className="flex items-center gap-2">
                            <Button type="submit" variant="secondary" className="w-full sm:w-auto">
                                Pretraži
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full sm:w-auto"
                                onClick={() => {
                                    setData('search', '');
                                    router.get(route('members'), {}, { preserveScroll: true });
                                }}
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
                                    <TableHead>Ime i prezime</TableHead>
                                    <TableHead>Ime oca</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Telefon</TableHead>
                                    <TableHead className="w-40 text-right">Opcije</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {members.data.length > 0 ? (
                                    members.data.map((member) => (
                                        <TableRow key={member.id}>
                                            <TableCell>{member.id}</TableCell>
                                            <TableCell className="flex items-center gap-2">
                                                {member.profile_image_url && (
                                                    <img
                                                        src={member.profile_image_url}
                                                        alt={`${member.first_name} ${member.last_name}`}
                                                        className="h-8 w-8 rounded-full object-cover"
                                                    />
                                                )}
                                                <span>{member.title ? `${member.title} ` : ''}{member.first_name} {member.last_name}</span>
                                            </TableCell>
                                            <TableCell>{member.fathers_name || '-'}</TableCell>
                                            <TableCell>{member.email}</TableCell>
                                            <TableCell>{member.phone}</TableCell>
                                            <TableCell className="text-right">
                                                <ActionsMenu
                                                    actions={[
                                                        {
                                                            type: 'item',
                                                            label: 'Detalji',
                                                            href: route('members.edit', { member: member.id }),
                                                        },
                                                        {
                                                            type: 'item',
                                                            label: 'Uredi',
                                                            href: route('members.edit', { member: member.id }),
                                                        },
                                                        { type: 'separator' },
                                                        {
                                                            type: 'item',
                                                            label: 'Obriši',
                                                            variant: 'destructive',
                                                            onSelect: () => router.delete(route('members.destroy', { member: member.id })),
                                                        },
                                                    ]}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                                            Nema članova
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="mt-4 flex justify-end gap-2">
                    {members.links.map((link, index) => (
                        <Button
                            key={index}
                            asChild
                            variant={link.active ? 'secondary' : 'outline'}
                            disabled={!link.url}
                        >
                            <Link
                                href={link.url ?? '#'}
                                preserveScroll
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        </Button>
                    ))}
                </div>
            </ContentHolder>
        </AppLayout>
    );
}
