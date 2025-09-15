"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Binary, ArrowRightLeft } from 'lucide-react';
import { Button } from '../ui/button';

// Function to convert text to binary
const textToBinary = (text: string): string => {
  return text
    .split('')
    .map(char => {
      // Get character code and convert to binary, then pad with leading zeros to make it 8 bits
      return char.charCodeAt(0).toString(2).padStart(8, '0');
    })
    .join(' ');
};

// Function to convert binary to text
const binaryToText = (binary: string): string => {
    // Remove any non-binary characters and spaces
    const cleanBinary = binary.replace(/[^01\s]/g, '').replace(/\s+/g, '');

    if (cleanBinary.length % 8 !== 0) {
        return 'کد باینری نامعتبر است (باید مضربی از ۸ بیت باشد)';
    }

    try {
        const textChars = cleanBinary.match(/.{1,8}/g)?.map(byte => {
            return String.fromCharCode(parseInt(byte, 2));
        }) || [];
        return textChars.join('');
    } catch (e) {
        return 'خطا در تبدیل باینری به متن';
    }
};


export default function BinaryConverter() {
  const [text, setText] = useState('سلام دنیا');
  const [binary, setBinary] = useState(textToBinary('سلام دنیا'));
  const [lastEdited, setLastEdited] = useState<'text' | 'binary'>('text');

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    setLastEdited('text');
    if (newText.trim() === '') {
      setBinary('');
    } else {
      setBinary(textToBinary(newText));
    }
  };

  const handleBinaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBinary = e.target.value;
    setBinary(newBinary);
    setLastEdited('binary');
    if (newBinary.trim() === '') {
      setText('');
    } else {
      setText(binaryToText(newBinary));
    }
  };


  return (
    <Card className="h-full group/card transition-all duration-300 hover:border-primary/50">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 -z-10"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Binary className="h-6 w-6 text-primary" />
          تبدیل متن و باینری
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="space-y-2">
          <Label htmlFor="text-input">متن (فارسی/انگلیسی)</Label>
          <Textarea
            id="text-input"
            value={text}
            onChange={handleTextChange}
            placeholder="متن خود را اینجا وارد کنید..."
            className="min-h-[100px] text-base"
          />
        </div>

        <div className="flex justify-center">
            <ArrowRightLeft className="h-6 w-6 text-muted-foreground transition-transform group-hover/card:rotate-180 duration-300" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="binary-input">کد باینری (Binary)</Label>
          <Textarea
            id="binary-input"
            value={binary}
            onChange={handleBinaryChange}
            placeholder="01010011 01100001 01101100"
            className="min-h-[100px] text-left font-mono"
            dir="ltr"
          />
        </div>
      </CardContent>
    </Card>
  );
}
