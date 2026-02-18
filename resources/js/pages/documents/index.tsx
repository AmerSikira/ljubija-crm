import React from 'react';
import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ActionsMenu } from '@/components/actions-menu';
import InputError from '@/components/input-error';

type DocumentItem = {
    id: number;
    name: string;
    file_name: string;
    mime_type?: string | null;
    size: number;
    url: string;
    full_url: string;
    created_at?: string | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Početna stranica', href: '/dashboard' },
    { title: 'Dokumenti', href: '/documents' },
];

const formatSize = (bytes: number) => {
    if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB';
    const units = ['B', 'KB', 'MB', 'GB'];
    let value = bytes;
    let unitIndex = 0;
    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex += 1;
    }
    const rounded = value >= 10 || unitIndex === 0 ? Math.round(value) : Number(value.toFixed(1));
    return `${rounded} ${units[unitIndex]}`;
};

export default function DocumentsIndex({ documents, isAdmin }: { documents: DocumentItem[]; isAdmin: boolean }) {
    const [copiedId, setCopiedId] = React.useState<number | null>(null);
    const { data, setData, post, processing, errors, reset } = useForm<{
        name: string;
        documents: File[];
    }>({
        name: '',
        documents: [],
    });

    const handleCopy = async (id: number, url: string) => {
        try {
            await navigator.clipboard.writeText(url);
        } catch {
            const input = window.document.createElement('input');
            input.value = url;
            window.document.body.appendChild(input);
            input.select();
            window.document.execCommand('copy');
            window.document.body.removeChild(input);
        }
        setCopiedId(id);
        window.setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1200);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('documents.store'), {
            forceFormData: true,
            onSuccess: () => reset('name', 'documents'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dokumenti" />
            <ContentHolder className="space-y-4">
                {isAdmin && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Dodaj dokument</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form className="grid grid-cols-1 gap-4 md:grid-cols-3" onSubmit={handleSubmit}>
                                <div className="flex flex-col gap-2 md:col-span-1">
                                    <Label htmlFor="name">Naziv (opcionalno)</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="npr. Godišnji izvještaj"
                                    />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="flex flex-col gap-2 md:col-span-1">
                                    <Label htmlFor="documents">Datoteke</Label>
                                    <Input
                                        id="documents"
                                        type="file"
                                        multiple
                                        onChange={(e) => setData('documents', e.target.files ? Array.from(e.target.files) : [])}
                                    />
                                    <p className="text-xs text-muted-foreground">Maksimalna veličina po dokumentu: 64MB</p>
                                    <InputError message={errors.documents as string} />
                                    <InputError message={errors['documents.0'] as string} />
                                </div>
                                <div className="flex items-end md:col-span-1">
                                    <Button type="submit" disabled={processing || data.documents.length === 0} className="w-full md:w-auto">
                                        Upload
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Biblioteka dokumenata</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Naziv</TableHead>
                                    <TableHead>Tip</TableHead>
                                    <TableHead>Veličina</TableHead>
                                    <TableHead>Datum</TableHead>
                                    <TableHead className="w-40">Kopirajte URL</TableHead>
                                    <TableHead className="w-40 text-right">Opcije</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {documents.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                                            Nema dokumenata.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    documents.map((document) => (
                                        <TableRow key={document.id}>
                                            <TableCell className="font-medium">{document.name}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{document.mime_type || '-'}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{formatSize(document.size)}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {document.created_at ? new Date(document.created_at).toLocaleDateString('bs-BA') : '-'}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleCopy(document.id, document.full_url)}
                                                >
                                                    {copiedId === document.id ? 'Kopirano' : 'Kopirajte URL'}
                                                </Button>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <ActionsMenu
                                                    actions={[
                                                        {
                                                            type: 'item',
                                                            label: 'Otvori',
                                                            onSelect: () => window.open(document.url, '_blank', 'noopener,noreferrer'),
                                                        },
                                                        {
                                                            type: 'item',
                                                            label: copiedId === document.id ? 'Kopirano' : 'Kopiraj URL',
                                                            onSelect: () => handleCopy(document.id, document.full_url),
                                                        },
                                                        ...(isAdmin
                                                            ? [
                                                                { type: 'separator' as const },
                                                                {
                                                                    type: 'item' as const,
                                                                    label: 'Obriši',
                                                                    variant: 'destructive',
                                                                    onSelect: () => router.delete(route('documents.destroy', { media: document.id })),
                                                                },
                                                            ]
                                                            : []),
                                                    ]}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </ContentHolder>
        </AppLayout>
    );
}
