import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type FamilyUser = {
    id: number;
    name: string;
    email: string;
    avatar?: string | null;
};

type ParentMember = {
    id: number;
    title?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
} | null;

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Početna stranica', href: '/dashboard' },
    { title: 'Moj profil člana', href: '/my-membership' },
];

export default function FamilyProfile({ user, parentMember }: { user: FamilyUser; parentMember: ParentMember }) {
    const { data, setData, post, processing } = useForm({
        name: user.name ?? '',
        avatar: user.avatar ?? '',
    });

    const parentName = parentMember
        ? `${parentMember.title ? `${parentMember.title} ` : ''}${parentMember.first_name ?? ''} ${parentMember.last_name ?? ''}`.trim()
        : '';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('members.self.update'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Moj profil člana" />
            <ContentHolder>
                <Card>
                    <CardHeader>
                        <CardTitle>Profil člana porodice</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="name">Ime i prezime</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={user.email} disabled />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="avatar">Avatar URL</Label>
                                <Input
                                    id="avatar"
                                    type="text"
                                    value={data.avatar}
                                    onChange={(e) => setData('avatar', e.target.value)}
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="rounded-md border p-3 text-sm text-muted-foreground">
                                Povezani član: {parentName || parentMember?.email || '-'}
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    Spremi promjene
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </ContentHolder>
        </AppLayout>
    );
}
