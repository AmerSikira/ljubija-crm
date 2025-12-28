import React from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import ContentHolder from "@/components/content-holder";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from 'react';
import { RichEditor } from '@/components/rich-editor';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
        title: 'Uredi vijest',
        href: '/articles/create',
    },
];


export default function Edit ({article}: any) {
     const { data, setData, post, processing, errors } = useForm({
        title: article.title || '',
        intro: article.intro || '',
        main_text: article.main_text || '',
        image_url: article.image_url || '',
        images: [] as File[] | [],
        removed_media_ids: [] as number[],
    });

  function changeMainText(val: string) {
    setData('main_text', val);
  }
  
  function changeIntro(val: string) {
    setData('intro', val);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    post('/articles/' + article.id, { forceFormData: true });
    // Handle form submission logic here
};
        return (
             <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Početna stranica" />
           <ContentHolder>
                <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="title">
                                Naslov
                        </Label>
                        <Input id="title" type="text" className="mt-1 block w-full" onChange={(e) => setData('title', e.target.value)} value={data.title}/>
                        {errors.title && <div className="text-red-500">{errors.title}</div>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="title">
                                Uvod
                        </Label>
                        <RichEditor label={undefined} value={data.intro} onChange={changeIntro} error={errors.intro} enableImages />
                        {errors.intro && <div className="text-red-500">{errors.intro}</div>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="title">
                                Glavni tekst
                        </Label>
                        <RichEditor label={undefined} value={data.main_text} onChange={changeMainText} error={errors.main_text} enableImages />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="title">
                                Slike
                        </Label>
                        {article.gallery && article.gallery.length > 0 && (
                            <div className="flex flex-wrap gap-3">
                                {article.gallery.map((img: any) => (
                                    <div key={img.id} className="relative">
                                        <img src={img.url} className="h-20 w-20 rounded-md object-cover" />
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="destructive"
                                            className="absolute -right-2 -top-2 h-6 w-6 rounded-full p-0 text-xs"
                                            onClick={() =>
                                                setData('removed_media_ids', [
                                                    ...data.removed_media_ids.filter((id: number) => id !== img.id),
                                                    img.id,
                                                ])
                                            }
                                        >
                                            ×
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <Input
                            id="images"
                            type="file"
                            multiple
                            accept="image/*"
                            className="mt-1 block w-full"
                            onChange={(e) => setData('images', e.target.files ? Array.from(e.target.files) : [])}
                        />
                        {errors.images && <div className="text-red-500">{errors.images}</div>}
                    </div>
                    
                    <Button type="submit" disabled={processing}>
                        Spremite vijest
                    </Button>
                </form>
           </ContentHolder>
            
        </AppLayout>
        );
}
