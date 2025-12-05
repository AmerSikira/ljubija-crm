import React from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
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
        title: 'Moje uplate',
        href: '/my-payments',
    },
];



type Payment = {
    id: number;
    amount: number;
    type_of_payment: string;
    date_of_payment: string;
};

export default function Index({ payments }: { payments: Payment[] }) {
    const formatDate = (value?: string | null) => {
        if (!value) return '';
        const d = new Date(value);
        if (isNaN(d.getTime())) return value;
        return d.toLocaleDateString('en-GB'); // dd/mm/yyyy
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Uplate" />
            <ContentHolder>
        
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
                                Datum uplate
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
                                            <TableCell>{formatDate(payment.date_of_payment)}</TableCell> 
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
