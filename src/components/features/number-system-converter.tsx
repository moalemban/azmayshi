"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Binary, Clipboard } from 'lucide-react';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';

export default function NumberSystemConverter() {
  const [inputValue, setInputValue] = useState('');
  const { toast } = useToast();
  
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

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({
      title: 'کپی شد!',
      description: `مقدار "${text}" در کلیپ‌بورد کپی شد.`,
    });
  };

  return (
    <CardContent className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor="number-input" className="text-muted-foreground">عدد را وارد کنید (فارسی یا انگلیسی)</Label>
        <Input 
          id="number-input" 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          placeholder="123۴۵۶"
          className="h-12 text-lg text-center"
          dir="ltr"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
          <div className="relative p-4 bg-muted/50 rounded-lg shadow-inner">
              <Button variant="ghost" size="icon" className="absolute top-2 left-2 text-muted-foreground" onClick={() => copyToClipboard(persianOutput)} disabled={!persianOutput}>
                  <Clipboard className="w-5 h-5"/>
              </Button>
              <p className="text-sm text-muted-foreground">ارقام فارسی</p>
              <p className="text-2xl font-bold text-primary mt-1 font-mono" dir="rtl">{persianOutput || '۰'}</p>
          </div>
          <div className="relative p-4 bg-muted/50 rounded-lg shadow-inner">
               <Button variant="ghost" size="icon" className="absolute top-2 left-2 text-muted-foreground" onClick={() => copyToClipboard(englishOutput)} disabled={!englishOutput}>
                  <Clipboard className="w-5 h-5"/>
              </Button>
              <p className="text-sm text-muted-foreground">ارقام انگلیسی</p>
              <p className="text-2xl font-bold text-foreground mt-1 font-mono" dir="ltr">{englishOutput || '0'}</p>
          </div>
      </div>
    </CardContent>
  );
}
