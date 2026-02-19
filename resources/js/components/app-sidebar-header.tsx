import { Breadcrumbs } from '@/components/breadcrumbs';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { ArrowLeft } from 'lucide-react';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    return (
        <header className="shrink-0 border-b border-sidebar-border/50 px-6 py-2 transition-[width,height] ease-linear md:px-4">
            <div className="flex w-full flex-col gap-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground sm:w-auto"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Prethodni ekran
                    </Button>
                    <AppearanceToggleDropdown className="ml-auto shrink-0" />
                </div>
                <div className="flex min-w-0 items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            </div>
        </header>
    );
}
