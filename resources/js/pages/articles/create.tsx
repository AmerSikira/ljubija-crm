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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Početna stranica',
        href: '/dashboard',
    },
    {
        title: 'Vijesti',
        href: '/articles',
    },
];


export default function Create () {
     const { data, setData, post, processing, errors } = useForm({
        title: '',
        intro: '',
        main_text: '',
        images: [] as File[] | [],
    });

  function changeMainText(e) {
    setData('main_text', e.target.value);
  }
  
  function changeIntro(value: string) {
    setData('intro', value);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    post('/articles', { forceFormData: true });
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
                        <Input id="title" type="text" className="mt-1 block w-full" onChange={(e) => setData('title', e.target.value)}/>
                        {errors.title && <div className="text-red-500">{errors.title}</div>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="title">
                                Uvod
                        </Label>
                        <RichEditor label={undefined} value={data.intro} onChange={changeIntro} error={errors.intro} />
                        {errors.intro && <div className="text-red-500">{errors.intro}</div>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="title">
                                Glavni tekst
                        </Label>
                        <RichEditor label={undefined} value={data.main_text} onChange={(val) => setData('main_text', val)} error={errors.main_text} />
                        {errors.main_text && <div className="text-red-500">{errors.main_text}</div>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="title">
                                Slike
                        </Label>
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
