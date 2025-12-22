import React from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Member } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import ContentHolder from "@/components/content-holder";
import { PlusIcon } from "lucide-react";
import { ActionsMenu } from "@/components/actions-menu";


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
    const { props } = usePage();
    const role = (props as any)?.auth?.user?.role ?? '';
    const isAdmin = role === 'admin';
    
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
                            <TableHead>ID</TableHead>
                            <TableHead>Slika</TableHead>
                            <TableHead>Naslov</TableHead>
                            <TableHead>Uvod</TableHead>
                            <TableHead className="text-right">Akcije</TableHead>
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
                                            <TableCell className="text-right">
                                                <ActionsMenu
                                                    actions={[
                                                        {
                                                            type: 'item',
                                                            label: 'Detalji',
                                                            href: route('articles.show', { article: article.id }),
                                                        },
                                                        {
                                                            type: 'item',
                                                            label: 'Uredi',
                                                            href: route('articles.edit', { article: article.id }),
                                                        },
                                                        ...(isAdmin
                                                            ? [
                                                                { type: 'separator' as const },
                                                                {
                                                                    type: 'item' as const,
                                                                    label: 'Obriši',
                                                                    variant: 'destructive',
                                                                    onSelect: () =>
                                                                        router.delete(route('articles.destroy', { article: article.id })),
                                                                },
                                                            ]
                                                            : []),
                                                    ]}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">
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
