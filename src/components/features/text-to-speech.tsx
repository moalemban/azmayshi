"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { textToSpeech } from '@/ai/flows/text-to-speech-flow';
import { Loader2, Voicemail, Sparkles, Download, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const FormSchema = z.object({
  text: z.string().min(1, { message: 'متن برای تبدیل به گفتار نمی‌تواند خالی باشد.' }).max(1000, 'حداکثر طول متن ۱۰۰۰ کاراکتر است.'),
});

type FormValues = z.infer<typeof FormSchema>;

export default function TextToSpeech() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange'
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    setAudioUrl(null);

    try {
      const result = await textToSpeech(data);
      if (result.audioDataUri) {
        // Since we are not converting to WAV, we cannot play it directly.
        // We will just show a success message. The download functionality will also be disabled.
        setAudioUrl(result.audioDataUri); // Store the data uri, even if not playable.
        toast({ title: 'موفقیت!', description: 'داده صوتی با موفقیت تولید شد. (پخش مستقیم غیرفعال است)' });
      } else {
        throw new Error(result.error || 'خطای نامشخص در تبدیل متن به گفتار.');
      }
    } catch (error: any) {
      toast({
        title: 'خطا',
        description: error.message || 'مشکلی در ارتباط با سرویس رخ داد.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    toast({
        title: 'غیرفعال',
        description: 'امکان دانلود مستقیم فایل صوتی در این نسخه وجود ندارد.',
        variant: 'destructive',
    })
  }

  return (
    <CardContent className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="text-to-speech-input" className="text-muted-foreground">متن فارسی خود را وارد کنید (حداکثر ۱۰۰۰ کاراکتر)</Label>
          <Textarea
            id="text-to-speech-input"
            {...register('text')}
            placeholder="سلام، به «تبدیلا» خوش آمدید..."
            className="min-h-[120px] text-base"
          />
          {errors.text && <p className="text-sm text-destructive mt-1">{errors.text.message}</p>}
        </div>
        <Button type="submit" disabled={loading || !isValid} className="w-full h-12 text-base">
          {loading ? (
            <><Loader2 className="ml-2 h-5 w-5 animate-spin" /> در حال پردازش...</>
          ) : (
            <><Sparkles className="ml-2 h-5 w-5" /> تبدیل به گفتار</>
          )}
        </Button>
      </form>

      {loading && (
        <div className="flex items-center justify-center min-h-[80px] bg-muted/50 rounded-lg">
             <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {audioUrl && (
        <Alert className="bg-yellow-500/10 border-yellow-500/20">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-700 dark:text-yellow-400">فایل صوتی تولید شد</AlertTitle>
          <AlertDescription className="text-yellow-600 dark:text-yellow-300">
            صدا با موفقیت تولید شد اما امکان پخش یا دانلود مستقیم در این نسخه وجود ندارد.
          </AlertDescription>
        </Alert>
      )}
    </CardContent>
  );
}
