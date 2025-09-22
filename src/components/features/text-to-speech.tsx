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
import { Loader2, Voicemail, Sparkles, Download } from 'lucide-react';

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
        setAudioUrl(result.audioDataUri);
        toast({ title: 'موفقیت!', description: 'متن شما با موفقیت به گفتار تبدیل شد.' });
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
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = 'tabdila-speech.wav';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
        title: 'دانلود شروع شد!',
        description: 'فایل صوتی با فرمت WAV در حال دانلود است.'
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

      {audioUrl && !loading && (
        <div className="space-y-3">
            <audio controls src={audioUrl} className="w-full">
                مرورگر شما از پخش صدا پشتیبانی نمی‌کند.
            </audio>
            <Button onClick={handleDownload} variant="secondary" className="w-full">
                <Download className="ml-2 h-4 w-4"/>
                دانلود فایل WAV
            </Button>
        </div>
      )}
    </CardContent>
  );
}
