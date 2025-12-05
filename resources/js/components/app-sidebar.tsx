import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, DollarSign, Folder, LayoutGrid, User, HandCoins, Newspaper, BarChart2 } from 'lucide-react';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const page = usePage();
    const role = (page.props as any)?.auth?.user?.role ?? 'subscriber';

    const baseItems: NavItem[] = [
        {
            title: 'Početna stranica',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Ankete',
            href:'/polls',
            icon: BarChart2
        }, 
        {
            title: 'Vijesti',
            href:'/articles',
            icon: Newspaper
        }
    ];

    const memberItems: NavItem[] = [
        {
            title: 'Članovi',
            href:'/members',
            icon: User
        },
        {
            title: 'Uplate',
            href:'/payments',
            icon: DollarSign
        }, 
    ];

    const myPayments: NavItem = {
        title: 'Moje uplate',
        href:'/my-payments',
        icon: HandCoins
    };

    let mainNavItems: NavItem[] = [...baseItems];

    if (role === 'admin' || role === 'manager') {
        mainNavItems = [...baseItems.slice(0,1), ...memberItems, myPayments, ...baseItems.slice(1)];
    } else {
        mainNavItems = [...baseItems.slice(0,1), myPayments, ...baseItems.slice(1)];
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
