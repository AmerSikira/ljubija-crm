import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function Welcome() {
    return (
        <>
            <Head title="Aplikacija za džemat Ljubija" />
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-6 py-12 dark:from-slate-900 dark:to-slate-950">
                <div className="flex flex-col items-center gap-6 text-center">
                    <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">Aplikacija za džemat Donja Ljubija</h1>
                    <Button
                        asChild
                        className="bg-black text-white shadow-lg shadow-black/30 hover:bg-black/90 hover:shadow-xl hover:shadow-black/25"
                    >
                        <Link href={route('login')}>Prijava</Link>
                    </Button>
                </div>
            </div>
        </>
    );
}
