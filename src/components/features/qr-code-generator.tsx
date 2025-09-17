"use client";

import { useState, useEffect, useRef } from 'react';
import QRCodeStyling, { type Options as QRCodeOptions, type FileExtension } from 'qr-code-styling';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Download, Text, Link, Wifi, Mail, Phone, Droplet } from 'lucide-react';
import { Textarea } from '../ui/textarea';

type QRType = 'text' | 'url' | 'wifi' | 'email' | 'tel';

const qrTypes = [
  { value: 'text', label: 'متن', icon: <Text className="w-4 h-4" /> },
  { value: 'url', label: 'لینک', icon: <Link className="w-4 h-4" /> },
  { value: 'wifi', label: 'WiFi', icon: <Wifi className="w-4 h-4" /> },
  { value: 'email', label: 'ایمیل', icon: <Mail className="w-4 h-4" /> },
  { value: 'tel', label: 'تلفن', icon: <Phone className="w-4 h-4" /> },
];

const wifiEncryptions = ['WPA', 'WEP', 'nopass'];

export default function QrCodeGenerator() {
  const [type, setType] = useState<QRType>('url');
  
  // Input values
  const [text, setText] = useState('https://tabdila.com');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [encryption, setEncryption] = useState('WPA');
  const [hidden, setHidden] = useState(false);
  
  // Style options
  const [size, setSize] = useState(300);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] =useState('#ffffff');

  const ref = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling>();

  const getQrData = (): string => {
    switch (type) {
      case 'url':
      case 'text':
        return text;
      case 'email':
        return `mailto:${email}`;
      case 'tel':
        return `tel:${phone}`;
      case 'wifi':
        return `WIFI:T:${encryption};S:${ssid};P:${password};${hidden ? 'H:true;' : ''};`;
      default:
        return text;
    }
  };
  
  useEffect(() => {
    qrCode.current = new QRCodeStyling({
        width: size,
        height: size,
        type: 'svg',
        data: getQrData(),
        image: '',
        dotsOptions: { color: fgColor, type: 'rounded' },
        backgroundOptions: { color: bgColor },
        imageOptions: { hideBackgroundDots: true, imageSize: 0.4, margin: 0 },
        cornersSquareOptions: { type: 'extra-rounded' },
        cornersDotOptions: { type: 'dot' },
    });
    if (ref.current) {
        ref.current.innerHTML = '';
        qrCode.current.append(ref.current);
    }
  }, []);

  useEffect(() => {
    qrCode.current?.update({
        width: size,
        height: size,
        data: getQrData(),
        dotsOptions: { color: fgColor },
        backgroundOptions: { color: bgColor },
    });
  }, [type, text, email, phone, ssid, password, encryption, hidden, size, fgColor, bgColor]);
  
  const handleDownload = (extension: FileExtension) => {
    qrCode.current?.download({ name: 'qrcode', extension });
  };
  
  const removeBackground = () => {
    setBgColor('#00000000'); // Set background to transparent
  };


  const renderInputs = () => {
    switch (type) {
      case 'url':
        return <Input dir="ltr" placeholder="https://example.com" value={text} onChange={(e) => setText(e.target.value)} />;
      case 'text':
        return <Textarea placeholder="متن خود را وارد کنید" value={text} onChange={(e) => setText(e.target.value)} className="min-h-[100px]" />;
      case 'email':
        return <Input dir="ltr" type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />;
      case 'tel':
        return <Input dir="ltr" type="tel" placeholder="+989123456789" value={phone} onChange={(e) => setPhone(e.target.value)} />;
      case 'wifi':
        return (
          <div className="space-y-4">
            <Input placeholder="SSID (نام شبکه)" value={ssid} onChange={(e) => setSsid(e.target.value)} />
            <Input type="password" placeholder="رمز عبور" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Select value={encryption} onValueChange={setEncryption}>
              <SelectTrigger><SelectValue placeholder="نوع رمزنگاری" /></SelectTrigger>
              <SelectContent>
                {wifiEncryptions.map(enc => <SelectItem key={enc} value={enc}>{enc}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      <div className="md:col-span-2 space-y-4">
        <div>
          <Label className="text-muted-foreground">نوع QR Code</Label>
          <Select value={type} onValueChange={(v) => setType(v as QRType)}>
            <SelectTrigger className="h-12 text-base">
                <div className="flex items-center gap-2">
                    {qrTypes.find(t => t.value === type)?.icon}
                    <SelectValue placeholder="نوع QR" />
                </div>
            </SelectTrigger>
            <SelectContent>
              {qrTypes.map(({ value, label, icon }) => (
                <SelectItem key={value} value={value}>
                    <div className="flex items-center gap-2">
                        {icon} {label}
                    </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="text-muted-foreground">محتوا</Label>
          {renderInputs()}
        </div>

        <div className="space-y-4 pt-4">
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-4">
            <Button onClick={() => handleDownload('png')} className="h-12 text-base">
                <Download className="w-5 h-5 ml-2"/> دانلود PNG
            </Button>
            <Button onClick={() => handleDownload('svg')} variant="outline" className="h-12 text-base">
                <Download className="w-5 h-5 ml-2"/> دانلود SVG
            </Button>
            <Button onClick={removeBackground} variant="outline" className="h-12 text-base col-span-1 sm:col-span-2 lg:col-span-1">
                <Droplet className="w-5 h-5 ml-2"/> حذف پس‌زمینه
            </Button>
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center gap-4">
          <div className="p-4 rounded-lg shadow-md bg-card border" style={{ backgroundColor: bgColor === '#00000000' ? 'transparent' : bgColor }}>
              <div ref={ref} />
          </div>
          <p className='text-sm text-muted-foreground'>پیش‌نمایش زنده</p>
      </div>
    </CardContent>
  );
}
