"use client";

import { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { summarizeText } from '@/ai/flows/summarize-text-flow';
import { Loader2, Wand2, Trash2, Copy } from 'lucide-react';
import { ZodError } from 'zod';

export default function TextSummarizer() {
  const [originalText, setOriginalText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    setLoading(true);
    setSummary('');

    try {
      const result = await summarizeText({ text: originalText });
      setSummary(result.summary);
    } catch (error: any) {
      console.error(error);
      let description = 'مشکلی در ارتباط با سرور هوش مصنوعی به وجود آمد.';
      if (error instanceof ZodError) {
        description = error.errors[0].message;
      } else if (error.message) {
        description = error.message;
      }
      toast({
        title: 'خطا در خلاصه‌سازی',
        description,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setOriginalText('');
    setSummary('');
  };

  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    toast({
      title: 'کپی شد!',
      description: 'متن خلاصه شده با موفقیت در کلیپ‌بورد کپی شد.',
    });
  };

  return (
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="original-text" className="text-muted-foreground">
            متن اصلی
          </Label>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            disabled={!originalText}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
        <Textarea
          id="original-text"
          value={originalText}
          onChange={(e) => setOriginalText(e.target.value)}
          placeholder="متن طولانی خود را اینجا وارد یا پیست کنید (حداقل ۱۰۰ کاراکتر)..."
          className="min-h-[200px] text-base"
        />
        <p className="text-xs text-muted-foreground text-left pr-1" dir='ltr'>
            {originalText.length.toLocaleString('fa-IR')} / 10,000
        </p>
      </div>
      
      <div className="flex justify-center">
        <Button onClick={handleSummarize} disabled={loading || originalText.length < 100} className="w-full max-w-sm h-12 text-base">
          {loading ? (
            <>
              <Loader2 className="ml-2 h-5 w-5 animate-spin" />
              در حال پردازش...
            </>
          ) : (
            <>
              <Wand2 className="ml-2 h-5 w-5" />
              خلاصه‌سازی کن
            </>
          )}
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="summary-text" className="text-muted-foreground">
            متن خلاصه‌شده
          </Label>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            disabled={!summary || loading}
            className="text-muted-foreground hover:text-primary"
          >
            <Copy className="h-5 w-5" />
          </Button>
        </div>
        <div className="relative">
             <Textarea
                id="summary-text"
                readOnly
                value={summary}
                placeholder="خلاصه متن اینجا نمایش داده می‌شود..."
                className="min-h-[150px] text-base bg-muted/50"
             />
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}
        </div>
      </div>
    </CardContent>
  );
}
