import { SidebarInset } from '@/components/ui/sidebar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { usePage } from '@inertiajs/react';
import * as React from 'react';

interface AppContentProps extends React.ComponentProps<'main'> {
    variant?: 'header' | 'sidebar';
}

export function AppContent({ variant = 'header', children, ...props }: AppContentProps) {
    const page = usePage();
    const flash = (page?.props as any)?.flash ?? {};

    const FlashMessage = () => {
        if (flash.success) {
            return (
                <Alert className="m-5" variant="success">
                    <AlertTitle>Uspjeh</AlertTitle>
                    <AlertDescription>{flash.success}</AlertDescription>
                </Alert>
            );
        }

        if (flash.error) {
            return (
                <Alert className="m-5" variant="destructive">
                    <AlertTitle>Greška</AlertTitle>
                    <AlertDescription>{flash.error}</AlertDescription>
                </Alert>
            );
        }

        return null;
    };

    if (variant === 'sidebar') {
        return (
            <SidebarInset {...props}>
                <FlashMessage />
                {children}
            </SidebarInset>
        );
    }

    return (
        <main className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl" {...props}>
            <FlashMessage />
            {children}
        </main>
    );
}
