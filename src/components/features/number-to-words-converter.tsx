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
    <CardContent className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor="number-to-words-input" className="text-muted-foreground">عدد را وارد کنید</Label>
        <Input 
          id="number-to-words-input" 
          type="number"
          value={number} 
          onChange={(e) => setNumber(e.target.value)} 
          placeholder="مثلا: 1375"
          className="h-12 text-lg text-center"
        />
      </div>
      
      <div className="p-4 bg-muted/50 rounded-lg shadow-inner text-center min-h-[80px] flex items-center justify-center">
            <p className="text-lg font-medium text-primary">{words}</p>
      </div>
    </CardContent>
  );
}
