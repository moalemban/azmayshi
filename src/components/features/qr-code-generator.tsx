"use client";

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { QrCode, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';

export default function QrCodeGenerator() {
  const [inputValue, setInputValue] = useState('https://tabdila.com');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const { theme } = useTheme();
  
  const defaultDarkColor = theme === 'dark' ? '#FFFFFF' : '#010816';
  const defaultLightColor = theme === 'dark' ? '#010816' : '#FFFFFF';

  const [darkColor, setDarkColor] = useState(defaultDarkColor);
  const [lightColor, setLightColor] = useState(defaultLightColor);

  const { toast } = useToast();

  useEffect(() => {
    setDarkColor(theme === 'dark' ? '#FFFFFF' : '#010816');
    setLightColor(theme === 'dark' ? '#010816' : '#FFFFFF');
  }, [theme]);

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
    <Card className="h-full group/card transition-all duration-300 hover:border-primary/50">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 -z-10"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-6 w-6 text-primary" />
          تولید کننده بارکد
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2 space-y-4">
          <div className='space-y-2'>
            <Label htmlFor="qr-input">متن یا لینک مورد نظر را وارد کنید:</Label>
            <Input
              id="qr-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="مثلا: https://tabdila.com"
              className="h-12 text-lg"
              dir="ltr"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                  <Label htmlFor="dark-color">رنگ QR</Label>
                  <Input id="dark-color" type="color" value={darkColor} onChange={e => setDarkColor(e.target.value)} className="h-12 p-1"/>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="light-color">رنگ پس‌زمینه</Label>
                  <Input id="light-color" type="color" value={lightColor} onChange={e => setLightColor(e.target.value)} className="h-12 p-1"/>
              </div>
          </div>
           <Button onClick={handleDownload} disabled={!qrCodeDataUrl} className="w-full h-12 text-base">
            <Download className="ml-2 h-5 w-5" />
            دانلود QR Code
          </Button>
        </div>
        
        <div className="flex items-center justify-center">
            <div className="p-2 rounded-lg shadow-md w-48 h-48 md:w-56 md:h-56 flex items-center justify-center" style={{ backgroundColor: lightColor }}>
            {qrCodeDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrCodeDataUrl} alt="Generated QR Code" className="w-full h-full object-contain rounded-sm" />
            ) : (
                <div className="text-center text-muted-foreground text-sm p-4 bg-background rounded-md">
                    <p>متن خود را برای تولید کد وارد کنید.</p>
                </div>
            )}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
