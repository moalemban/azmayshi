"use client";

import { useState, useRef, useCallback } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, Loader2, Image as ImageIcon, Settings, Trash2, X, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const MAX_FILE_SIZE_MB = 10;
const MAX_FILES = 10;

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 بایت';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const schema = z.object({
  files: z.array(z.instanceof(File))
    .min(1, 'حداقل یک تصویر انتخاب کنید.')
    .max(MAX_FILES, `حداکثر ${MAX_FILES} تصویر مجاز است.`),
  formats: z.array(z.string()).min(1, 'حداقل یک فرمت خروجی انتخاب کنید.'),
  quality: z.number().min(10).max(100),
  resize: z.object({
    width: z.number().optional(),
    height: z.number().optional(),
  }),
  crop: z.boolean(),
  stripMetadata: z.boolean(),
  smartMode: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export default function ImageOptimizer() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      files: [],
      formats: ['webp'],
      quality: 80,
      resize: { width: undefined, height: undefined },
      crop: false,
      stripMetadata: true,
      smartMode: false,
    },
  });
  
  const { fields, append, remove } = useFieldArray({ control, name: "files" });

  const watchedFiles = watch('files');
  const watchedQuality = watch('quality');
  const watchedFormats = watch('formats');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);
    if (newFiles.length === 0) return;
    
    const validFiles = newFiles.filter(file => {
        if (!file.type.startsWith('image/')) {
            toast({ title: 'فایل نامعتبر', description: `فایل ${file.name} یک تصویر نیست.`, variant: 'destructive' });
            return false;
        }
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            toast({ title: 'حجم فایل زیاد است', description: `حجم فایل ${file.name} بیشتر از ${MAX_FILE_SIZE_MB} مگابایت است.`, variant: 'destructive' });
            return false;
        }
        return true;
    });

    const totalFiles = watchedFiles.length + validFiles.length;
    if (totalFiles > MAX_FILES) {
        toast({ title: 'تعداد فایل بیش از حد مجاز', description: `شما فقط می‌توانید تا ${MAX_FILES} تصویر را همزمان بهینه کنید.`, variant: 'destructive'});
        const remainingSlots = MAX_FILES - watchedFiles.length;
        append(validFiles.slice(0, remainingSlots));
    } else {
        append(validFiles);
    }
  };

  const onDragOver = (e: React.DragEvent) => e.preventDefault();
  const onDrop = (e: React.DragEvent) => {
      e.preventDefault();
      if (fileInputRef.current) {
          fileInputRef.current.files = e.dataTransfer.files;
          handleFileChange({ target: fileInputRef.current } as any);
      }
  };


  const onSubmit = async (data: FormValues) => {
    setLoading(true);

    const formData = new FormData();
    data.files.forEach(file => formData.append('images', file));
    formData.append('quality', String(data.quality));
    formData.append('formats', data.formats.join(','));
    if (data.resize.width) formData.append('width', String(data.resize.width));
    if (data.resize.height) formData.append('height', String(data.resize.height));
    formData.append('crop', String(data.crop));
    formData.append('stripMetadata', String(data.stripMetadata));
    formData.append('smartMode', String(data.smartMode));

    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'بهینه‌سازی با خطا مواجه شد.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'optimized_images.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'موفقیت!',
        description: 'تصاویر شما با موفقیت بهینه و در فایل ZIP دانلود شدند.',
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
  
  const totalOriginalSize = watchedFiles.reduce((acc, file) => acc + file.size, 0);

  return (
    <CardContent className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* File Upload Area */}
        <div 
          className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
           onDragOver={onDragOver} onDrop={onDrop} onClick={() => fileInputRef.current?.click()}
        >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" multiple />
            <Upload className="w-10 h-10 text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground text-center">تصاویر را بکشید یا برای انتخاب کلیک کنید</p>
            <p className="text-xs text-muted-foreground/70 mt-1">حداکثر {MAX_FILES} تصویر، هر کدام تا {MAX_FILE_SIZE_MB} مگابایت</p>
            {errors.files && <p className="text-sm text-destructive mt-2">{errors.files.message || errors.files.root?.message}</p>}
        </div>

        {/* File List */}
        {fields.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">فایل‌های انتخاب شده ({fields.length}):</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg bg-muted/20">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center justify-between p-2 bg-background rounded-md text-sm">
                        <div className="flex items-center gap-2 overflow-hidden">
                           {/* eslint-disable-next-line @next/next/no-img-element */}
                           <img src={URL.createObjectURL(field as any)} alt={field.name} className="w-8 h-8 rounded object-cover" />
                           <div className='flex flex-col overflow-hidden'>
                             <span className="truncate font-medium text-foreground">{field.name}</span>
                             <span className="text-xs text-muted-foreground">{formatBytes(field.size)}</span>
                           </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => remove(index)}>
                            <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                    </div>
                ))}
            </div>
             <p className="text-xs text-muted-foreground text-left pr-1">
                حجم کل: {formatBytes(totalOriginalSize)}
            </p>
          </div>
        )}

        {/* Settings */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground"><Settings className="w-5 h-5"/> تنظیمات بهینه‌سازی</h3>

          {/* Formats */}
          <div className="space-y-2">
            <Label>فرمت‌های خروجی</Label>
            <div className="flex flex-wrap gap-2">
              {['jpeg', 'png', 'webp', 'avif'].map(fmt => (
                <Button 
                    key={fmt} type="button" 
                    variant={watchedFormats.includes(fmt) ? 'default' : 'outline'}
                    onClick={() => {
                        const current = watchedFormats;
                        const next = current.includes(fmt) ? current.filter(f => f !== fmt) : [...current, fmt];
                        setValue('formats', next);
                    }}
                >
                  {fmt.toUpperCase()}
                </Button>
              ))}
            </div>
            {errors.formats && <p className="text-sm text-destructive">{errors.formats.message}</p>}
          </div>

          {/* Quality */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>کیفیت</Label>
              <span className="text-sm font-mono text-primary">{watchedQuality}%</span>
            </div>
            <Controller name="quality" control={control} render={({ field }) => (
                <Slider value={[field.value]} onValueChange={val => field.onChange(val[0])} min={10} max={100} step={1} />
            )} />
          </div>

          {/* Resize */}
          <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">عرض (اختیاری)</Label>
                <Controller name="resize.width" control={control} render={({ field }) => (
                  <Input id="width" type="number" placeholder="1920" {...field} onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                )} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">ارتفاع (اختیاری)</Label>
                 <Controller name="resize.height" control={control} render={({ field }) => (
                  <Input id="height" type="number" placeholder="1080" {...field} onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                )} />
              </div>
          </div>
          
          {/* Other Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
             <Controller name="crop" control={control} render={({ field }) => (
                <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
                    <Checkbox id="crop" checked={field.value} onCheckedChange={field.onChange} />
                    <Label htmlFor="crop" className="cursor-pointer">برش تصویر (Crop)</Label>
                </div>
            )} />
             <Controller name="stripMetadata" control={control} render={({ field }) => (
                 <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
                    <Checkbox id="stripMetadata" checked={field.value} onCheckedChange={field.onChange} />
                    <Label htmlFor="stripMetadata" className="cursor-pointer">حذف متادیتا</Label>
                </div>
            )} />
             <Controller name="smartMode" control={control} render={({ field }) => (
                 <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
                    <Checkbox id="smartMode" checked={field.value} onCheckedChange={field.onChange} />
                    <Label htmlFor="smartMode" className="cursor-pointer">حالت هوشمند کیفیت</Label>
                </div>
            )} />
          </div>
           {watch('smartMode') && (
               <Alert variant='default' className='bg-primary/10 border-primary/20'>
                  <Info className="h-4 w-4 text-primary" />
                  <AlertTitle className='text-primary'>حالت هوشمند فعال است</AlertTitle>
                  <AlertDescription className='text-primary/80'>
                    در این حالت، کیفیت به صورت خودکار بر اساس حجم اولیه تصویر تنظیم می‌شود تا بهترین تعادل بین حجم و کیفیت حاصل شود.
                  </AlertDescription>
              </Alert>
           )}


        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={loading || watchedFiles.length === 0} className="w-full h-12 text-base">
          {loading ? (
            <>
              <Loader2 className="ml-2 h-5 w-5 animate-spin" />
              در حال بهینه‌سازی...
            </>
          ) : (
            <>
              <Download className="ml-2 h-5 w-5" />
              شروع و دانلود ({watchedFiles.length}) تصویر
            </>
          )}
        </Button>
      </form>
    </CardContent>
  );
}