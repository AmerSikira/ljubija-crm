import { useEffect, useMemo, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type MemberOption = {
    id: number;
    name: string;
    email?: string | null;
};

type MemberAutocompleteProps = {
    members: MemberOption[];
    value: number | null;
    onChange: (value: number | null) => void;
    placeholder?: string;
    disabledIds?: number[];
    className?: string;
};

/**
 * Lightweight autocomplete for members.
 * Filters on name/email and limits visible results to avoid huge lists.
 */
export default function MemberAutocomplete({
    members,
    value,
    onChange,
    placeholder = 'Počnite kucati ime',
    disabledIds = [],
    className,
}: MemberAutocompleteProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const containerRef = useRef<HTMLDivElement | null>(null);

    const disabledSet = useMemo(() => new Set(disabledIds), [disabledIds]);
    const selectedMember = useMemo(() => members.find((m) => m.id === value) || null, [members, value]);

    useEffect(() => {
        setQuery(selectedMember?.name ?? '');
    }, [selectedMember?.id, selectedMember?.name]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredMembers = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        return members
            .filter((member) => {
                if (disabledSet.has(member.id) && member.id !== value) return false;
                if (!normalizedQuery) return true;

                const text = `${member.name ?? ''} ${member.email ?? ''}`.toLowerCase();
                return text.includes(normalizedQuery);
            })
            .slice(0, 12);
    }, [disabledSet, members, query, value]);

    const handleSelect = (memberId: number, name: string) => {
        onChange(memberId);
        setQuery(name);
        setOpen(false);
    };

    const handleClear = () => {
        setQuery('');
        onChange(null);
        setOpen(false);
    };

    return (
        <div ref={containerRef} className={cn('relative w-full', className)}>
            <Input
                value={query}
                placeholder={placeholder}
                onFocus={() => setOpen(true)}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setOpen(true);
                }}
                aria-autocomplete="list"
            />
            {value !== null && (
                <div className="absolute inset-y-0 right-1 flex items-center">
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="text-muted-foreground"
                        onClick={handleClear}
                        aria-label="Obriši odabir"
                    >
                        <XIcon className="size-4" />
                    </Button>
                </div>
            )}
            {open && (
                <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-md border bg-popover text-sm shadow-md">
                    <div className="max-h-64 overflow-auto">
                        {filteredMembers.length === 0 ? (
                            <div className="px-3 py-2 text-muted-foreground">Nema rezultata</div>
                        ) : (
                            filteredMembers.map((member) => (
                                <button
                                    key={member.id}
                                    type="button"
                                    className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => handleSelect(member.id, member.name)}
                                >
                                    <span className="font-medium leading-tight">{member.name}</span>
                                    {member.email && (
                                        <span className="text-xs text-muted-foreground leading-tight">({member.email})</span>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
