"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Percent } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function PercentageCalculator() {
  const [val1, setVal1] = useState<string>('');
  const [val2, setVal2] = useState<string>('');

  const num1 = parseFloat(val1);
  const num2 = parseFloat(val2);
  const hasValues = val1.trim() !== '' && val2.trim() !== '';

  const result1 = useMemo(() => {
    if (isNaN(num1) || isNaN(num2)) return '...';
    const res = (num1 / 100) * num2;
    return res.toLocaleString('fa-IR');
  }, [num1, num2]);

  const result2 = useMemo(() => {
    if (isNaN(num1) || isNaN(num2) || num2 === 0) return '...';
    const res = (num1 / num2) * 100;
    return res.toLocaleString('fa-IR', { maximumFractionDigits: 2 });
  }, [num1, num2]);

  return (
    <Card className="h-full group/card transition-all duration-300 hover:border-primary/50">
       <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 -z-10"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Percent className="h-6 w-6 text-primary" />
          محاسبه درصد
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex gap-4 items-end">
          <div className="space-y-2 flex-1">
            <Label htmlFor="val1">مقدار اول</Label>
            <Input id="val1" type="number" value={val1} onChange={(e) => setVal1(e.target.value)} className="h-12 text-lg text-center" placeholder="مثلا: 20"/>
          </div>
          <div className="space-y-2 flex-1">
            <Label htmlFor="val2">مقدار دوم</Label>
            <Input id="val2" type="number" value={val2} onChange={(e) => setVal2(e.target.value)} className="h-12 text-lg text-center" placeholder="مثلا: 150"/>
          </div>
        </div>

        <Separator className="my-2" />

        { hasValues ? (
            <div className="space-y-3">
                <div className="p-3 bg-background/40 rounded-lg shadow-inner text-center">
                     <p className='text-sm text-muted-foreground'>
                         <span className="font-mono text-primary">{val1 || '۰'}</span> درصد از <span className="font-mono text-primary">{val2 || '۰'}</span> برابر است با:
                     </p>
                     <p className="text-2xl font-bold text-foreground mt-1">{result1}</p>
                </div>
                 <div className="p-3 bg-background/40 rounded-lg shadow-inner text-center">
                     <p className='text-sm text-muted-foreground'>
                        <span className="font-mono text-primary">{val1 || '۰'}</span> چند درصد از <span className="font-mono text-primary">{val2 || '۰'}</span> است؟
                     </p>
                     <p className="text-2xl font-bold text-foreground mt-1">
                        {result2}
                        <span className="text-lg font-normal">%</span>
                     </p>
                </div>
            </div>
        ) : (
             <div className="flex items-center justify-center text-muted-foreground h-36 bg-background/30 rounded-lg">
                <p>مقادیر را برای محاسبه وارد کنید.</p>
            </div>
        )}

      </CardContent>
    </Card>
  );
}
