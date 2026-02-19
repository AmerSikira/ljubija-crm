import React from "react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, useForm, router } from "@inertiajs/react";
import ContentHolder from "@/components/content-holder";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PollItemForm = {
    id?: number;
    title: string;
};

type Poll = {
    id: number;
    title: string;
    description?: string | null;
    items: PollItemForm[];
    finished_at?: string | null;
};

const breadcrumbs = (pollId: number): BreadcrumbItem[] => [
    {
        title: "Početna stranica",
        href: "/dashboard",
    },
    {
        title: "Ankete",
        href: "/polls",
    },
    {
        title: `Uredi #${pollId}`,
        href: `/polls/${pollId}`,
    },
];

export default function Edit({ poll }: { poll: Poll }) {
    const { data, setData, post, processing, errors } = useForm<{
        title: string;
        description: string;
        items: PollItemForm[];
        finish: boolean;
    }>({
        title: poll.title,
        description: poll.description ?? "",
        items: poll.items ?? [],
        finish: !!poll.finished_at,
    });

    const addItem = () => {
        setData("items", [...data.items, { title: "" }]);
    };

    const updateItemTitle = (index: number, title: string) => {
        const items = [...data.items];
        items[index].title = title;
        setData("items", items);
    };

    const removeItem = (index: number) => {
        const items = data.items.filter((_, i) => i !== index);
        setData("items", items);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route("polls.update", { poll: poll.id }));
    };

    const handleDelete = () => {
        router.delete(route("polls.destroy", { poll: poll.id }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(poll.id)}>
            <Head title={`Uredi anketu #${poll.id}`} />
            <ContentHolder>
                <Card>
                    <CardHeader>
                        <CardTitle>Uredi anketu</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {poll.finished_at && (
                            <div className="text-red-600 mb-3">Anketa je završena i nije je moguće uređivati.</div>
                        )}
                        <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="title">Naslov</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData("title", e.target.value)}
                                    disabled={!!poll.finished_at}
                                />
                                {errors.title && <div className="text-red-500">{errors.title}</div>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="description">Opis</Label>
                                <Textarea
                                    id="description"
                                    className="min-h-[120px]"
                                    value={data.description}
                                    onChange={(e) => setData("description", e.target.value)}
                                    disabled={!!poll.finished_at}
                                />
                                {errors.description && <div className="text-red-500">{errors.description}</div>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label>Opcije</Label>
                                <div className="space-y-3">
                                    {data.items.map((item, index) => (
                                        <div key={`${item.id ?? "new"}-${index}`} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                            <Input
                                                type="text"
                                                value={item.title}
                                                onChange={(e) => updateItemTitle(index, e.target.value)}
                                                disabled={!!poll.finished_at}
                                                placeholder={`Opcija ${index + 1}`}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="w-full shrink-0 sm:w-auto"
                                                onClick={() => removeItem(index)}
                                                disabled={data.items.length <= 1 || !!poll.finished_at}
                                            >
                                                Ukloni
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                                {errors["items"] && <div className="text-red-500">{errors["items"]}</div>}
                                {errors["items.*.title"] && <div className="text-red-500">{errors["items.*.title"]}</div>}
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full sm:w-auto"
                                    onClick={addItem}
                                    disabled={!!poll.finished_at}
                                >
                                    Dodaj opciju
                                </Button>
                            </div>

                            {!poll.finished_at && (
                                <div className="flex items-center gap-2">
                                    <input
                                        id="finish"
                                        type="checkbox"
                                        checked={data.finish}
                                        onChange={(e) => setData("finish", e.target.checked)}
                                    />
                                    <Label htmlFor="finish">Završi anketu nakon spremanja</Label>
                                </div>
                            )}

                            <div className="flex flex-col gap-2 sm:flex-row">
                                <Button type="submit" className="w-full sm:w-auto" disabled={processing || !!poll.finished_at}>
                                    Spremi promjene
                                </Button>
                                {!poll.finished_at && (
                                    <Button type="button" variant="destructive" className="w-full sm:w-auto" onClick={handleDelete}>
                                        Obriši anketu
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </ContentHolder>
        </AppLayout>
    );
}
