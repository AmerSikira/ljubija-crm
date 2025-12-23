import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, DollarSign, Folder, LayoutGrid, User, HandCoins, Newspaper, BarChart2, Users, Heart, Book, ChevronDown } from 'lucide-react';
import AppLogo from './app-logo';
import { useState } from 'react';

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
    const [docsOpen, setDocsOpen] = useState(false);

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

    const projectsItem: NavItem = {
        title: 'Projekti',
        href: '/projects',
        icon: Folder,
    };

    const memorialItem: NavItem = {
        title: 'Memorijal',
        href: '/memorials',
        icon: Heart,
    };

    const dzematItem: NavItem = {
        title: 'Džemat Ljubija',
        href: '/dzemat',
        icon: BookOpen,
    };

    const mektebItem: NavItem = {
        title: 'Mekteb',
        href: '/mekteb',
        icon: Book,
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

    let mainNavItems: NavItem[] = [dashboardItem, boardItem, projectsItem, memorialItem, mektebItem, dzematItem, duasHadithItem];

    if (role === 'admin') {
        mainNavItems = [...mainNavItems, membersItem, paymentsItem];
    } else if (role === 'manager') {
        mainNavItems = [...mainNavItems, paymentsItem];
    }

    mainNavItems = [...mainNavItems, myMembershipItem, myPayments, pollsItem, articlesItem];

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
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Dokumenti</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                onClick={() => setDocsOpen((prev) => !prev)}
                                tooltip={{ children: 'Dokumenti' }}
                                isActive={docsOpen}
                            >
                                <Folder />
                                <span>Dokumenti</span>
                                <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${docsOpen ? 'rotate-180' : ''}`} />
                            </SidebarMenuButton>
                            {docsOpen && (
                                <SidebarMenuSub>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton asChild>
                                            <a href="/Ustav_IZBIH_2014.pdf" target="_blank" rel="noreferrer">
                                                Ustav IZBiH
                                            </a>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton asChild>
                                            <a href="/Pravila_o_uvakufljenju_2011.pdf" target="_blank" rel="noreferrer">
                                                Pravila vakufa
                                            </a>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton asChild>
                                            <a href="/Pravilnik_o_ustrojstvu_medzlisa_i_dzemata_2019.pdf" target="_blank" rel="noreferrer">
                                                Pravilnik
                                            </a>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                </SidebarMenuSub>
                            )}
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
