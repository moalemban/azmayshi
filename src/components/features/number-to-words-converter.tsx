"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Text } from 'lucide-react';
import { Label } from '../ui/label';

// Basic number to words converter. Can be expanded.
function numToWords(numStr: string): string {
    const num = parseInt(numStr.replace(/,/g, ''), 10);
    if (isNaN(num) || num === 0) return 'صفر';
    if (num > 999999999999999) return 'عدد بسیار بزرگ است';

    const ones = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
    const teens = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
    const tens = ['', 'ده', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
    const hundreds = ['', 'یکصد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
    const thousands = ['', 'هزار', 'میلیون', 'میلیارد', 'تریلیون'];

    function convertGroup(n: number): string {
        if (n === 0) return '';
        const parts = [];

        const h = Math.floor(n / 100);
        if (h > 0) parts.push(hundreds[h]);
        
        const rem = n % 100;
        if (rem > 0) {
            if (rem < 10) {
                parts.push(ones[rem]);
            } else if (rem < 20) {
                parts.push(teens[rem - 10]);
            } else {
                const t = Math.floor(rem / 10);
                const o = rem % 10;
                parts.push(tens[t]);
                if (o > 0) parts.push(ones[o]);
            }
        }
        return parts.join(' و ');
    }

    const numGroups = [];
    let tempNum = num;
    while (tempNum > 0) {
        numGroups.push(tempNum % 1000);
        tempNum = Math.floor(tempNum / 1000);
    }

    const wordGroups = numGroups.map((group, i) => {
        if (group === 0) return '';
        const groupWords = convertGroup(group);
        return i > 0 ? `${groupWords} ${thousands[i]}` : groupWords;
    });

    return wordGroups.reverse().filter(g => g).join(' و ');
}


export default function NumberToWordsConverter() {
  const [number, setNumber] = useState('');

  const words = useMemo(() => {
    if (number.trim() === '') return 'لطفا یک عدد وارد کنید.';
    return numToWords(number);
  }, [number]);

  return (
    <Card className="h-full group/card transition-all duration-300 hover:border-primary/50">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover/opacity-100 transition-opacity duration-500 -z-10"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Text className="h-6 w-6 text-primary" />
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
