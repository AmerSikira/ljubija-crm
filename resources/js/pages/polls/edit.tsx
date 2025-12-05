import React from "react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, useForm, router } from "@inertiajs/react";
import ContentHolder from "@/components/content-holder";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
                        <textarea
                            id="description"
                            className="border rounded-md p-2 min-h-[120px]"
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
                                <div key={`${item.id ?? "new"}-${index}`} className="flex gap-2 items-center">
                                    <Input
                                        type="text"
                                        value={item.title}
                                        onChange={(e) => updateItemTitle(index, e.target.value)}
                                        disabled={!!poll.finished_at}
                                        placeholder={`Opcija ${index + 1}`}
                                    />
                                    <Button
                                        type="button"
                                        variant="secondary"
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
                        <Button type="button" variant="outline" onClick={addItem} disabled={!!poll.finished_at}>
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

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing || !!poll.finished_at}>
                            Spremi promjene
                        </Button>
                        {!poll.finished_at && (
                            <Button type="button" variant="destructive" onClick={handleDelete}>
                                Obriši anketu
                            </Button>
                        )}
                    </div>
                </form>
            </ContentHolder>
        </AppLayout>
    );
}
