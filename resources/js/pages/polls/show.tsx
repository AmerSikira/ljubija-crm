import React from "react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import ContentHolder from "@/components/content-holder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PollItem = {
    id: number;
    title: string;
    votes_count: number;
};

type Poll = {
    id: number;
    title: string;
    description?: string | null;
    items: PollItem[];
    votes_count?: number;
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
        title: `Pregled #${pollId}`,
        href: `/polls/show/${pollId}`,
    },
];

export default function Show({ poll }: { poll: Poll }) {
    const { data, setData, post, processing, errors } = useForm<{ poll_item_id: number | null }>({
        poll_item_id: null,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!data.poll_item_id || poll.finished_at) return;
        post(route("polls.vote", { poll: poll.id }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(poll.id)}>
            <Head title={`Anketa #${poll.id}`} />
            <ContentHolder>
                <Card>
                    <CardHeader>
                        <CardTitle>{poll.title}</CardTitle>
                        {poll.description && <p className="text-muted-foreground mt-2">{poll.description}</p>}
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Opcije</h2>
                                {poll.finished_at && (
                                    <div className="text-sm text-red-600 mb-2">Glasanje je završeno.</div>
                                )}
                                <form onSubmit={handleSubmit} className="space-y-3">
                                    <div className="space-y-2">
                                        {poll.items.map((item) => (
                                            <label
                                                key={item.id}
                                                className="flex items-center justify-between border rounded-md px-3 py-2 cursor-pointer"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="poll_item_id"
                                                        value={item.id}
                                                        checked={data.poll_item_id === item.id}
                                                        onChange={() => setData("poll_item_id", item.id)}
                                                        disabled={!!poll.finished_at}
                                                    />
                                                    <span>{item.title}</span>
                                                </div>
                                                <span className="text-sm text-muted-foreground">Glasova: {item.votes_count}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.poll_item_id && <div className="text-red-500">{errors.poll_item_id}</div>}
                                    {!poll.finished_at && (
                                        <Button type="submit" disabled={processing || !data.poll_item_id}>
                                            Glasaj
                                        </Button>
                                    )}
                                </form>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </ContentHolder>
        </AppLayout>
    );
}
