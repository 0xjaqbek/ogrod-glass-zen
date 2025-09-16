import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Debug PWA status
    console.log('PWA Install Prompt: Initializing...');
    console.log('User Agent:', navigator.userAgent);
    console.log('Display mode:', window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser');

    // Detect iOS/Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isIOSSafari = isIOS && isSafari;

    console.log('PWA Install Prompt: iOS detected:', isIOS);
    console.log('PWA Install Prompt: Safari detected:', isSafari);
    console.log('PWA Install Prompt: iOS Safari detected:', isIOSSafari);

    // Check if app is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        console.log('PWA Install Prompt: App already installed (standalone mode)');
        setIsInstalled(true);
        return;
      }

      // Check for iOS Safari standalone mode
      if ((window.navigator as any).standalone === true) {
        console.log('PWA Install Prompt: App already installed (iOS standalone)');
        setIsInstalled(true);
        return;
      }
    };

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA Install Prompt: beforeinstallprompt event fired!', e);
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Show prompt after 5 seconds for testing (was 30 seconds)
      setTimeout(() => {
        console.log('PWA Install Prompt: Showing install prompt');
        if (!isInstalled) {
          setShowInstallPrompt(true);
        }
      }, 5000);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);

      toast({
        title: "Aplikacja zainstalowana! 🎉",
        description: "Ogród App został dodany do ekranu głównego",
      });
    };

    checkIfInstalled();

    // Debug service worker status
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        console.log('PWA Install Prompt: Service Worker registrations:', registrations.length);
        registrations.forEach((registration, index) => {
          console.log(`PWA Install Prompt: SW ${index}:`, registration.scope, registration.active?.state);
        });
      });
    }

    // Check manifest
    const manifestLinks = document.querySelectorAll('link[rel="manifest"]');
    console.log('PWA Install Prompt: Manifest links found:', manifestLinks.length);
    manifestLinks.forEach((link, index) => {
      console.log(`PWA Install Prompt: Manifest ${index}:`, (link as HTMLLinkElement).href);
    });

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // For iOS Safari, show manual instructions since no beforeinstallprompt event
    if (isIOSSafari && !isInstalled) {
      setTimeout(() => {
        console.log('PWA Install Prompt: Showing iOS instructions');
        setShowIOSInstructions(true);
      }, 5000);
    }

    // Also listen for any errors
    window.addEventListener('error', (e) => {
      console.error('PWA Install Prompt: Window error:', e);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        toast({
          title: "Instalowanie aplikacji...",
          description: "Aplikacja zostanie wkrótce dodana do ekranu głównego",
        });
      }

      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      console.error('Error during install:', error);
      toast({
        title: "Błąd instalacji",
        description: "Nie udało się zainstalować aplikacji",
        variant: "destructive",
      });
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setShowIOSInstructions(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed or dismissed this session
  if (isInstalled || sessionStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  // Show iOS instructions
  if (showIOSInstructions) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">🌱</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Dodaj do Ekranu Głównego</h3>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-xs text-gray-600 dark:text-gray-400 mb-3 space-y-1">
            <p>Aby zainstalować aplikację:</p>
            <p>1. Naciśnij przycisk "Udostępnij" ↗️ w Safari</p>
            <p>2. Wybierz "Dodaj do ekranu głównego"</p>
            <p>3. Naciśnij "Dodaj"</p>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleDismiss}
              size="sm"
              className="flex-1 text-xs"
            >
              Rozumiem
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show Android/Windows install prompt
  if (!showInstallPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🌱</span>
            </div>
            <div>
              <h3 className="font-semibold text-sm">Zainstaluj Ogród App</h3>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
          Dodaj do ekranu głównego dla szybszego dostępu
        </p>

        <div className="flex space-x-2">
          <Button
            onClick={handleInstallClick}
            size="sm"
            className="flex-1 text-xs"
          >
            <Download className="h-3 w-3 mr-1" />
            Zainstaluj
          </Button>
          <Button
            variant="outline"
            onClick={handleDismiss}
            size="sm"
            className="text-xs"
          >
            Później
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;