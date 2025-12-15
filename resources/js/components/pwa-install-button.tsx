import { Button } from '@/components/ui/button';
import { Download, Share } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export function PwaInstallButton() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalling, setIsInstalling] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    const isIos = useMemo(() => {
        if (typeof window === 'undefined') return false;
        return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const standalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
        setIsStandalone(standalone);

        const handleBeforeInstallPrompt = (event: Event) => {
            event.preventDefault();
            setDeferredPrompt(event as BeforeInstallPromptEvent);
        };

        const handleAppInstalled = () => {
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = useCallback(async () => {
        if (!deferredPrompt) return;

        setIsInstalling(true);
        deferredPrompt.prompt();

        try {
            await deferredPrompt.userChoice;
        } catch (error) {
            console.error('PWA install prompt failed', error);
        } finally {
            setDeferredPrompt(null);
            setIsInstalling(false);
        }
    }, [deferredPrompt]);

    if (isStandalone) return null;

    if (!deferredPrompt) {
        if (!isIos) return null;

        return (
            <div className="flex w-full items-center space-x-2 rounded-md bg-amber-100 px-3 py-2 text-xs font-medium text-neutral-700 shadow-sm ring-1 ring-amber-300 sm:text-sm">
                <Share className="h-4 w-4 shrink-0" />
                <span>Na iOS-u: otvorite Share meni i odaberite “Add to Home Screen”.</span>
            </div>
        );
    }

    return (
        <div className="flex w-full items-center space-x-2 bg-amber-200">
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="flex w-full h-10"
            >
                <Download className="h-4 w-4" />
                Instalirajte aplikaciju
            </Button>
        </div>
    );
}
