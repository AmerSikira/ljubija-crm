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
        title: 'Uplate',
        href: '/payments',
    },
];



export default function Index({ payments }: Member[] | any) {
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Uplate" />
            <ContentHolder>
                <div className="flex items-center justify-end">
                    <Button asChild>
                        <Link href={route('payments.create')}>
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Dodaj uplatu
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
                                Iznos
                            </TableHead>
                            <TableHead>
                                Vrsta
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
                            payments.length > 0 ? (


                                payments.map((payment, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{payment.id}</TableCell>
                                                <TableCell>{payment.amount}</TableCell>
                                            <TableCell>{payment.type_of_payment}</TableCell>

                                            <TableCell>{payment.member.first_name} {payment.member.last_name}</TableCell>
                                            <TableCell>{payment.member.email}</TableCell>
                                            <TableCell>{payment.member.phone}</TableCell>
                                            <TableCell>
                                                <Button asChild>
                                                    <Link href={route('payments.edit', { payment: payment.id })}>
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
                                        Nema uplata
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