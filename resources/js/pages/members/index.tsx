import React from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import ContentHolder from "@/components/content-holder";
import { Input } from "@/components/ui/input";


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
                            <TableHead>
                                ID
                            </TableHead>
                            <TableHead>
                                Ime i prezime
                            </TableHead>
                            <TableHead>
                                Email
                            </TableHead>
                            <TableHead>
                                Telefon
                            </TableHead>
                            <TableHead>
                                Akcije
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {members.data.length > 0 ? (
                            members.data.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell>{member.id}</TableCell>
                                    <TableCell>{member.first_name} {member.last_name}</TableCell>
                                    <TableCell>{member.email}</TableCell>
                                    <TableCell>{member.phone}</TableCell>
                                    <TableCell>
                                        <Button asChild>
                                            <Link href={route('members.edit', { member: member.id })}>
                                                Uredi
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">
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
