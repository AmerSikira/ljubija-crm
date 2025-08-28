import React from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Member } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import ContentHolder from "@/components/content-holder";


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



export default function Index({ members }: Member[] | any) {
    console.log(members);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Članovi" />
            <ContentHolder>
                <div className="flex items-center justify-end">
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
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            members.length > 0 ? (


                                members.map((member, index) => {
                                    return (
                                        <TableRow key={index}>
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
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        Nema članova
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </ContentHolder>

        </AppLayout>
    );
}