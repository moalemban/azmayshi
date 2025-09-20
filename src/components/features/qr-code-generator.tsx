"use client";

import { useState, useEffect, useRef } from 'react';
import QRCodeStyling, { type Options as QRCodeOptions, type FileExtension } from 'qr-code-styling';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Download, Text, Link, Wifi, Mail, Phone, Palette, Settings, Droplet, Checkbox as CheckboxIcon } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { cn } from '@/lib/utils';
import { Checkbox } from '../ui/checkbox';
import { Separator } from '../ui/separator';

type QRType = 'text' | 'url' | 'wifi' | 'email' | 'tel';

const qrTypes: { value: QRType; label: string; icon: React.ReactNode }[] = [
  { value: 'url', label: 'لینک', icon: <Link className="w-5 h-5" /> },
  { value: 'text', label: 'متن', icon: <Text className="w-5 h-5" /> },
  { value: 'wifi', label: 'WiFi', icon: <Wifi className="w-5 h-5" /> },
  { value: 'email', label: 'ایمیل', icon: <Mail className="w-5 h-5" /> },
  { value: 'tel', label: 'تلفن', icon: <Phone className="w-5 h-5" /> },
];

const wifiEncryptions = ['WPA', 'WEP', 'nopass'];

const dotTypes: QRCodeOptions['dotsOptions']['type'][] = ['rounded', 'dots', 'classy', 'classy-rounded', 'square', 'extra-rounded'];
const cornerSquareTypes: QRCodeOptions['cornersSquareOptions']['type'][] = ['square', 'extra-rounded', 'dot'];
const cornerDotTypes: QRCodeOptions['cornersDotOptions']['type'][] = ['dot', 'square'];

const dotTypeTranslations: { [key: string]: string } = {
  rounded: 'گرد',
  dots: 'نقطه‌ای',
  classy: 'کلاسیک',
  'classy-rounded': 'کلاسیک گرد',
  square: 'مربعی',
  'extra-rounded': 'بسیار گرد',
};

const cornerSquareTypeTranslations: { [key: string]: string } = {
  square: 'مربعی',
  'extra-rounded': 'بسیار گرد',
  dot: 'نقطه‌ای',
};


export default function QrCodeGenerator() {
  // Content States
  const [type, setType] = useState<QRType>('url');
  const [text, setText] = useState('https://tabdila.com');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [encryption, setEncryption] = useState('WPA');
  const [hidden, setHidden] = useState(false);
  
  // Style States
  const [size, setSize] = useState(300);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [dotType, setDotType] = useState<QRCodeOptions['dotsOptions']['type']>('rounded');
  const [cornerSquareType, setCornerSquareType] = useState<QRCodeOptions['cornersSquareOptions']['type']>('extra-rounded');
  const [cornerDotType, setCornerDotType] = useState<QRCodeOptions['cornersDotOptions']['type']>('dot');


  const qrContainerRef = useRef<HTMLDivElement>(null);
  const qrCodeInstance = useRef<QRCodeStyling>();

  const getQrData = (): string => {
    switch (type) {
      case 'url': return text.startsWith('http') ? text : `https://${text}`;
      case 'text': return text;
      case 'email': return `mailto:${email}`;
      case 'tel': return `tel:${phone}`;
      case 'wifi': return `WIFI:T:${encryption};S:${ssid};P:${password};${hidden ? 'H:true;' : ''};`;
      default: return text;
    }
  };
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!qrContainerRef.current) return;

    qrCodeInstance.current = new QRCodeStyling({
        width: size,
        height: size,
        type: 'svg',
        data: getQrData(),
        dotsOptions: { color: fgColor, type: dotType },
        backgroundOptions: { color: bgColor },
        cornersSquareOptions: { type: cornerSquareType },
        cornersDotOptions: { type: cornerDotType },
    });
    
    qrContainerRef.current.innerHTML = '';
    qrCodeInstance.current.append(qrContainerRef.current);
  }, []);

  useEffect(() => {
    qrCodeInstance.current?.update({
        width: size,
        height: size,
        data: getQrData(),
        dotsOptions: { color: fgColor, type: dotType },
        backgroundOptions: { color: bgColor },
        cornersSquareOptions: { type: cornerSquareType },
        cornersDotOptions: { type: cornerDotType },
    });
  }, [type, text, email, phone, ssid, password, encryption, hidden, size, fgColor, bgColor, dotType, cornerSquareType, cornerDotType]);
  
  const handleDownload = (extension: FileExtension) => {
    qrCodeInstance.current?.download({ name: 'qrcode', extension });
  };
  
  const renderInputs = () => {
    switch (type) {
      case 'url':
        return <Input dir="ltr" placeholder="https://example.com" value={text} onChange={(e) => setText(e.target.value)} className="h-12"/>;
      case 'text':
        return <Textarea placeholder="متن خود را وارد کنید" value={text} onChange={(e) => setText(e.target.value)} className="min-h-[120px]" />;
      case 'email':
        return <Input dir="ltr" type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12"/>;
      case 'tel':
        return <Input dir="ltr" type="tel" placeholder="+989123456789" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-12"/>;
      case 'wifi':
        return (
          <div className="space-y-4">
            <Input placeholder="SSID (نام شبکه)" value={ssid} onChange={(e) => setSsid(e.target.value)} className="h-12"/>
            <Input type="password" placeholder="رمز عبور" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12"/>
            <Select value={encryption} onValueChange={setEncryption}>
              <SelectTrigger className="h-12"><SelectValue placeholder="نوع رمزنگاری" /></SelectTrigger>
              <SelectContent>
                {wifiEncryptions.map(enc => <SelectItem key={enc} value={enc}>{enc}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox id="hidden-wifi" checked={hidden} onCheckedChange={(checked) => setHidden(Boolean(checked))} />
              <Label htmlFor="hidden-wifi" className="text-muted-foreground cursor-pointer">شبکه مخفی است</Label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      <div className="md:col-span-2 space-y-6">
        
        {/* Content Section */}
        <div className="space-y-4">
            <div>
                <Label className="text-muted-foreground">نوع محتوا</Label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
                    {qrTypes.map(({ value, label, icon }) => (
                    <Button 
                        key={value} 
                        variant={type === value ? "default" : "outline"} 
                        onClick={() => setType(value)}
                        className="flex flex-col h-16 sm:h-20 gap-1 text-xs"
                    >
                        {icon}
                        {label}
                    </Button>
                    ))}
                </div>
            </div>
            <div>
                <Label className="text-muted-foreground">داده‌ها</Label>
                <div className="mt-2">{renderInputs()}</div>
            </div>
        </div>

        <Separator />

        {/* Design Section */}
         <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                     <Label className="text-muted-foreground">اندازه</Label>
                     <span className="text-sm font-mono text-primary">{size}px</span>
                </div>
                <Slider value={[size]} onValueChange={(v) => setSize(v[0])} min={128} max={1024} step={16} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-muted-foreground">رنگ QR</Label>
                    <Input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="h-12 p-1" />
                </div>
                <div className="space-y-2">
                    <Label className="text-muted-foreground">رنگ پس‌زمینه</Label>
                    <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-12 p-1" />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>شکل نقاط</Label>
                    <Select value={dotType} onValueChange={(v) => setDotType(v as any)}>
                        <SelectTrigger className="h-12"><SelectValue/></SelectTrigger>
                        <SelectContent>{dotTypes.map(t => <SelectItem key={t} value={t}>{dotTypeTranslations[t] || t}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>شکل گوشه‌ها</Label>
                    <Select value={cornerSquareType} onValueChange={(v) => setCornerSquareType(v as any)}>
                        <SelectTrigger className="h-12"><SelectValue/></SelectValue></SelectTrigger>
                        <SelectContent>{cornerSquareTypes.map(t => <SelectItem key={t} value={t}>{cornerSquareTypeTranslations[t] || t}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
            </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-4">
            <Button onClick={() => handleDownload('png')} className="h-12 text-base">
                <Download className="w-5 h-5 ml-2"/> دانلود PNG
            </Button>
            <Button onClick={() => handleDownload('svg')} variant="outline" className="h-12 text-base">
                <Download className="w-5 h-5 ml-2"/> دانلود SVG
            </Button>
            <Button onClick={() => setBgColor('#ffffff00')} variant="outline" className="h-12 text-base col-span-1 sm:col-span-2 lg:col-span-1">
                <Droplet className="w-5 h-5 ml-2"/> پس‌زمینه شفاف
            </Button>
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-start gap-4">
          <div 
            className="p-4 rounded-lg shadow-md border" 
            style={{ backgroundColor: bgColor }}
          >
              <div ref={qrContainerRef} />
          </div>
          <p className='text-sm text-muted-foreground'>پیش‌نمایش زنده</p>
      </div>
    </CardContent>
  );
}
