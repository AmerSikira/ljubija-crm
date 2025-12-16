import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, DollarSign, Folder, LayoutGrid, User, HandCoins, Newspaper, BarChart2, Users } from 'lucide-react';
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
    const memberCount = (page.props as any)?.memberCount;

    const dashboardItem: NavItem = {
        title: 'Početna stranica',
        href: '/dashboard',
        icon: LayoutGrid,
    };

    const pollsItem: NavItem = {
        title: 'Ankete',
        href: '/polls',
        icon: BarChart2
    };

    const boardItem: NavItem = {
        title: 'Upravni odbor',
        href: '/boards',
        icon: Users
    };

    const articlesItem: NavItem = {
        title: 'Vijesti',
        href: '/articles',
        icon: Newspaper
    };

    const duasHadithItem: NavItem = {
        title: 'Dove i hadisi',
        href: '/content-items',
        icon: BookOpen,
    };

    const membersItem: NavItem = {
        title: 'Članovi',
        href: '/members',
        icon: User
    };

    const paymentsItem: NavItem = {
        title: 'Uplate',
        href: '/payments',
        icon: DollarSign
    };

    const myMembershipItem: NavItem = {
        title: 'Moj profil člana',
        href: '/my-membership',
        icon: User
    };

    const myPayments: NavItem = {
        title: 'Moje uplate',
        href: '/my-payments',
        icon: HandCoins
    };

    let mainNavItems: NavItem[] = [dashboardItem, boardItem, duasHadithItem];

    if (role === 'admin') {
        mainNavItems = [...mainNavItems, membersItem, paymentsItem, myMembershipItem, myPayments];
    } else if (role === 'manager') {
        mainNavItems = [...mainNavItems, paymentsItem, myMembershipItem, myPayments];
    } else {
        mainNavItems = [...mainNavItems, myMembershipItem, myPayments];
    }

    mainNavItems = [...mainNavItems, pollsItem, articlesItem];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <div className="px-4 py-2 text-sm font-semibold text-muted-foreground">
                    Džematlja: {memberCount ?? 0}
                </div>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
