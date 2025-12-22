import React from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import ContentHolder from "@/components/content-holder";
import { Input } from "@/components/ui/input";
import { ActionsMenu } from "@/components/actions-menu";


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
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Input
                            placeholder="Pretraga po imenu, emailu ili telefonu"
                            value={data.search}
                            onChange={(e) => setData('search', e.target.value)}
                            className="w-full sm:w-72"
                        />
                        <div className="flex gap-2">
                            <Button type="submit" variant="secondary">Pretraži</Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setData('search', '');
                                    router.get(route('members'), {}, { preserveScroll: true });
                                }}
                            >
                                Reset
                            </Button>
                        </div>
                    </form>
                    <Button asChild>
                        <Link href={route('members.create')}>
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Dodaj člana
                        </Link>
                    </Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Ime i prezime</TableHead>
                            <TableHead>Ime oca</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Telefon</TableHead>
                            <TableHead className="text-right">Akcije</TableHead>
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
                                <TableCell colSpan={6} className="text-center">
                                    Nema članova
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <div className="flex justify-end gap-2 mt-4">
                    {members.links.map((link, index) => (
                        <Button
                            key={index}
                            asChild
                            variant={link.active ? "secondary" : "outline"}
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
