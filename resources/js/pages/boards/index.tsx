import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import ContentHolder from '@/components/content-holder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Link, usePage } from '@inertiajs/react';

type BoardMember = {
    id: number;
    role: string;
    role_label: string;
    member: {
        id: number;
        name: string;
        email?: string | null;
        phone?: string | null;
    };
};

type Board = {
    id: number;
    start_date?: string | null;
    end_date?: string | null;
    is_current: boolean;
    members: BoardMember[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Početna stranica',
        href: '/dashboard',
    },
    {
        title: 'Upravni odbor',
        href: '/boards',
    },
];

const orderedRoles = ['president', 'vice_president', 'mutevelija', 'finance', 'member'];

export default function BoardsIndex({
    currentBoard,
    historyBoards,
    roleLabels,
}: {
    currentBoard: Board | null;
    historyBoards: Board[];
    roleLabels: Record<string, string>;
}) {
    const page = usePage();
    const role = (page.props as any)?.auth?.user?.role ?? 'subscriber';
    const [selectedBoardId, setSelectedBoardId] = useState<number | null>(
        historyBoards?.[0]?.id ?? null
    );

    const selectedBoard = useMemo(
        () => historyBoards?.find((b) => b.id === selectedBoardId) ?? null,
        [historyBoards, selectedBoardId]
    );

    const renderRolePerson = (board: Board, role: string) => {
        if (!board) return 'Nije postavljeno';
        if (role === 'member') {
            const members = board.members.filter((m) => m.role === role);
            if (members.length === 0) return 'Nije postavljeno';
            return members.map((m) => m.member.name).join(', ');
        }
        const found = board.members.find((m) => m.role === role);
        return found ? found.member.name : 'Nije postavljeno';
    };

    const periodLabel = (board: Board | null) => {
        if (!board) return 'Nema podataka o mandatu';
        const start = board.start_date ?? 'Nepoznato';
        const end = board.end_date ?? 'Nepoznato';
        return `Period mandata: ${start} - ${end}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upravni odbor" />
            <ContentHolder>
                <div className="flex flex-col gap-6">
                    {(role === 'admin' || role === 'manager') && (
                        <div className="flex justify-end gap-2">
                            {currentBoard && (
                                <Button variant="outline" asChild>
                                    <Link href={route('boards.edit', currentBoard.id)}>Uredi aktuelni odbor</Link>
                                </Button>
                            )}
                            <Button asChild>
                                <Link href={route('boards.create')}>Dodaj odbor</Link>
                            </Button>
                        </div>
                    )}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Aktuelni odbor</p>
                                <CardTitle className="text-2xl">Upravni odbor</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {periodLabel(currentBoard)}
                                </p>
                            </div>
                            <Badge variant="secondary">Aktuelni mandat</Badge>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {orderedRoles.map((roleKey) => (
                                <div key={roleKey} className="flex flex-col gap-1 rounded-lg border p-3">
                                    <Label className="text-sm font-semibold">
                                        {roleLabels[roleKey] ?? roleKey}
                                    </Label>
                                    <span className="text-base">
                                        {renderRolePerson(currentBoard as Board, roleKey)}
                                    </span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Historija upravnih odbora</p>
                                <CardTitle className="text-2xl">Prethodni odbori</CardTitle>
                            </div>
                            <div className="w-full md:w-64">
                                <Label className="text-sm">Odaberite mandat</Label>
                                <Select
                                    value={selectedBoardId ? selectedBoardId.toString() : undefined}
                                    onValueChange={(val) => setSelectedBoardId(Number(val))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Odaberite mandat" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {historyBoards.length === 0 && (
                                            <SelectItem value="0" disabled>
                                                Nema prethodnih odbora
                                            </SelectItem>
                                        )}
                                        {historyBoards.map((board) => (
                                            <SelectItem key={board.id} value={board.id.toString()}>
                                                {board.start_date} - {board.end_date ?? 'Nepoznato'}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {selectedBoard ? (
                                <div className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        {periodLabel(selectedBoard)}
                                    </p>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        {orderedRoles.map((roleKey) => (
                                            <div key={roleKey} className="flex flex-col gap-1 rounded-lg border p-3">
                                                <Label className="text-sm font-semibold">
                                                    {roleLabels[roleKey] ?? roleKey}
                                                </Label>
                                                <span className="text-base">
                                                    {renderRolePerson(selectedBoard, roleKey)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Nema prethodnih odbora.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </ContentHolder>
        </AppLayout>
    );
}
