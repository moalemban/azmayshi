"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SpellCheck } from 'lucide-react';
import { Label } from '../ui/label';
import { numToWords } from '@/lib/utils';


export default function NumberToWordsConverter() {
  const [number, setNumber] = useState('');

  const words = useMemo(() => {
    if (number.trim() === '') return 'لطفا یک عدد وارد کنید.';
    return numToWords(number);
  }, [number]);

  return (
    <Card className="h-full group/card transition-all duration-300 hover:border-primary/50">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 -z-10"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SpellCheck className="h-6 w-6 text-primary" />
          تبدیل عدد به حروف
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="space-y-2">
          <Label htmlFor="number-to-words-input">عدد را وارد کنید</Label>
          <Input 
            id="number-to-words-input" 
            type="number"
            value={number} 
            onChange={(e) => setNumber(e.target.value)} 
            placeholder="مثلا: 1375"
            className="h-12 text-lg text-center"
          />
        </div>
        
        <div className="p-4 bg-background/40 rounded-lg shadow-inner text-center min-h-[80px] flex items-center justify-center">
             <p className="text-lg font-medium text-primary">{words}</p>
        </div>
      </CardContent>
    </Card>
  );
}
