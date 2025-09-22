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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const FormSchema = z.object({
  text: z.string().min(1, { message: 'متن برای تبدیل به گفتار نمی‌تواند خالی باشد.' }).max(1000, 'حداکثر طول متن ۱۰۰۰ کاراکتر است.'),
});

type FormValues = z.infer<typeof FormSchema>;

// Client-side utility to create a WAV file from raw PCM data
const createWavFile = (pcmData: ArrayBuffer): Blob => {
    const sampleRate = 24000;
    const numChannels = 1;
    const bytesPerSample = 2;
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = pcmData.byteLength;

    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    // RIFF chunk descriptor
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(view, 8, 'WAVE');

    // "fmt " sub-chunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // Sub-chunk size
    view.setUint16(20, 1, true); // Audio format (1 for PCM)
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bytesPerSample * 8, true); // Bits per sample

    // "data" sub-chunk
    writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);

    // Write the PCM data
    new Uint8Array(buffer, 44).set(new Uint8Array(pcmData));

    return new Blob([view], { type: 'audio/wav' });
};

const writeString = (view: DataView, offset: number, str: string) => {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
};


export default function TextToSpeech() {
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
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
    setAudioBlobUrl(null);

    try {
      const result = await textToSpeech(data);
      if (result.audioDataUri) {
        // The data URI contains base64 encoded raw PCM data
        const parts = result.audioDataUri.split(',');
        const base64Data = parts[1];
        const byteString = atob(base64Data);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
          uint8Array[i] = byteString.charCodeAt(i);
        }

        const wavBlob = createWavFile(arrayBuffer);
        const url = URL.createObjectURL(wavBlob);
        setAudioBlobUrl(url);

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
    if (!audioBlobUrl) return;
    const link = document.createElement('a');
    link.href = audioBlobUrl;
    link.download = 'tabdila-speech.wav';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

      {audioBlobUrl && (
        <Alert className="bg-green-500/10 border-green-500/20">
          <Voicemail className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-700 dark:text-green-400">فایل صوتی آماده است</AlertTitle>
          <AlertDescription className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2">
            <audio controls src={audioBlobUrl} className="w-full sm:w-auto">
              مرورگر شما از پخش صدا پشتیبانی نمی‌کند.
            </audio>
             <Button variant="outline" onClick={handleDownload} className="w-full sm:w-auto">
                <Download className="h-4 w-4 ml-2" />
                دانلود (WAV)
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </CardContent>
  );
}
