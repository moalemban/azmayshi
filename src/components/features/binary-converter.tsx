"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Binary as BinaryIcon, ArrowRightLeft } from 'lucide-react';

const textToBinary = (text: string): string => {
  return text
    .split('')
    .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join(' ');
};

const binaryToText = (binary: string): string => {
  const cleanBinary = binary.trim().replace(/[^01\s]/g, '');
  if (cleanBinary === '') return '';

  try {
    const bytes = cleanBinary.split(/\s+/).filter(b => b); // filter out empty strings
    if(bytes.some(b => !/^[01]{8}$/.test(b))) return 'کد باینری معتبر نیست (باید شامل بایت‌های ۸ بیتی باشد).';
    const textChars = bytes.map(byte => {
      return String.fromCharCode(parseInt(byte, 2));
    });
    return textChars.join('');
  } catch (e) {
    return 'خطا در تبدیل باینری به متن. فرمت ورودی را بررسی کنید.';
  }
};

export default function BinaryConverter() {
  const [text, setText] = useState('');
  const [binary, setBinary] = useState('');

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    setBinary(newText.trim() === '' ? '' : textToBinary(newText));
  };

  const handleBinaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBinary = e.target.value;
    setBinary(newBinary);
    setText(binaryToText(newBinary));
  };

  return (
    <CardContent className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor="text-input" className="text-muted-foreground">متن (فارسی/انگلیسی)</Label>
        <Textarea
          id="text-input"
          value={text}
          onChange={handleTextChange}
          placeholder="سلام دنیا"
          className="min-h-[100px] text-base"
        />
      </div>

      <div className="flex justify-center">
          <ArrowRightLeft className="h-6 w-6 text-muted-foreground transition-transform group-hover/card:rotate-180 duration-300" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="binary-input" className="text-muted-foreground">کد باینری (Binary)</Label>
        <Textarea
          id="binary-input"
          value={binary}
          onChange={handleBinaryChange}
          placeholder="11010110 10100011 11010110 10111001 11010110 10100001 11010111 10000000 00100000 11010110 10111010 11010110 10011111 11010111 10001000 11010110 10100001"
          className="min-h-[100px] text-left font-mono"
          dir="ltr"
        />
      </div>
    </CardContent>
  );
}
