"use client";

import { useRef, useEffect, useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eraser, Download } from 'lucide-react';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Input } from '../ui/input';

export default function SignatureGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(3);
  const [lineColor, setLineColor] = useState("#000000");

  const getCanvasContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext('2d');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = getCanvasContext();
    if (!ctx) return;
    
    // Set canvas dimensions based on container size for responsiveness
    const resizeCanvas = () => {
        const container = canvas.parentElement;
        if(container) {
            canvas.width = container.clientWidth;
            canvas.height = 300; // Fixed height
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        }
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => window.removeEventListener('resize', resizeCanvas);

  }, []);

  const getCoords = (e: MouseEvent | TouchEvent): { x: number, y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();

    if (e instanceof MouseEvent) {
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return null;
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const coords = getCoords(e.nativeEvent);
    if (!coords) return;
    
    const ctx = getCanvasContext();
    if (!ctx) return;
    
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const coords = getCoords(e.nativeEvent);
    if (!coords) return;

    const ctx = getCanvasContext();
    if (!ctx) return;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    const ctx = getCanvasContext();
    if (!ctx) return;
    ctx.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = getCanvasContext();
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const downloadSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'signature.png';
      link.click();
    }
  };

  return (
    <CardContent className="space-y-4">
      <div className="w-full border-2 border-dashed rounded-lg bg-muted/20">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="cursor-crosshair"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>ضخامت قلم</Label>
              <span className="font-mono text-sm">{lineWidth}px</span>
            </div>
            <Slider
                value={[lineWidth]}
                onValueChange={(val) => setLineWidth(val[0])}
                min={1} max={10} step={0.5}
            />
        </div>
        <div className="space-y-2">
            <Label>رنگ قلم</Label>
            <Input type="color" value={lineColor} onChange={(e) => setLineColor(e.target.value)} className="w-full h-12 p-1" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Button variant="outline" onClick={clearCanvas}>
          <Eraser className="ml-2 h-5 w-5" />
          پاک کردن
        </Button>
        <Button onClick={downloadSignature}>
          <Download className="ml-2 h-5 w-5" />
          دانلود امضا (PNG)
        </Button>
      </div>
    </CardContent>
  );
}