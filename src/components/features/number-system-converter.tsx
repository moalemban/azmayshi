"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Binary } from 'lucide-react';
import { Label } from '../ui/label';

export default function NumberSystemConverter() {
  const [inputValue, setInputValue] = useState('');
  
  const toPersian = (str: string) => {
    const persian = { '0': '۰', '1': '۱', '2': '۲', '3': '۳', '4': '۴', '5': '۵', '6': '۶', '7': '۷', '8': '۸', '9': '۹' };
    return str.split('').map(char => persian[char as keyof typeof persian] || char).join('');
  };
  
  const toEnglish = (str: string) => {
    const english = { '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4', '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9' };
    return str.split('').map(char => english[char as keyof typeof english] || char).join('');
  };

  const persianOutput = useMemo(() => toPersian(toEnglish(inputValue)), [inputValue]);
  const englishOutput = useMemo(() => toEnglish(inputValue), [inputValue]);

  return (
    <Card className="glass-effect h-full card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-white">
          <Binary className="h-6 w-6 text-sky-400" />
          تبدیل ارقام
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="space-y-2">
          <Label htmlFor="number-input" className="text-white/80">عدد را وارد کنید (فارسی یا انگلیسی)</Label>
          <Input 
            id="number-input" 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
            placeholder="مثلا: 123۴۵۶"
            className="h-12 text-lg text-center bg-black/20 text-white border-white/20"
            dir="ltr"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-black/20 rounded-lg shadow-inner">
                <p className="text-sm text-white/70">ارقام فارسی</p>
                <p className="text-2xl font-bold text-primary mt-1 font-mono" dir="rtl">{persianOutput || '۰'}</p>
            </div>
            <div className="p-4 bg-black/20 rounded-lg shadow-inner">
                <p className="text-sm text-white/70">ارقام انگلیسی</p>
                <p className="text-2xl font-bold text-white mt-1 font-mono" dir="ltr">{englishOutput || '0'}</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
