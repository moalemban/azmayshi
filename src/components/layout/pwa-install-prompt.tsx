
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstallPrompt() {
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
      setIsClient(true);
  }, []);

  useEffect(() => {
    if(!isClient) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      // Check if the prompt was dismissed recently
      const lastDismissed = localStorage.getItem('pwaInstallDismissed');
      const oneDay = 24 * 60 * 60 * 1000;
      if (lastDismissed && (Date.now() - parseInt(lastDismissed, 10) < oneDay)) {
        console.log('PWA prompt suppressed as it was dismissed recently.');
        return;
      }
      setInstallPromptEvent(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isClient]);

  const handleInstallClick = useCallback(async () => {
    if (!installPromptEvent) return;

    installPromptEvent.prompt();
    const { outcome } = await installPromptEvent.userChoice;

    if (outcome === 'accepted') {
      toast({ title: 'نصب موفق!', description: 'اپلیکیشن با موفقیت به دستگاه شما اضافه شد.' });
    } else {
       // User dismissed the prompt, don't show it again for a day
       localStorage.setItem('pwaInstallDismissed', Date.now().toString());
    }
    setIsVisible(false);
    setInstallPromptEvent(null);
  }, [installPromptEvent, toast]);
  
  if (!isClient || !isVisible || !installPromptEvent) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleInstallClick}
        className="bg-primary hover:bg-primary/90 text-primary-foreground h-14 px-6 rounded-2xl shadow-lg animate-bounce"
      >
        <Download className="ml-2 h-5 w-5" />
        <span>نصب اپلیکیشن</span>
      </Button>
    </div>
  );
}
