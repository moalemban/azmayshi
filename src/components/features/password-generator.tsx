"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { KeyRound, Clipboard, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const charSets = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState({ value: 0, label: 'بسیار ضعیف', color: 'bg-red-500' });
  const [options, setOptions] = useState({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: false,
  });
  const { toast } = useToast();

  const generatePassword = () => {
    let charset = '';
    if (options.lowercase) charset += charSets.lowercase;
    if (options.uppercase) charset += charSets.uppercase;
    if (options.numbers) charset += charSets.numbers;
    if (options.symbols) charset += charSets.symbols;

    if (charset === '') {
      toast({
        title: 'خطا',
        description: 'حداقل یک نوع کاراکتر را برای تولید رمز انتخاب کنید.',
        variant: 'destructive',
      });
      setPassword('');
      return;
    }

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }
    setPassword(newPassword);
  };

  const calculateStrength = () => {
    let score = 0;
    const activeOptions = Object.values(options).filter(Boolean).length;

    // Length score
    if (length >= 8) score += 1;
    if (length >= 12) score += 1;
    if (length >= 16) score += 1;
    if (length >= 20) score += 1;
    
    // Character type score
    if (options.lowercase) score += 1;
    if (options.uppercase) score += 1;
    if (options.numbers) score += 1;
    if (options.symbols) score += 2; // Symbols add more strength

    // Total score calculation (simple version)
    let totalScore = (score / 9) * 100;
    if (length < 8) totalScore = Math.min(totalScore, 20);

    let strengthLabel = 'بسیار ضعیف';
    let strengthColor = 'bg-red-500';

    if (totalScore > 90) {
        strengthLabel = 'بسیار قوی';
        strengthColor = 'bg-emerald-500';
    } else if (totalScore > 70) {
        strengthLabel = 'قوی';
        strengthColor = 'bg-green-500';
    } else if (totalScore > 40) {
        strengthLabel = 'متوسط';
        strengthColor = 'bg-yellow-500';
    } else if (totalScore > 20) {
        strengthLabel = 'ضعیف';
        strengthColor = 'bg-orange-500';
    }
    
    setStrength({ value: totalScore, label: strengthLabel, color: strengthColor });
  };


  useEffect(() => {
    generatePassword();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, options]);

  useEffect(() => {
    calculateStrength();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password, length, options]);

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    toast({
      title: 'کپی شد!',
      description: 'رمز عبور با موفقیت در کلیپ‌بورد شما کپی شد.',
    });
  };

  const handleOptionChange = (key: keyof typeof options) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Card className="h-full group/card transition-all duration-300 hover:border-primary/50">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 -z-10"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-6 w-6 text-primary" />
          تولیدکننده رمز عبور
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative">
          <Input
            readOnly
            value={password}
            className="h-14 text-lg text-center font-mono tracking-widest pr-24 pl-12"
            placeholder="رمز شما اینجا ظاهر می‌شود..."
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
             <Button variant="ghost" size="icon" onClick={generatePassword}>
                <RefreshCw className="h-5 w-5" />
             </Button>
            <Button variant="ghost" size="icon" onClick={copyToClipboard}>
              <Clipboard className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
            <div className='flex items-center justify-between'>
                <Label>طول رمز: <span className='font-mono text-primary text-lg'>{length}</span></Label>
                 <div className='w-48'>
                     <Slider
                        value={[length]}
                        onValueChange={(val) => setLength(val[0])}
                        min={6}
                        max={32}
                        step={1}
                     />
                 </div>
            </div>
             <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                    <Label>قدرت رمز:</Label>
                    <span className='text-sm font-medium' style={{color: `hsl(var(${strength.color.replace('bg-', '--')}))`}}>{strength.label}</span>
                </div>
                 <Progress value={strength.value} className={cn("h-2", strength.color)} />
             </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.keys(options).map(key => (
            <div key={key} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id={key}
                checked={options[key as keyof typeof options]}
                onCheckedChange={() => handleOptionChange(key as keyof typeof options)}
              />
              <Label htmlFor={key} className="text-base cursor-pointer">
                {
                    {
                        'lowercase': 'حروف کوچک (a-z)',
                        'uppercase': 'حروف بزرگ (A-Z)',
                        'numbers': 'اعداد (0-9)',
                        'symbols': 'نمادها (!@#)'
                    }[key]
                }
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
