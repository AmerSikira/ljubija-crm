import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const pad2 = (value: number) => String(value).padStart(2, '0');

function parseDateInput(value: string): Date | null {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        const date = new Date(`${trimmed}T00:00:00`);
        return Number.isNaN(date.getTime()) ? null : date;
    }
    if (/^\d{1,2}[./]\d{1,2}[./]\d{4}$/.test(trimmed)) {
        const parts = trimmed.split(/[./]/).map(Number);
        const [day, month, year] = parts;
        if (!day || !month || !year) return null;
        const date = new Date(year, month - 1, day);
        return Number.isNaN(date.getTime()) ? null : date;
    }
    const date = new Date(trimmed);
    return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDateEU(value?: string | Date | null): string {
    if (!value) return '';
    const date = value instanceof Date ? value : parseDateInput(value);
    if (!date) return typeof value === 'string' ? value : '';
    return `${pad2(date.getDate())}.${pad2(date.getMonth() + 1)}.${date.getFullYear()}`;
}

export function formatDateTimeEU(value?: string | Date | null): string {
    if (!value) return '';
    const date = value instanceof Date ? value : parseDateInput(value);
    if (!date) return typeof value === 'string' ? value : '';
    return `${formatDateEU(date)} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}
