"use client";

import { useState, useRef } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, Loader2, Image as ImageIcon } from 'lucide-react';

interface OptimizedResult {
  blob: Blob;
  originalSize: number;
  optimizedSize: number;
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export default function ImageOptimizer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [optimizedResult, setOptimizedResult] = useState<OptimizedResult | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'فایل نامعتبر',
          description: 'لطفا یک فایل تصویری انتخاب کنید.',
          variant: 'destructive',
        });
        return;
      }
      setSelectedFile(file);
      setOptimizedResult(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompress = async () => {
    if (!selectedFile) {
      toast({
        title: 'خطا',
        description: 'ابتدا یک تصویر را برای فشرده‌سازی انتخاب کنید.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setOptimizedResult(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('/api/compress', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('فشرده‌سازی با خطا مواجه شد.');
      }

      const blob = await response.blob();
      setOptimizedResult({
        blob,
        originalSize: selectedFile.size,
        optimizedSize: blob.size,
      });
      toast({
        title: 'موفقیت!',
        description: 'تصویر شما با موفقیت بهینه شد.',
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'خطا در فشرده‌سازی',
        description: error.message || 'مشکلی در ارتباط با سرور به وجود آمد.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!optimizedResult) return;
    const url = URL.createObjectURL(optimizedResult.blob);
    const link = document.createElement('a');
    link.href = url;
    const originalName = selectedFile?.name.split('.').slice(0, -1).join('.') || 'optimized';
    link.download = `${originalName}.webp`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const triggerFileSelect = () => fileInputRef.current?.click();


  return (
    <CardContent className="space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/gif, image/webp"
      />
      
      {!preview ? (
        <div 
          onClick={triggerFileSelect} 
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
        >
          <Upload className="w-12 h-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground text-lg">برای آپلود، تصویر را بکشید یا اینجا کلیک کنید</p>
          <p className="text-muted-foreground/70 text-sm mt-1">پشتیبانی از فرمت‌های PNG, JPG, GIF, WebP</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="space-y-4">
                 <div className="space-y-2">
                    <Label>تصویر اصلی</Label>
                    <div className="p-2 border rounded-lg bg-muted/20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={preview} alt="Original Preview" className="w-full h-auto max-h-64 object-contain rounded-md" />
                        {selectedFile && <p className="text-center text-sm mt-2 text-muted-foreground">حجم: {formatBytes(selectedFile.size)}</p>}
                    </div>
                 </div>
                 
                 <Button onClick={handleCompress} disabled={loading} className="w-full h-12 text-base">
                    {loading ? (
                      <>
                        <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                        در حال فشرده‌سازی...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="ml-2 h-5 w-5" />
                        شروع فشرده‌سازی
                      </>
                    )}
                  </Button>
            </div>
            
            <div className="space-y-4">
                 <div className="space-y-2">
                    <Label>تصویر بهینه شده (WebP)</Label>
                    <div className="p-2 border rounded-lg bg-muted/20 h-[304px] flex items-center justify-center">
                       {optimizedResult ? (
                         <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={URL.createObjectURL(optimizedResult.blob)} alt="Optimized Preview" className="w-full h-auto max-h-64 object-contain rounded-md" />
                         </>
                       ) : (
                           <div className="text-center text-muted-foreground">
                               {loading ? <Loader2 className="h-10 w-10 animate-spin" /> : 'نتیجه اینجا نمایش داده می‌شود'}
                           </div>
                       )}
                    </div>
                    {optimizedResult && (
                        <div className="text-center text-sm text-primary font-semibold">
                            <p>حجم جدید: {formatBytes(optimizedResult.optimizedSize)}</p>
                            <p>کاهش حجم: {(((optimizedResult.originalSize - optimizedResult.optimizedSize) / optimizedResult.originalSize) * 100).toFixed(1)}%</p>
                        </div>
                    )}
                 </div>

                 <Button onClick={handleDownload} disabled={!optimizedResult || loading} className="w-full h-12 text-base">
                    <Download className="ml-2 h-5 w-5" />
                    دانلود تصویر بهینه
                  </Button>
            </div>
        </div>
      )}
    </CardContent>
  );
}
