"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dices, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function RandomNumberGenerator() {
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [result, setResult] = useState<number | null>(null);
  const { toast } = useToast();

  const generateNumber = () => {
    const minValue = parseInt(min, 10);
    const maxValue = parseInt(max, 10);

    if (isNaN(minValue) || isNaN(maxValue)) {
      toast({ title: 'خطا', description: 'لطفا مقادیر معتبر عددی وارد کنید.', variant: 'destructive' });
      setResult(null);
      return;
    }

    if (minValue > maxValue) {
      toast({ title: 'خطا', description: 'مقدار حداقل نمی‌تواند بزرگتر از حداکثر باشد.', variant: 'destructive' });
      setResult(null);
      return;
    }

    const randomNumber = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    setResult(randomNumber);
  };
  
  const formatNumber = (num: number | null) => {
    if (num === null) return '-';
    return num.toLocaleString('fa-IR');
  };

  return (
    <Card className="h-full group/card transition-all duration-300 hover:border-primary/50">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 -z-10"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dices className="h-6 w-6 text-primary" />
          تولید عدد تصادفی
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <div className="space-y-2 flex-1">
            <Label htmlFor="min-val">حداقل</Label>
            <Input id="min-val" type="number" value={min} onChange={(e) => setMin(e.target.value)} className="h-12 text-lg text-center" placeholder="مثلا: 1"/>
          </div>
          <div className="space-y-2 flex-1">
            <Label htmlFor="max-val">حداکثر</Label>
            <Input id="max-val" type="number" value={max} onChange={(e) => setMax(e.target.value)} className="h-12 text-lg text-center" placeholder="مثلا: 100"/>
          </div>
        </div>

        <Button onClick={generateNumber} size="lg">
            <RefreshCw className="ml-2 h-5 w-5"/>
            تولید عدد جدید
        </Button>
        
        <div className="p-4 bg-background/40 rounded-lg shadow-inner text-center min-h-[80px] flex flex-col items-center justify-center">
             <p className='text-sm text-muted-foreground'>عدد تصادفی شما</p>
             <p className="text-4xl font-bold text-primary font-mono tracking-wider mt-2">{formatNumber(result)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
