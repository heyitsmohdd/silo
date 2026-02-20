import { useState, useEffect } from 'react';
import { Share, PlusSquare, X, Download } from 'lucide-react';
import Button from './ui/Button';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS] = useState(() => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /iphone|ipad|ipod/.test(userAgent);
    });
    const [isStandalone] = useState(() => {
        return window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone ||
            document.referrer.includes('android-app://');
    });

    useEffect(() => {
        // Check if already installed
        const isStandaloneMode = isStandalone;

        console.log('[PWA] Standalone mode:', isStandaloneMode);
        // setIsStandalone(isStandaloneMode); // Removed as we init in state

        if (isStandaloneMode) return;

        // Detect iOS
        const isIosDevice = isIOS;
        console.log('[PWA] Is iOS:', isIosDevice);

        // Check for global deferred prompt (captured in index.html)
        if ((window as any).deferredPrompt && !isIosDevice) {
            console.log('[PWA] Found existing global prompt!');
            setTimeout(() => {
                setDeferredPrompt((window as any).deferredPrompt);
                setShowPrompt(true);
            }, 0);
        }

        // Handle beforeinstallprompt for Android/Desktop (if it fires later)
        const handleBeforeInstallPrompt = (e: Event) => {
            console.log('[PWA] beforeinstallprompt fired (in component)!');
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            // Update global one too just in case
            (window as any).deferredPrompt = e;

            // Show prompt automatically if not iOS
            if (!isIosDevice) {
                console.log('[PWA] Showing custom prompt');
                setShowPrompt(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // For iOS, show prompt if it's not standalone
        if (isIosDevice && !isStandaloneMode) {
            // Check session storage to not annoy user every refresh
            const hasSeenPrompt = sessionStorage.getItem('silo_install_prompt_seen');
            if (!hasSeenPrompt) {
                setTimeout(() => setShowPrompt(true), 0);
            }
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, [isIOS, isStandalone]);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();

        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setShowPrompt(false);
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        sessionStorage.setItem('silo_install_prompt_seen', 'true');
    };

    if (!showPrompt || isStandalone) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-5 duration-500 md:left-auto md:right-4 md:w-96">
            <div className="glass-card p-4 border border-white/10 shadow-2xl bg-zinc-950/90 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl" />

                <button
                    onClick={handleDismiss}
                    className="absolute top-2 right-2 text-zinc-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col gap-4 relative z-10">
                    <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center shrink-0">
                            <span className="text-xl font-bold text-white">S</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Install Silo</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                Install Silo for a better experience. Access your notes and chat directly from your home screen.
                            </p>
                        </div>
                    </div>

                    {isIOS ? (
                        <div className="space-y-3 pt-2 border-t border-white/5">
                            <div className="flex items-center gap-3 text-sm text-zinc-300">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-zinc-800 text-blue-400">
                                    <Share className="w-3.5 h-3.5" />
                                </span>
                                <span>Tap the <strong>Share</strong> icon</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-zinc-300">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-zinc-800 text-zinc-400">
                                    <PlusSquare className="w-3.5 h-3.5" />
                                </span>
                                <span>Scroll down and tap <strong>Add to Home Screen</strong></span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-zinc-300">
                                <span className="font-semibold text-zinc-500 w-6 text-center">Then</span>
                                <span>Tap <strong>Add</strong> in the top right</span>
                            </div>
                        </div>
                    ) : (
                        <Button
                            onClick={handleInstallClick}
                            className="w-full justify-center bg-white text-black hover:bg-zinc-200"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Install Now
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
