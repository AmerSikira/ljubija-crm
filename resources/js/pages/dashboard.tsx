import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import ContentHolder from "@/components/content-holder";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Početna stranica',
        href: '/dashboard',
    },
];

export default function Dashboard({articles} : any) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Početna stranica" />
           <ContentHolder>
                <h1 className='font-bold text-2xl'>Vijesti iz džemata</h1>
                <div className="grid grid-cols-5">
            {articles.length === 0 && (
                <div className="col-span-5">
                    <div className="h-48 w-full border rounded-lg flex items-center justify-center text-gray-600">
                        Ovdje će biti objavljene vijesti
                    </div>
                </div>
            )}

            {articles.map((article: any) => (
                <a href={`/articles/show/${article.id}`} key={article.id} className="p-4">
                    <div className="border rounded-lg overflow-hidden shadow-lg">
                        {article.image_url ? (
                            <img
                                src={article.image_url}
                                alt={article.title}
                                className="w-full h-48 object-cover"
                            />
                        ) : (
                            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">Nema slike</span>
                            </div>
                        )}
                        <div className="p-4">
                            <h2 className="font-bold text-xl mb-2">{article.title}</h2>
                            <p className="text-gray-700 text-base">
                                {article.intro.length > 100 ? article.intro.substring(0, 100) + '...' : article.intro}
                            </p>
                        </div>
                    </div>
                </a>
            ))}
           </div>
            {articles.length > 0 && (
                <div className="flex justify-center">
                    <Button asChild>
                    <Link href={route('articles')}>
                        Pogledaj sve vijesti
                    </Link>
                </Button>
                </div>
            )}
           <hr className="my-6" />
           </ContentHolder>
           
           
        </AppLayout>
    );
}
