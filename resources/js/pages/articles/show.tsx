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
    {
        title: 'Pregled vijesti',
        href: '#'
    },
];



export default function Show({ article }: any) {
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vijesti" />
            <ContentHolder>
                <h1 className='font-bold text-4xl mb-4'>{article.title}</h1>
                <img src={article.image_url} className="w-full h-auto mb-2"/>
                <p className='mb-4 font-bold'>{article.intro}</p>
                <div dangerouslySetInnerHTML={{ __html: article.main_text }} />
            </ContentHolder>

        </AppLayout>
    );
}