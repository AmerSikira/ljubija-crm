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
        title: 'Vijesti',
        href: '/articles',
    },
];



export default function Index({ articles }: Member[] | any) {
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vijesti" />
            <ContentHolder>
                <div className="flex items-center justify-end">
                    <Button asChild>
                        <Link href={route('articles.create')}>
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Dodaj vijest
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
                        {
                            articles.length > 0 ? (


                                articles.map((article, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{article.id}</TableCell>
                                            <TableCell><img src={article.image_url} className="w-20 h-20 object-cover"/></TableCell>
                                            <TableCell>{article.title}</TableCell>
                                            <TableCell>{article.intro}</TableCell>
                                            <TableCell >
                                                <Button asChild>
                                                    <Link href={route('articles.edit', { article: article.id })}>
                                                        Uredi
                                                    </Link>
                                                </Button>

                                                <Button asChild className="ml-2" variant="secondary">
                                                    <Link href={route('articles.show', { article: article.id })}>
                                                        Pročitaj
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        Nema vijesti
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