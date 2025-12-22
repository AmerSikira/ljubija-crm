import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link } from '@inertiajs/react';
import { MoreVertical } from 'lucide-react';

type ActionItem = {
    type: 'item';
    label: string;
    href?: string;
    onSelect?: () => void;
    variant?: 'default' | 'destructive';
    disabled?: boolean;
};

type ActionSeparator = {
    type: 'separator';
};

type ActionsMenuProps = {
    actions: Array<ActionItem | ActionSeparator>;
};

export function ActionsMenu({ actions }: ActionsMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Otvori meni</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {actions.map((action, index) => {
                    if (action.type === 'separator') {
                        return <DropdownMenuSeparator key={`separator-${index}`} />;
                    }

                    const content = action.href ? (
                        <Link href={action.href}>{action.label}</Link>
                    ) : (
                        action.label
                    );

                    return (
                        <DropdownMenuItem
                            key={`action-${index}-${action.label}`}
                            variant={action.variant}
                            disabled={action.disabled}
                            onSelect={(event) => {
                                if (action.onSelect) {
                                    event.preventDefault();
                                    action.onSelect();
                                }
                            }}
                            asChild={!!action.href}
                        >
                            {content}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
