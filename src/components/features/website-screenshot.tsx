"use client";

import { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { takeScreenshot } from '@/ai/flows/screenshot-flow';
import { Camera, Download, Loader2, Image as ImageIcon } from 'lucide-react';
import { Label } from '../ui/label';

export default function WebsiteScreenshot() {
  const [url, setUrl] = useState('https://www.google.com');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleTakeScreenshot = async () => {
    if (!url) {
      toast({
        title: 'خطا',
        description: 'لطفاً یک آدرس وب‌سایت وارد کنید.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setScreenshot(null);

    try {
      const result = await takeScreenshot({ url });
      if (result.screenshotBase64) {
        setScreenshot(result.screenshotBase64);
        toast({
          title: 'موفقیت!',
          description: 'اسکرین‌شات با موفقیت گرفته شد.',
        });
      } else {
        throw new Error(result.error || 'خطای ناشناخته در گرفتن اسکرین‌شات.');
      }
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'خطا در گرفتن اسکرین‌شات',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (!screenshot) return;
    const link = document.createElement('a');
    link.href = screenshot;
    
    // Extract hostname for filename
    let filename = 'screenshot.png';
    try {
        const urlObject = new URL(url);
        filename = `${urlObject.hostname}_screenshot.png`;
    } catch (e) {
        // keep default
    }

    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2 space-y-2">
                <Label htmlFor="url-input" className="text-muted-foreground">آدرس وب‌سایت (URL)</Label>
                <Input
                    id="url-input"
                    dir="ltr"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="مثلا: https://example.com"
                    className="h-12 text-lg"
                />
            </div>
            <Button onClick={handleTakeScreenshot} disabled={loading} className="w-full h-12 text-base">
                {loading ? (
                <>
                    <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                    در حال پردازش...
                </>
                ) : (
                <>
                    <Camera className="ml-2 h-5 w-5" />
                    بگیر
                </>
                )}
            </Button>
        </div>
        
        <div className="space-y-4">
             <div className="p-2 border rounded-lg bg-muted/20 min-h-[200px] flex items-center justify-center">
                {screenshot ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={screenshot} alt="Website screenshot" className="w-full h-auto rounded-md border shadow-md" />
                ) : (
                    <div className="text-center text-muted-foreground">
                        {loading ? <Loader2 className="h-10 w-10 animate-spin" /> : <ImageIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50"/>}
                        {loading ? 'لطفا کمی صبر کنید...' : 'پیش‌نمایش اسکرین‌شات اینجا نمایش داده می‌شود.'}
                    </div>
                )}
             </div>
             
             {screenshot && (
                 <Button onClick={handleDownload} disabled={!screenshot || loading} className="w-full h-12 text-base">
                    <Download className="ml-2 h-5 w-5" />
                    دانلود اسکرین‌شات
                  </Button>
             )}
        </div>

    </CardContent>
  );
}
