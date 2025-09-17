"use client";

import { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import { useToast } from '@/hooks/use-toast';
import { CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Camera, ScanLine, CheckCircle, XCircle, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function QrCodeReader() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const startScan = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsScanning(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'دسترسی به دوربین ممکن نیست',
        description: 'لطفا در تنظیمات مرورگر خود، دسترسی به دوربین را فعال کنید.',
      });
    }
  };
  
  useEffect(() => {
    let animationFrameId: number;

    const tick = () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        
        if(context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: 'dontInvert',
            });

            if (code) {
                setScanResult(code.data);
                setIsScanning(false);
                 if (videoRef.current && videoRef.current.srcObject) {
                    const stream = videoRef.current.srcObject as MediaStream;
                    stream.getTracks().forEach(track => track.stop());
                    videoRef.current.srcObject = null;
                 }
            }
        }
      }
      if (isScanning) {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    if (isScanning) {
      animationFrameId = requestAnimationFrame(tick);
    }
    
    return () => {
      cancelAnimationFrame(animationFrameId);
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    };
  }, [isScanning]);
  
  const copyToClipboard = () => {
    if (!scanResult) return;
    navigator.clipboard.writeText(scanResult);
    toast({
        title: 'کپی شد!',
        description: 'محتوای QR Code با موفقیت کپی شد.',
    });
  }

  return (
    <CardContent className="space-y-4">
      <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
        <video ref={videoRef} className={`w-full h-full object-cover ${!isScanning && 'hidden'}`} autoPlay muted playsInline />
        <canvas ref={canvasRef} className="hidden" />

        {!isScanning && (
            <div className="flex flex-col items-center gap-4">
                 <ScanLine className="w-24 h-24 text-muted-foreground" />
                 <Button onClick={startScan} size="lg" className="h-12 text-lg">
                    <Camera className="ml-2 h-6 w-6" />
                    شروع اسکن
                 </Button>
            </div>
        )}
      </div>

      {hasCameraPermission === false && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>دسترسی به دوربین لازم است</AlertTitle>
          <AlertDescription>
            برای استفاده از این ابزار، لطفاً دسترسی به دوربین را در تنظیمات مرورگر خود فعال کنید.
          </AlertDescription>
        </Alert>
      )}

      {scanResult && (
        <div className="w-full text-center bg-green-500/10 dark:bg-green-500/20 p-4 rounded-lg shadow-inner relative border-2 border-green-500/50">
            <div className="absolute top-2 left-2">
                <Button variant="ghost" size="icon" onClick={copyToClipboard} title="کپی کردن">
                    <Copy className="w-5 h-5 text-green-600 dark:text-green-400"/>
                </Button>
            </div>
          <p className="text-sm text-green-600 dark:text-green-300 flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5" />
            QR Code با موفقیت خوانده شد
          </p>
          <p className="text-lg font-medium text-foreground mt-2 break-all" dir="ltr">{scanResult}</p>
        </div>
      )}
    </CardContent>
  );
}
