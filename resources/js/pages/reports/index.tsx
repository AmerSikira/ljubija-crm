import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import ContentHolder from '@/components/content-holder';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusIcon } from 'lucide-react';
import { ActionsMenu } from '@/components/actions-menu';
import { formatDateTimeEU } from '@/lib/utils';

type ReportListItem = {
    id: number;
    protocol_number: string;
    meeting_datetime: string;
    location?: string | null;
    chairperson_name?: string | null;
    quorum_note?: string | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Početna stranica', href: '/dashboard' },
    { title: 'Zapisnici', href: '/reports' },
];

const formatDateTime = (value?: string | null) => formatDateTimeEU(value ?? null) || '-';

export default function ReportsIndex({ reports, filters }: { reports: ReportListItem[]; filters?: { search?: string } }) {
    const { props } = usePage();
    const role = (props as any)?.auth?.user?.role ?? '';
    const isAdmin = role === 'admin';

    const { data, setData } = useForm({
        search: filters?.search ?? '',
    });

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get(route('reports.index'), { search: data.search }, { preserveScroll: true, preserveState: true });
    };

    const handleReset = () => {
        setData('search', '');
        router.get(route('reports.index'), {}, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Zapisnici" />
            <ContentHolder>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Input
                            placeholder="Pretraži po broju protokola, lokaciji ili učesnicima"
                            value={data.search}
                            onChange={(e) => setData('search', e.target.value)}
                            className="w-full sm:w-80"
                        />
                        <div className="flex gap-2">
                            <Button type="submit" variant="secondary">Pretraži</Button>
                            <Button type="button" variant="outline" onClick={handleReset}>Reset</Button>
                        </div>
                    </form>
                    {isAdmin && (
                        <Button asChild>
                            <Link href={route('reports.create')}>
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Novi zapisnik
                            </Link>
                        </Button>
                    )}
                </div>

                <Table className="mt-4">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Broj protokola</TableHead>
                            <TableHead>Datum i vrijeme</TableHead>
                            <TableHead>Lokacija</TableHead>
                            <TableHead>Predsjedavajući</TableHead>
                            <TableHead>Kvorum</TableHead>
                            {isAdmin && <TableHead className="text-right">Akcije</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reports.length ? (
                            reports.map((report) => (
                                <TableRow key={report.id}>
                                    <TableCell>{report.protocol_number}</TableCell>
                                    <TableCell>{formatDateTime(report.meeting_datetime)}</TableCell>
                                    <TableCell>{report.location || '-'}</TableCell>
                                    <TableCell>{report.chairperson_name || '-'}</TableCell>
                                    <TableCell>{report.quorum_note || '-'}</TableCell>
                                    {isAdmin && (
                                        <TableCell className="text-right">
                                            <ActionsMenu
                                                actions={[
                                                    {
                                                        type: 'item',
                                                        label: 'Uredi',
                                                        href: route('reports.edit', { report: report.id }),
                                                    },
                                                    { type: 'separator' },
                                                    {
                                                        type: 'item',
                                                        label: 'Obriši',
                                                        variant: 'destructive',
                                                        onSelect: () => router.delete(route('reports.destroy', { report: report.id })),
                                                    },
                                                ]}
                                            />
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={isAdmin ? 6 : 5} className="text-center">
                                    Nema zapisnika
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </ContentHolder>
        </AppLayout>
    );
}
