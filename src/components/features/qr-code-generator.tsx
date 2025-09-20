"use client";

import { useState, useEffect, useRef } from 'react';
import QRCodeStyling, { type Options as QRCodeOptions, type FileExtension } from 'qr-code-styling';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Download, Link, Palette, Settings, Type, Image as ImageIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const defaultOptions: QRCodeOptions = {
  width: 300,
  height: 300,
  type: 'svg',
  data: 'https://tabdila.com',
  image: '',
  margin: 10,
  qrOptions: {
    typeNumber: 0,
    mode: 'Byte',
    errorCorrectionLevel: 'Q',
  },
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.4,
    margin: 10,
    crossOrigin: 'anonymous',
  },
  dotsOptions: {
    color: '#4267b2',
    type: 'rounded',
  },
  backgroundOptions: {
    color: '#ffffff',
  },
  cornersSquareOptions: {
    color: '#4267b2',
    type: 'extra-rounded',
  },
  cornersDotOptions: {
    color: '#4267b2',
    type: 'dot',
  },
};


export default function QrCodeGenerator() {
  const [options, setOptions] = useState<QRCodeOptions>(defaultOptions);
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (ref.current) {
      const qr = new QRCodeStyling(options);
      setQrCode(qr);
      ref.current.innerHTML = '';
      qr.append(ref.current);
    }
  }, [options]);
  
  const handleUpdate = (newOptions: Partial<QRCodeOptions>) => {
    setOptions(prev => ({...prev, ...newOptions}));
  }

  const onDownloadClick = (extension: FileExtension) => {
    if (!qrCode) return;
    qrCode.download({
      name: 'tabdila-qrcode',
      extension,
    });
    toast({ title: 'دانلود شروع شد!', description: `فایل QR Code با فرمت ${extension} در حال دانلود است.`});
  };

  return (
    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      <div className="md:col-span-2 space-y-6">
        
        {/* Content Section */}
        <Tabs defaultValue="text">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text"><Type className="w-4 h-4 ml-2"/>متن</TabsTrigger>
            <TabsTrigger value="url"><Link className="w-4 h-4 ml-2"/>آدرس وب</TabsTrigger>
          </TabsList>
          <TabsContent value="text" className="pt-4">
              <Label htmlFor="qr-data-text" className="text-muted-foreground">متن دلخواه</Label>
              <Textarea id="qr-data-text" value={options.data} onChange={(e) => handleUpdate({ data: e.target.value })} placeholder="متن یا اطلاعات خود را وارد کنید..."/>
          </TabsContent>
          <TabsContent value="url" className="pt-4">
               <Label htmlFor="qr-data-url" className="text-muted-foreground">آدرس اینترنتی (URL)</Label>
              <Input id="qr-data-url" dir="ltr" value={options.data} onChange={(e) => handleUpdate({ data: e.target.value })} placeholder="https://example.com"/>
          </TabsContent>
        </Tabs>

        {/* Style Section */}
        <Tabs defaultValue="dots">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="dots"><Palette className="w-4 h-4 ml-2"/>نقاط</TabsTrigger>
                <TabsTrigger value="corners"><Palette className="w-4 h-4 ml-2"/>گوشه‌ها</TabsTrigger>
                <TabsTrigger value="logo"><ImageIcon className="w-4 h-4 ml-2"/>لوگو</TabsTrigger>
            </TabsList>
            <TabsContent value="dots" className="space-y-4 pt-4">
                <div className='flex gap-4 items-center'>
                    <Label htmlFor='dots-color-input'>رنگ نقاط</Label>
                    <Input type="color" id="dots-color-input" value={options.dotsOptions?.color} onChange={(e) => handleUpdate({ dotsOptions: { ...options.dotsOptions, color: e.target.value }})} className="w-16 h-10 p-1"/>
                </div>
                 <div className='space-y-2'>
                    <Label>نوع نقاط</Label>
                    <Select value={options.dotsOptions?.type} onValueChange={(type) => handleUpdate({ dotsOptions: { ...options.dotsOptions, type }})}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="rounded">گرد</SelectItem>
                            <SelectItem value="dots">نقطه ای</SelectItem>
                            <SelectItem value="classy">کلاسیک</SelectItem>
                            <SelectItem value="classy-rounded">کلاسیک گرد</SelectItem>
                            <SelectItem value="square">مربع</SelectItem>
                            <SelectItem value="extra-rounded">بسیار گرد</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
            </TabsContent>
             <TabsContent value="corners" className="space-y-4 pt-4">
                <div className='flex gap-4 items-center'>
                    <Label htmlFor='corners-color-input'>رنگ گوشه‌ها</Label>
                    <Input type="color" id="corners-color-input" value={options.cornersSquareOptions?.color} onChange={(e) => handleUpdate({ cornersSquareOptions: { ...options.cornersSquareOptions, color: e.target.value }})} className="w-16 h-10 p-1"/>
                </div>
                 <div className='space-y-2'>
                    <Label>نوع گوشه‌ها</Label>
                    <Select value={options.cornersSquareOptions?.type} onValueChange={(type) => handleUpdate({ cornersSquareOptions: { ...options.cornersSquareOptions, type }})}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="dot">نقطه‌ای</SelectItem>
                            <SelectItem value="square">مربع</SelectItem>
                            <SelectItem value="extra-rounded">بسیار گرد</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
            </TabsContent>
             <TabsContent value="logo" className="space-y-4 pt-4">
                <div className='space-y-2'>
                    <Label htmlFor="logo-url">آدرس URL لوگو</Label>
                    <Input id="logo-url" value={options.image} onChange={(e) => handleUpdate({ image: e.target.value })} placeholder="http://.../logo.png" dir="ltr"/>
                    <p className='text-xs text-muted-foreground'>برای حذف لوگو، آدرس را پاک کنید.</p>
                </div>
                 <div className='space-y-2'>
                     <div className="flex items-center justify-between">
                        <Label>اندازه لوگو</Label>
                        <span className="font-mono text-primary text-sm">{options.imageOptions?.imageSize}</span>
                    </div>
                    <Slider value={[options.imageOptions?.imageSize || 0.4]} onValueChange={(v) => handleUpdate({ imageOptions: {...options.imageOptions, imageSize: v[0] }})} min={0.1} max={0.7} step={0.1} />
                </div>
            </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-4 md:col-span-1">
        <div ref={ref} className="mx-auto w-full max-w-[300px] aspect-square border-2 border-dashed rounded-lg p-2" />
        <div className="flex gap-2">
            <Button onClick={() => onDownloadClick('png')} className="flex-1 h-12"><Download className="w-4 h-4 ml-2"/> PNG</Button>
            <Button onClick={() => onDownloadClick('svg')} variant="secondary" className="flex-1 h-12"><Download className="w-4 h-4 ml-2"/> SVG</Button>
            <Button onClick={() => onDownloadClick('webp')} variant="secondary" className="flex-1 h-12"><Download className="w-4 h-4 ml-2"/> WebP</Button>
        </div>
      </div>
    </CardContent>
  );
}
