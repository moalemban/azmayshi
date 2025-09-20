"use client";

import { useState, useEffect, useRef } from 'react';
import QRCodeStyling, { type Options as QRCodeOptions, type FileExtension, type DotType, type CornerSquareType } from 'qr-code-styling';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Download, Link, Palette, Settings, Type, Image as ImageIcon, Upload } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
    margin: 5,
    crossOrigin: 'anonymous',
  },
  dotsOptions: {
    color: '#000000',
    type: 'rounded',
  },
  backgroundOptions: {
    color: '#ffffff',
  },
  cornersSquareOptions: {
    color: '#000000',
    type: 'extra-rounded',
  },
};

const dotTypes: { value: DotType; label: string }[] = [
    { value: "rounded", label: "گرد" },
    { value: "dots", label: "نقطه‌ای" },
    { value: "classy", label: "کلاسیک" },
    { value: "classy-rounded", label: "کلاسیک-گرد" },
    { value: "square", label: "مربعی" },
    { value: "extra-rounded", label: "بسیار گرد" },
];

const cornerTypes: { value: CornerSquareType; label: string }[] = [
    { value: "extra-rounded", label: "بسیار گرد" },
    { value: "dot", label: "نقطه‌ای" },
    { value: "square", label: "مربعی" },
];


export default function QrCodeGenerator() {
  const [options, setOptions] = useState<QRCodeOptions>(defaultOptions);
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!qrCode) {
        const qr = new QRCodeStyling(options)
        setQrCode(qr);
        if (ref.current) {
            ref.current.innerHTML = "";
            qr.append(ref.current);
        }
    } else {
        qrCode.update(options);
    }
  }, [options, qrCode]);
  
  const handleUpdate = (newOptions: Partial<QRCodeOptions>) => {
    setOptions(prev => ({...prev, ...newOptions}));
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if(event.target?.result) {
            handleUpdate({ image: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onDownloadClick = (extension: FileExtension) => {
    if (!qrCode) return;
    qrCode.download({
      name: 'tabdila-qrcode',
      extension,
    });
    toast({ title: 'دانلود شروع شد!', description: `فایل QR Code با فرمت ${extension} در حال دانلود است.`});
  };
  
  const ColorPicker = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void}) => (
    <div className='flex items-center justify-between'>
        <Label>{label}</Label>
        <div className="relative">
            <Input type="color" value={value} onChange={e => onChange(e.target.value)} className="w-16 h-10 p-1"/>
        </div>
    </div>
  )

  return (
    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* === Left Side: Options === */}
        <div className="md:col-span-2 space-y-4">
            <Tabs defaultValue="content">
                <TabsList className="grid w-full grid-cols-2 h-12">
                    <TabsTrigger value="content" className="h-10 text-base"><Type className="w-5 h-5 ml-2"/>محتوا</TabsTrigger>
                    <TabsTrigger value="design" className="h-10 text-base"><Palette className="w-5 h-5 ml-2"/>طراحی</TabsTrigger>
                </TabsList>
                
                {/* Content Tab */}
                <TabsContent value="content" className="space-y-4 pt-4">
                     <div className="space-y-2">
                        <Label htmlFor="qr-data-url" className="text-muted-foreground">آدرس اینترنتی (URL)</Label>
                        <Input id="qr-data-url" dir="ltr" value={options.data?.startsWith('http') ? options.data : 'https://'} onChange={(e) => handleUpdate({ data: e.target.value })} placeholder="https://example.com"/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="qr-data-text" className="text-muted-foreground">یا متن دلخواه</Label>
                        <Textarea id="qr-data-text" value={options.data} onChange={(e) => handleUpdate({ data: e.target.value })} placeholder="متن یا اطلاعات خود را وارد کنید..."/>
                    </div>
                </TabsContent>

                {/* Design Tab */}
                <TabsContent value="design" className="space-y-2 pt-4">
                    <Accordion type="single" collapsible className="w-full" defaultValue='item-1'>
                        <AccordionItem value="item-1">
                            <AccordionTrigger>رنگ&zwnj;ها</AccordionTrigger>
                            <AccordionContent className='space-y-4'>
                                <ColorPicker label="رنگ نقاط QR" value={options.dotsOptions?.color || '#000000'} onChange={color => handleUpdate({ dotsOptions: { ...options.dotsOptions, color }})} />
                                <ColorPicker label="رنگ گوشه&zwnj;ها" value={options.cornersSquareOptions?.color || '#000000'} onChange={color => handleUpdate({ cornersSquareOptions: { ...options.cornersSquareOptions, color }})} />
                                <ColorPicker label="رنگ پس&zwnj;زمینه" value={options.backgroundOptions?.color || '#FFFFFF'} onChange={color => handleUpdate({ backgroundOptions: { ...options.backgroundOptions, color }})} />
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>شکل&zwnj;ها</AccordionTrigger>
                            <AccordionContent className='space-y-4'>
                                 <div className='space-y-2'>
                                    <Label>شکل نقاط</Label>
                                    <Select value={options.dotsOptions?.type} onValueChange={(type: DotType) => handleUpdate({ dotsOptions: { ...options.dotsOptions, type }})}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>{dotTypes.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}</SelectContent>
                                    </Select>
                                 </div>
                                  <div className='space-y-2'>
                                    <Label>شکل گوشه‌ها</Label>
                                    <Select value={options.cornersSquareOptions?.type} onValueChange={(type: CornerSquareType) => handleUpdate({ cornersSquareOptions: { ...options.cornersSquareOptions, type }})}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>{cornerTypes.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                                    </Select>
                                 </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>لوگو</AccordionTrigger>
                            <AccordionContent className='space-y-4'>
                                 <div className="space-y-2">
                                    <Label>آپلود لوگو</Label>
                                    <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                                        <Upload className="w-4 h-4 ml-2"/> انتخاب فایل
                                    </Button>
                                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/png, image/jpeg, image/svg+xml" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="logo-url">یا آدرس URL لوگو</Label>
                                    <Input id="logo-url" value={options.image} onChange={(e) => handleUpdate({ image: e.target.value })} placeholder="http://.../logo.png" dir="ltr"/>
                                    <p className='text-xs text-muted-foreground'>برای حذف لوگو، آدرس را پاک کنید و فایل انتخاب نکنید.</p>
                                </div>
                                <div className='space-y-2'>
                                    <div className="flex items-center justify-between">
                                        <Label>اندازه لوگو</Label>
                                        <span className="font-mono text-primary text-sm">{options.imageOptions?.imageSize}</span>
                                    </div>
                                    <Slider value={[options.imageOptions?.imageSize || 0.4]} onValueChange={(v) => handleUpdate({ imageOptions: {...options.imageOptions, imageSize: v[0] }})} min={0.1} max={0.7} step={0.05} />
                                </div>
                                <div className='space-y-2'>
                                    <div className="flex items-center justify-between">
                                        <Label>حاشیه لوگو</Label>
                                        <span className="font-mono text-primary text-sm">{options.imageOptions?.margin}</span>
                                    </div>
                                    <Slider value={[options.imageOptions?.margin || 0]} onValueChange={(v) => handleUpdate({ imageOptions: {...options.imageOptions, margin: v[0] }})} min={0} max={20} step={1} />
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </TabsContent>
            </Tabs>
        </div>

        {/* === Right Side: Preview === */}
        <div className="space-y-4 md:col-span-1 flex flex-col items-center">
            <div className="p-4 rounded-lg shadow-md border bg-white">
                <div ref={ref} />
            </div>
            <p className="text-sm text-muted-foreground">پیش‌نمایش زنده</p>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 w-full">
                <Button onClick={() => onDownloadClick('png')} className="h-12 text-base col-span-1 lg:col-span-1"><Download className="w-5 h-5 ml-2"/> PNG</Button>
                <Button onClick={() => onDownloadClick('svg')} variant="secondary" className="h-12 text-base"><Download className="w-5 h-5 ml-2"/> SVG</Button>
                <Button onClick={() => onDownloadClick('webp')} variant="secondary" className="h-12 text-base"><Download className="w-5 h-5 ml-2"/> WebP</Button>
            </div>
        </div>
    </CardContent>
  );
}
