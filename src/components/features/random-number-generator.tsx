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

const toPersianDigits = (str: string): string => {
    if (str === null || str === undefined || str === '') return '';
    return String(str).replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);
};

const toEnglishDigits = (str: string): string => {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
};


export default function RandomNumberGenerator() {
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [count, setCount] = useState('');
  const [unique, setUnique] = useState(true);
  const [results, setResults] = useState<number[]>([]);
  const [isInitial, setIsInitial] = useState(true);
  const { toast } = useToast();

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(toEnglishDigits(value));
    setIsInitial(false);
  };

  const generateNumbers = () => {
    setIsInitial(false);
    const minValue = parseInt(min, 10) || 1;
    const maxValue = parseInt(max, 10) || 100;
    const numCount = parseInt(count, 10) || 1;

    if (isNaN(minValue) || isNaN(maxValue) || isNaN(numCount)) {
      toast({ title: 'خطا', description: 'لطفا مقادیر معتبر عددی وارد کنید.', variant: 'destructive' });
      return;
    }
    if (minValue > maxValue) {
      toast({ title: 'خطا', description: 'مقدار حداقل نمی‌تواند بزرگتر از حداکثر باشد.', variant: 'destructive' });
      return;
    }
    if (numCount <= 0) {
      toast({ title: 'خطا', description: 'تعداد باید حداقل ۱ باشد.', variant: 'destructive' });
      return;
    }
    
    if (unique) {
      const rangeSize = maxValue - minValue + 1;
      if (numCount > rangeSize) {
        toast({ title: 'خطا', description: `امکان تولید ${toPersianDigits(String(numCount))} عدد منحصر به فرد در بازه ${toPersianDigits(String(minValue))} تا ${toPersianDigits(String(maxValue))} وجود ندارد.`, variant: 'destructive' });
        return;
      }
      const numbers = new Set<number>();
      while (numbers.size < numCount) {
        const randomBuffer = new Uint32Array(1);
        window.crypto.getRandomValues(randomBuffer);
        const randomNumber = minValue + (randomBuffer[0] % (maxValue - minValue + 1));
        numbers.add(randomNumber);
      }
      setResults(Array.from(numbers));

    } else {
      const newResults: number[] = [];
      const randomBuffer = new Uint32Array(numCount);
      window.crypto.getRandomValues(randomBuffer);
      for (let i = 0; i < numCount; i++) {
        const randomNumber = minValue + (randomBuffer[i] % (maxValue - minValue + 1));
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
    <CardContent className="flex flex-col gap-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-center">
        <div className="space-y-2">
          <Label htmlFor="min-val" className="text-muted-foreground">حداقل</Label>
          <Input id="min-val" type="text" value={toPersianDigits(min)} onChange={(e) => handleInputChange(setMin, e.target.value)} className="h-12 text-lg text-center font-display" placeholder="۱"/>
        </div>
        <div className="space-y-2">
          <Label htmlFor="max-val" className="text-muted-foreground">حداکثر</Label>
          <Input id="max-val" type="text" value={toPersianDigits(max)} onChange={(e) => handleInputChange(setMax, e.target.value)} className="h-12 text-lg text-center font-display" placeholder="۱۰۰"/>
        </div>
        <div className="space-y-2">
          <Label htmlFor="count" className="text-muted-foreground">تعداد</Label>
          <Input id="count" type="text" value={toPersianDigits(count)} onChange={(e) => handleInputChange(setCount, e.target.value)} className="h-12 text-lg text-center font-display" placeholder="۱"/>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 space-x-reverse">
          <Checkbox id="unique-numbers" checked={unique} onCheckedChange={(checked) => { setUnique(Boolean(checked)); setIsInitial(false); }} />
          <Label htmlFor="unique-numbers" className="cursor-pointer text-muted-foreground">
              اعداد منحصر به فرد باشند
          </Label>
      </div>


      <Button onClick={generateNumbers} size="lg">
          <RefreshCw className="ml-2 h-5 w-5"/>
          تولید عدد جدید
      </Button>
      
      <div className="relative">
          <div className="absolute top-2 left-2 z-10">
              <Button variant="ghost" size="icon" onClick={copyResults} disabled={results.length === 0} title="کپی کردن اعداد" className="text-muted-foreground hover:text-foreground">
                  <Clipboard className="h-5 w-5" />
              </Button>
          </div>
          <ScrollArea className="h-32 bg-muted/50 rounded-lg shadow-inner">
              {results.length > 0 && !isInitial ? (
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
  );
}
