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
    <Card className="glass-effect h-full card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-white">
          <SpellCheck className="h-6 w-6 text-amber-400" />
          تبدیل عدد به حروف
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="space-y-2">
          <Label htmlFor="number-to-words-input" className="text-white/80">عدد را وارد کنید</Label>
          <Input 
            id="number-to-words-input" 
            type="number"
            value={number} 
            onChange={(e) => setNumber(e.target.value)} 
            placeholder="مثلا: 1375"
            className="h-12 text-lg text-center bg-black/20 text-white border-white/20"
          />
        </div>
        
        <div className="p-4 bg-black/20 rounded-lg shadow-inner text-center min-h-[80px] flex items-center justify-center">
             <p className="text-lg font-medium text-primary">{words}</p>
        </div>
      </CardContent>
    </Card>
  );
}
