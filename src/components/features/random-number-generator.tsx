"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dices, RefreshCw, Clipboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';

export default function RandomNumberGenerator() {
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [count, setCount] = useState('1');
  const [unique, setUnique] = useState(true);
  const [results, setResults] = useState<number[]>([]);
  const { toast } = useToast();

  const generateNumbers = () => {
    const minValue = parseInt(min, 10);
    const maxValue = parseInt(max, 10);
    const numCount = parseInt(count, 10);

    if (isNaN(minValue) || isNaN(maxValue) || isNaN(numCount)) {
      toast({ title: 'خطا', description: 'لطفا مقادیر معتبر عددی وارد کنید.', variant: 'destructive' });
      setResults([]);
      return;
    }

    if (minValue > maxValue) {
      toast({ title: 'خطا', description: 'مقدار حداقل نمی‌تواند بزرگتر از حداکثر باشد.', variant: 'destructive' });
      setResults([]);
      return;
    }
    
    if (numCount <= 0) {
      toast({ title: 'خطا', description: 'تعداد باید حداقل ۱ باشد.', variant: 'destructive' });
      setResults([]);
      return;
    }
    
    if (unique) {
      const rangeSize = maxValue - minValue + 1;
      if (numCount > rangeSize) {
        toast({ title: 'خطا', description: `امکان تولید ${numCount} عدد منحصر به فرد در بازه ${minValue} تا ${maxValue} وجود ندارد.`, variant: 'destructive' });
        setResults([]);
        return;
      }

      const uniqueNumbers = new Set<number>();
      while (uniqueNumbers.size < numCount) {
        const randomNumber = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        uniqueNumbers.add(randomNumber);
      }
      setResults(Array.from(uniqueNumbers));

    } else {
      const newResults: number[] = [];
      for (let i = 0; i < numCount; i++) {
        const randomNumber = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        newResults.push(randomNumber);
      }
      setResults(newResults);
    }
  };
  
  const copyResults = () => {
    if (results.length === 0) return;
    const resultsString = results.join(', ');
    navigator.clipboard.writeText(resultsString);
    toast({
        title: 'کپی شد!',
        description: 'اعداد تولید شده با موفقیت کپی شدند.'
    });
  }

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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-center">
          <div className="space-y-2">
            <Label htmlFor="min-val">حداقل</Label>
            <Input id="min-val" type="number" value={min} onChange={(e) => setMin(e.target.value)} className="h-12 text-lg text-center" placeholder="مثلا: 1"/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-val">حداکثر</Label>
            <Input id="max-val" type="number" value={max} onChange={(e) => setMax(e.target.value)} className="h-12 text-lg text-center" placeholder="مثلا: 100"/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="count">تعداد</Label>
            <Input id="count" type="number" value={count} onChange={(e) => setCount(e.target.value)} className="h-12 text-lg text-center" placeholder="مثلا: 5"/>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox id="unique-numbers" checked={unique} onCheckedChange={(checked) => setUnique(Boolean(checked))} />
            <Label htmlFor="unique-numbers" className="cursor-pointer">
                اعداد منحصر به فرد باشند (بدون تکرار)
            </Label>
        </div>


        <Button onClick={generateNumbers} size="lg">
            <RefreshCw className="ml-2 h-5 w-5"/>
            تولید عدد جدید
        </Button>
        
        <div className="relative">
            <div className="absolute top-2 left-2">
                <Button variant="ghost" size="icon" onClick={copyResults} disabled={results.length === 0} title="کپی کردن اعداد">
                    <Clipboard className="h-5 w-5" />
                </Button>
            </div>
            <ScrollArea className="h-32 bg-background/40 rounded-lg shadow-inner">
                {results.length > 0 ? (
                    <div className="p-4 flex flex-wrap gap-x-4 gap-y-2 justify-center font-mono text-lg text-primary tracking-wider">
                    {results.map((num, index) => (
                        <span key={index}>{num.toLocaleString('fa-IR')}</span>
                    ))}
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        <p>برای تولید اعداد، دکمه را فشار دهید.</p>
                    </div>
                )}
            </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
