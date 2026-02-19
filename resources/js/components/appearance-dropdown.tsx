import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAppearance } from '@/hooks/use-appearance';
import { Monitor, Moon, Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';

export default function AppearanceToggleDropdown({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const getCurrentIcon = () => {
        switch (appearance) {
            case 'dark':
                return <Moon className="h-5 w-5" />;
            case 'light':
                return <Sun className="h-5 w-5" />;
            default:
                return <Monitor className="h-5 w-5" />;
        }
    };

    return (
        <div className={className} {...props}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-md border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                        {getCurrentIcon()}
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                        className="cursor-pointer text-foreground focus:bg-accent focus:text-accent-foreground"
                        onClick={() => updateAppearance('light')}
                    >
                        <span className="flex items-center gap-2">
                            <Sun className="h-5 w-5" />
                            Svijetla
                        </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="cursor-pointer text-foreground focus:bg-accent focus:text-accent-foreground"
                        onClick={() => updateAppearance('dark')}
                    >
                        <span className="flex items-center gap-2">
                            <Moon className="h-5 w-5" />
                            Tamna
                        </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="cursor-pointer text-foreground focus:bg-accent focus:text-accent-foreground"
                        onClick={() => updateAppearance('system')}
                    >
                        <span className="flex items-center gap-2">
                            <Monitor className="h-5 w-5" />
                            Sistem
                        </span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
