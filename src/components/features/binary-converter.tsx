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
    const cleanBinary = binary.replace(/[^01\s]/g, '').replace(/\s+/g, '');
    if (cleanBinary.length % 8 !== 0) {
        return 'کد باینری نامعتبر است (باید مضربی از ۸ بیت باشد)';
    }
    try {
        const textChars = cleanBinary.match(/.{1,8}/g)?.map(byte => String.fromCharCode(parseInt(byte, 2))) || [];
        return textChars.join('');
    } catch (e) {
        return 'خطا در تبدیل باینری به متن';
    }
};

export default function BinaryConverter() {
  const [text, setText] = useState('سلام دنیا');
  const [binary, setBinary] = useState(textToBinary('سلام دنیا'));

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    setBinary(newText.trim() === '' ? '' : textToBinary(newText));
  };

  const handleBinaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBinary = e.target.value;
    setBinary(newBinary);
    setText(newBinary.trim() === '' ? '' : binaryToText(newBinary));
  };

  return (
    <Card className="glass-effect h-full card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-white">
          <BinaryIcon className="h-6 w-6 text-cyan-400" />
          تبدیل متن و باینری
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="space-y-2">
          <Label htmlFor="text-input" className="text-white/80">متن (فارسی/انگلیسی)</Label>
          <Textarea
            id="text-input"
            value={text}
            onChange={handleTextChange}
            placeholder="متن خود را اینجا وارد کنید..."
            className="min-h-[100px] text-base bg-black/20 text-white border-white/20"
          />
        </div>

        <div className="flex justify-center">
            <ArrowRightLeft className="h-6 w-6 text-white/60 transition-transform group-hover/card:rotate-180 duration-300" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="binary-input" className="text-white/80">کد باینری (Binary)</Label>
          <Textarea
            id="binary-input"
            value={binary}
            onChange={handleBinaryChange}
            placeholder="01010011 01100001 01101100"
            className="min-h-[100px] text-left font-mono bg-black/20 text-white border-white/20"
            dir="ltr"
          />
        </div>
      </CardContent>
    </Card>
  );
}
