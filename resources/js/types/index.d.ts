import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
type FamilyMember = {
  first_name: string;
  last_name: string;
  birthdate: string;
  email: string;
  phone: string;
  address: string;
};

type MemberForm = {
  id: number;
  first_name: string;
  last_name: string;
  birthdate: string;
  email: string;
  phone: string;
  address: string;
  family_members: FamilyMember[];
  email_abroad: string;
  phone_abroad: string;
  address_abroad: string;
  city_abroad: string;
  country: string;
};

