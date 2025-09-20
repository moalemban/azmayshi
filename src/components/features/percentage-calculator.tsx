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
    <CardContent className="flex flex-col gap-4">
      <div className="flex gap-4 items-end">
        <div className="space-y-2 flex-1">
          <Label htmlFor="val1" className="text-muted-foreground">مقدار اول</Label>
          <Input id="val1" type="number" value={val1} onChange={(e) => setVal1(e.target.value)} className="h-12 text-lg text-center font-display" placeholder="۲۰"/>
        </div>
        <div className="space-y-2 flex-1">
          <Label htmlFor="val2" className="text-muted-foreground">مقدار دوم</Label>
          <Input id="val2" type="number" value={val2} onChange={(e) => setVal2(e.target.value)} className="h-12 text-lg text-center font-display" placeholder="۱۵۰"/>
        </div>
      </div>

      <Separator className="my-2 bg-border/50" />

      { hasValues ? (
          <div className="space-y-3">
              <div className="p-3 bg-muted/50 rounded-lg shadow-inner text-center">
                    <p className='text-sm text-muted-foreground'>
                        <span className="font-display text-primary">{val1 ? parseFloat(val1).toLocaleString('fa-IR') : '۰'}</span> درصد از <span className="font-display text-primary">{val2 ? parseFloat(val2).toLocaleString('fa-IR') : '۰'}</span> برابر است با:
                    </p>
                    <p className="text-2xl font-bold text-foreground mt-1 font-display">{result1}</p>
              </div>
                <div className="p-3 bg-muted/50 rounded-lg shadow-inner text-center">
                    <p className='text-sm text-muted-foreground'>
                      <span className="font-display text-primary">{val1 ? parseFloat(val1).toLocaleString('fa-IR') : '۰'}</span> چند درصد از <span className="font-display text-primary">{val2 ? parseFloat(val2).toLocaleString('fa-IR') : '۰'}</span> است؟
                    </p>
                    <p className="text-2xl font-bold text-foreground mt-1 font-display">
                      {result2}
                      <span className="text-lg font-normal">%</span>
                    </p>
              </div>
          </div>
      ) : (
            <div className="flex items-center justify-center text-muted-foreground h-36 bg-muted/30 rounded-lg">
              <p>مقادیر را برای محاسبه وارد کنید.</p>
          </div>
      )}

    </CardContent>
  );
}
