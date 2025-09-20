"use client";

import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Wifi, WifiOff } from 'lucide-react';

export default function NetworkStatusDetector() {
  const { toast, dismiss } = useToast();
  const offlineToastId = useRef<string | null>(null);

  useEffect(() => {
    const handleOffline = () => {
      if (offlineToastId.current) {
        dismiss(offlineToastId.current);
      }
      const { id } = toast({
        title: 'اتصال اینترنت قطع شد!',
        description: 'ممکن است برخی امکانات به درستی کار نکنند. در حال تلاش برای اتصال مجدد...',
        variant: 'destructive',
        duration: Infinity, // Keep it open until dismissed
        className: 'p-4',
        children: <WifiOff className="h-6 w-6 text-white" />,
      });
      offlineToastId.current = id;
    };

    const handleOnline = () => {
      if (offlineToastId.current) {
        dismiss(offlineToastId.current);
        offlineToastId.current = null;
      }
      toast({
        title: 'دوباره به اینترنت متصل شدید!',
        description: 'تمام امکانات برنامه در دسترس هستند.',
        className: 'p-4 bg-green-500/10 text-green-700 dark:text-green-300',
        children: <Wifi className="h-6 w-6 text-green-500" />,
      });
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    // Initial check
    if (!navigator.onLine) {
        handleOffline();
    }

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [toast, dismiss]);

  return null; // This component doesn't render anything itself
}
