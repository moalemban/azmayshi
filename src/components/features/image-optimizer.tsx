"use client";

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, Loader2, Image as ImageIcon, Trash2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const MAX_FILE_SIZE_MB = 10;

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 بایت';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const schema = z.object({
  file: z.instanceof(File)
    .refine(file => file.size > 0, 'لطفا یک تصویر انتخاب کنید.')
    .refine(file => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024, `حجم فایل باید کمتر از ${MAX_FILE_SIZE_MB} مگابایت باشد.`),
});

type FormValues = z.infer<typeof schema>;

export default function ImageOptimizer() {
  const [loading, setLoading] = useState(false);
  const [optimizedImage, setOptimizedImage] = useState<{ url: string, size: number, name: string } | null>(null);
  const [originalImage, setOriginalImage] = useState<{ url: string, size: number, name: string } | null>(null);
  const [quality, setQuality] = useState(80);

  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  
  const watchedFile = watch('file');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          toast({ title: 'حجم فایل زیاد است', description: `حجم فایل باید کمتر از ${MAX_FILE_SIZE_MB} مگابایت باشد.`, variant: 'destructive' });
          return;
      }
      setValue('file', file, { shouldValidate: true });
      setOriginalImage({ url: URL.createObjectURL(file), size: file.size, name: file.name });
      setOptimizedImage(null);
    }
  };
  
  const onDragOver = (e: React.DragEvent) => e.preventDefault();
  const onDrop = (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) {
          if (fileInputRef.current) {
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(file);
              fileInputRef.current.files = dataTransfer.files;
          }
          handleFileChange({ target: { files: e.dataTransfer.files } } as any);
      }
  };
  
  const resetComponent = () => {
    reset();
    setOriginalImage(null);
    setOptimizedImage(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }


  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setOptimizedImage(null);

    const formData = new FormData();
    formData.append('image', data.file);
    formData.append('quality', String(quality));

    try {
      const response = await fetch('/api/compress', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'بهینه‌سازی با خطا مواجه شد.');
      }
      
      const filename = response.headers.get('Content-Disposition')?.split('filename=')[1].replace(/"/g, '') || 'optimized_image';

      const blob = await response.blob();
      
      setOptimizedImage({
        url: URL.createObjectURL(blob),
        size: blob.size,
        name: filename,
      });
      
      toast({
        title: 'موفقیت!',
        description: 'تصویر شما با موفقیت بهینه شد.',
      });

    } catch (error: any) {
      toast({
        title: 'خطا در بهینه‌سازی',
        description: error.message || 'مشکلی در سرور رخ داد.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!optimizedImage) return;
    const link = document.createElement('a');
    link.href = optimizedImage.url;
    link.download = optimizedImage.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reductionPercentage = originalImage && optimizedImage
    ? Math.round(((originalImage.size - optimizedImage.size) / originalImage.size) * 100)
    : 0;

  return (
    <CardContent className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {!originalImage && (
          <div 
            className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
             onDragOver={onDragOver} onDrop={onDrop} onClick={() => fileInputRef.current?.click()}
          >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg, image/webp, image/gif, image/avif, image/tiff" />
              <Upload className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-center font-semibold">تصویر را بکشید یا برای انتخاب کلیک کنید</p>
              <p className="text-xs text-muted-foreground/70 mt-2">JPG, PNG, WEBP, GIF, AVIF, TIFF - حداکثر ${MAX_FILE_SIZE_MB} مگابایت</p>
              {errors.file && <p className="text-sm text-destructive mt-2">{errors.file.message}</p>}
          </div>
        )}

        {originalImage && (
          <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label htmlFor="quality-slider">کیفیت بهینه‌سازی</Label>
                    <span className="font-mono text-primary">{quality}%</span>
                </div>
                <Slider
                    id="quality-slider"
                    value={[quality]}
                    onValueChange={(val) => setQuality(val[0])}
                    min={10}
                    max={100}
                    step={1}
                    disabled={loading}
                />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                {/* Original Image */}
                <div className="space-y-2">
                  <Label>تصویر اصلی</Label>
                  <div className="border rounded-lg p-2 bg-muted/20 text-center">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img src={originalImage.url} alt="Original" className="max-h-60 mx-auto rounded-md shadow-md"/>
                     <p className="text-sm font-semibold mt-2">{originalImage.name}</p>
                     <p className="text-xs text-muted-foreground font-mono">{formatBytes(originalImage.size)}</p>
                  </div>
                </div>
                
                {/* Optimized Image */}
                <div className="space-y-2">
                   <Label>تصویر بهینه شده</Label>
                   <div className="border rounded-lg p-2 bg-muted/20 text-center min-h-[200px] flex flex-col justify-center">
                     {loading ? (
                        <Loader2 className="w-10 h-10 mx-auto animate-spin text-primary"/>
                     ) : optimizedImage ? (
                       <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={optimizedImage.url} alt="Optimized" className="max-h-60 mx-auto rounded-md shadow-md"/>
                          <p className="text-sm font-semibold mt-2">{optimizedImage.name}</p>
                          <p className="text-xs text-green-500 font-mono font-bold">{formatBytes(optimizedImage.size)}</p>
                       </>
                     ) : (
                       <div className="text-muted-foreground">
                          <ImageIcon className="w-12 h-12 mx-auto mb-2"/>
                          <p>برای بهینه‌سازی کلیک کنید</p>
                       </div>
                     )}
                   </div>
                </div>
             </div>
          </div>
        )}

        {originalImage && (
          <>
            {optimizedImage && (
              <div className="text-center p-3 bg-green-500/10 rounded-lg">
                <p className="font-bold text-lg text-green-700">
                  کاهش حجم: {reductionPercentage.toLocaleString('fa-IR')}%
                </p>
              </div>
            )}
            <div className="flex flex-col-reverse sm:flex-row gap-2">
              <Button type="button" variant="outline" className="w-full h-12" onClick={resetComponent}>
                <Trash2 className="ml-2 h-5 w-5"/>
                حذف و شروع مجدد
              </Button>
              {!optimizedImage ? (
                  <Button type="submit" disabled={loading} className="w-full h-12 text-base">
                      {loading ? (
                        <><Loader2 className="ml-2 h-5 w-5 animate-spin" /> در حال پردازش...</>
                      ) : (
                        'شروع بهینه‌سازی'
                      )}
                  </Button>
              ) : (
                  <Button type="button" onClick={handleDownload} className="w-full h-12 text-base">
                    <Download className="ml-2 h-5 w-5" />
                    دانلود نسخه بهینه
                  </Button>
              )}
            </div>
          </>
        )}
      </form>
    </CardContent>
  );
}
