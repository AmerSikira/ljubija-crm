import React from "react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import ContentHolder from "@/components/content-holder";
import { ActionsMenu } from "@/components/actions-menu";

type PollItem = {
    id: number;
    title: string;
    votes_count: number;
};

type Poll = {
    id: number;
    title: string;
    description?: string | null;
    votes_count?: number;
    items?: PollItem[];
    finished_at?: string | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Početna stranica",
        href: "/dashboard",
    },
    {
        title: "Ankete",
        href: "/polls",
    },
];

export default function Index({ polls }: { polls: Poll[] }) {
    const { props } = usePage();
    const role = (props as any)?.auth?.user?.role ?? '';
    const isAdmin = role === 'admin';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ankete" />
            <ContentHolder>
                <div className="flex items-center justify-end">
                    <Button asChild>
                        <Link href={route("polls.create")}>
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Dodaj anketu
                        </Link>
                    </Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Naziv</TableHead>
                            <TableHead>Opis</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Broj opcija</TableHead>
                            <TableHead>Ukupno glasova</TableHead>
                            <TableHead className="text-right">Akcije</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {polls.length > 0 ? (
                            polls.map((poll) => (
                                <TableRow key={poll.id}>
                                    <TableCell>{poll.id}</TableCell>
                                    <TableCell>{poll.title}</TableCell>
                                    <TableCell className="max-w-xs truncate">{poll.description}</TableCell>
                                    <TableCell className="font-semibold">
                                        {poll.finished_at ? 'Završena' : 'Aktivna'}
                                    </TableCell>
                                    <TableCell>{poll.items?.length ?? 0}</TableCell>
                                    <TableCell>{poll.votes_count ?? 0}</TableCell>
                                    <TableCell className="text-right">
                                        <ActionsMenu
                                            actions={[
                                                {
                                                    type: 'item',
                                                    label: 'Detalji',
                                                    href: route("polls.show", { poll: poll.id }),
                                                },
                                                {
                                                    type: 'item',
                                                    label: 'Uredi',
                                                    href: route("polls.edit", { poll: poll.id }),
                                                    disabled: !!poll.finished_at,
                                                },
                                                ...(isAdmin && !poll.finished_at
                                                    ? [
                                                        { type: 'separator' as const },
                                                        {
                                                            type: 'item' as const,
                                                            label: 'Obriši',
                                                            variant: 'destructive',
                                                            onSelect: () => router.delete(route("polls.destroy", { poll: poll.id })),
                                                        },
                                                    ]
                                                    : []),
                                            ]}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center">
                                    Nema anketa
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </ContentHolder>
        </AppLayout>
    );
}
