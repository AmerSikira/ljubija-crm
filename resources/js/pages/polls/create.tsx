import React from "react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import ContentHolder from "@/components/content-holder";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type PollItemForm = {
    title: string;
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

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<{
        title: string;
        description: string;
        items: PollItemForm[];
    }>({
        title: "",
        description: "",
        items: [{ title: "" }, { title: "" }],
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
        if (data.items.length <= 1) return;
        const items = data.items.filter((_, i) => i !== index);
        setData("items", items);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route("polls.store"));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nova anketa" />
            <ContentHolder>
                <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="title">Naslov</Label>
                        <Input
                            id="title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
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
                        />
                        {errors.description && <div className="text-red-500">{errors.description}</div>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Opcije</Label>
                        <div className="space-y-3">
                            {data.items.map((item, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <Input
                                        type="text"
                                        value={item.title}
                                        onChange={(e) => updateItemTitle(index, e.target.value)}
                                        placeholder={`Opcija ${index + 1}`}
                                    />
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => removeItem(index)}
                                        disabled={data.items.length <= 1}
                                    >
                                        Ukloni
                                    </Button>
                                </div>
                            ))}
                        </div>
                        {errors["items"] && <div className="text-red-500">{errors["items"]}</div>}
                        {errors["items.*.title"] && <div className="text-red-500">{errors["items.*.title"]}</div>}
                        <Button type="button" variant="outline" onClick={addItem}>
                            Dodaj opciju
                        </Button>
                    </div>

                    <Button type="submit" disabled={processing}>
                        Spremi anketu
                    </Button>
                </form>
            </ContentHolder>
        </AppLayout>
    );
}
