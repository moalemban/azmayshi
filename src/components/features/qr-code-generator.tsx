"use client";

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { QrCode as QrCodeIcon, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function QrCodeGenerator() {
  const [inputValue, setInputValue] = useState('https://tabdila.com');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  
  const [darkColor, setDarkColor] = useState('#000000');
  const [lightColor, setLightColor] = useState('#ffffff');

  const { toast } = useToast();

  useEffect(() => {
    if (inputValue.trim() === '') {
      setQrCodeDataUrl('');
      return;
    }

    QRCode.toDataURL(inputValue, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.9,
      margin: 1,
      color: {
        dark: darkColor,
        light: lightColor,
      },
    })
      .then(url => {
        setQrCodeDataUrl(url);
      })
      .catch(err => {
        console.error(err);
        toast({
            title: 'خطا در تولید QR Code',
            description: 'متاسفانه مشکلی در تولید QR Code به وجود آمد.',
            variant: 'destructive'
        });
      });
  }, [inputValue, darkColor, lightColor, toast]);

  const handleDownload = () => {
    if (!qrCodeDataUrl) return;
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = qrCodeDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
      toast({
        title: 'دانلود شد!',
        description: 'فایل QR Code با موفقیت دانلود شد.',
    });
  };

  return (
    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
      <div className="md:col-span-2 space-y-4">
        <div className='space-y-2'>
          <Label htmlFor="qr-input" className="text-muted-foreground">متن یا لینک مورد نظر:</Label>
          <Input
            id="qr-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="https://tabdila.com"
            className="h-12 text-lg"
            dir="ltr"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="dark-color" className="text-muted-foreground">رنگ QR</Label>
                <Input id="dark-color" type="color" value={darkColor} onChange={e => setDarkColor(e.target.value)} className="h-12 p-1"/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="light-color" className="text-muted-foreground">رنگ پس‌زمینه</Label>
                <Input id="light-color" type="color" value={lightColor} onChange={e => setLightColor(e.target.value)} className="h-12 p-1"/>
            </div>
        </div>
          <Button onClick={handleDownload} disabled={!qrCodeDataUrl} className="w-full h-12 text-base">
          <Download className="ml-2 h-5 w-5" />
          دانلود QR Code
        </Button>
      </div>
      
      <div className="flex items-center justify-center">
          <div className="p-2 rounded-lg shadow-md w-48 h-48 md:w-56 md:h-56 flex items-center justify-center bg-card" style={{ backgroundColor: lightColor }}>
          {qrCodeDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrCodeDataUrl} alt="Generated QR Code" className="w-full h-full object-contain rounded-sm" />
          ) : (
              <div className="text-center text-muted-foreground text-sm p-4 bg-muted/50 rounded-md">
                  <p>متن خود را برای تولید کد وارد کنید.</p>
              </div>
          )}
          </div>
      </div>
    </CardContent>
  );
}
