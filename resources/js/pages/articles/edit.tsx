import React from "react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import ContentHolder from "@/components/content-holder";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from 'react';
import Editor from 'react-simple-wysiwyg';
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
        images: [],
    });

  function changeMainText(e) {
    setData('main_text', e.target.value);
  }
  
  function changeIntro(e) {
    setData('intro', e.target.value);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    post('/articles/' + article.id);
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
                        <Editor value={data.intro} onChange={changeIntro} />
                        {errors.intro && <div className="text-red-500">{errors.intro}</div>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="title">
                                Glavni tekst
                        </Label>
                        <Editor value={data.main_text} onChange={changeMainText} />
                        {errors.main_text && <div className="text-red-500">{errors.main_text}</div>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <img src={article.image_url} className="w-full h-auto mb-2"/>
                        <Label htmlFor="title">
                                Slike
                        </Label>
                        <Input id="images" type="file" className="mt-1 block w-full" onChange={(e) => setData('images', e.target.files)}/>
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