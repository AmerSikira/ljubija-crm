import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarGroup, SidebarGroupLabel, SidebarMenuBadge } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, DollarSign, Folder, LayoutGrid, User, HandCoins, Newspaper, BarChart2, Users, Heart, Book, PieChart, FileText, MoonStar, FileText as PaperIcon, MapPin } from 'lucide-react';
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
    const menuCounts = (page.props as any)?.menuCounts ?? {};

    const countByHref: Record<string, number | undefined> = {
        '/articles': menuCounts.articles,
        '/content-items': menuCounts.content_items,
        '/mekteb': menuCounts.mekteb,
        '/memorials': menuCounts.memorials,
        '/tickets': menuCounts.tickets,
        '/projects': menuCounts.projects,
        '/polls': menuCounts.polls,
        '/admin/tickets': menuCounts.admin_tickets,
        '/users': menuCounts.users,
        '/members': menuCounts.members,
        '/unverified-users': menuCounts.unverified_users,
        '/payments': menuCounts.payments,
        '/expenses': menuCounts.expenses,
        '/my-payments': menuCounts.my_payments,
    };

    const groups: Array<{ label: string; items: NavItem[] }> = [
        {
            label: 'Pregled',
            items: [
                { title: 'Početna stranica', href: '/dashboard', icon: LayoutGrid },
                ...(role === 'admin' || role === 'manager' ? [{ title: 'Statistika', href: '/stats', icon: PieChart }] : []),
            ],
        },
        {
            label: 'Sadržaj',
            items: [
                { title: 'Vijesti', href: '/articles', icon: Newspaper },
                { title: 'Dove i hadisi', href: '/content-items', icon: BookOpen },
            ],
        },
        {
            label: 'Zajednica',
            items: [
                { title: 'Džemat Donja Ljubija', href: '/dzemat', icon: MoonStar },
                { title: 'Mekteb', href: '/mekteb', icon: Book },
                { title: 'Memorijal', href: '/memorials', icon: Heart },
                { title: 'Zauzeće mezara', href: '/graves', icon: MapPin },
                { title: 'Poruke', href: '/tickets', icon: FileText },
            ],
        },
        {
            label: 'Aktivnosti',
            items: [
                { title: 'Projekti', href: '/projects', icon: Folder },
                { title: 'Upravni odbor', href: '/boards', icon: Users },
                ...(role === 'admin' ? [{ title: 'Zapisnici', href: '/reports', icon: FileText }] : []),
                { title: 'Ankete', href: '/polls', icon: BarChart2 },
                ...(role === 'admin' ? [{ title: 'Poruke (admin)', href: '/admin/tickets', icon: FileText }] : []),
            ],
        },
        {
            label: 'Članstvo',
            items: [
                ...(role === 'admin' ? [{ title: 'Korisnici', href: '/users', icon: Users }] : []),
                ...(role === 'admin' ? [{ title: 'Članovi', href: '/members', icon: User }] : []),
                ...(role === 'admin' ? [{ title: 'Neverifikovani članovi', href: '/unverified-users', icon: User }] : []),
                { title: 'Moj profil člana', href: '/my-membership', icon: User },
            ],
        },
        {
            label: 'Finansije',
            items: [
                ...(role === 'admin' || role === 'manager' ? [{ title: 'Uplate', href: '/payments', icon: DollarSign }] : []),
                ...(role === 'admin' || role === 'manager' ? [{ title: 'Rashodi', href: '/expenses', icon: DollarSign }] : []),
                { title: 'Moje uplate', href: '/my-payments', icon: HandCoins },
            ],
        },
    ].map((group) => ({ ...group, items: group.items.filter(Boolean) as NavItem[] })).filter((group) => group.items.length);

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

                {groups.map((group) => (
                    <SidebarGroup key={group.label} className="px-2 py-0">
                        <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                        <SidebarMenu>
                            {group.items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={page.url.startsWith(item.href)} tooltip={{ children: item.title }}>
                                        <Link href={item.href} prefetch>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                    {typeof countByHref[item.href] === 'number' && (
                                        <SidebarMenuBadge>{countByHref[item.href]}</SidebarMenuBadge>
                                    )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                ))}
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Dokumenti</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={page.url.startsWith('/documents')} tooltip={{ children: 'Biblioteka dokumenata' }}>
                                <Link href="/documents" prefetch>
                                    <PaperIcon />
                                    <span>Biblioteka dokumenata</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={{ children: 'Ustav IZBiH' }}>
                                <a href="/Ustav_IZBIH_2014.pdf" target="_blank" rel="noreferrer">
                                    <PaperIcon />
                                    <span>Ustav IZBiH</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={{ children: 'Pravila vakufa' }}>
                                <a href="/Pravila_o_uvakufljenju_2011.pdf" target="_blank" rel="noreferrer">
                                    <PaperIcon />
                                    <span>Pravila vakufa</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={{ children: 'Pravilnik' }}>
                                <a href="/Pravilnik_o_ustrojstvu_medzlisa_i_dzemata_2019.pdf" target="_blank" rel="noreferrer">
                                    <PaperIcon />
                                    <span>Pravilnik o ustrojstvu medžlisa i džemata</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={{ children: 'Pravilnik' }}>
                                <a href="/Pravilnik_rada_IZLJ.pdf" target="_blank" rel="noreferrer">
                                    <PaperIcon />
                                    <span>Pravilnik rada DELBA</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={{ children: 'Pravilnik' }}>
                                <a href="/Radni_zadatak_imama_2025.pdf" target="_blank" rel="noreferrer">
                                    <PaperIcon />
                                    <span>Radni zadataka imama</span>
                                </a>
                            </SidebarMenuButton>
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
