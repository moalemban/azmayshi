"use client";

import { useState, useMemo } from 'react';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp } from 'lucide-react';
import { Slider } from '../ui/slider';

// Helper function to format numbers with commas
const formatNumberWithCommas = (value: string): string => {
  const num = parseInt(value.replace(/,/g, ''), 10);
  return isNaN(num) ? '' : num.toLocaleString('en-US');
};

// Helper function to remove commas
const unformatNumber = (value: string): number => {
  return parseFloat(value.replace(/,/g, ''));
};


export default function SavingsCalculator() {
  const [targetAmount, setTargetAmount] = useState('');
  const [monthlySaving, setMonthlySaving] = useState('');
  const [increaseRate, setIncreaseRate] = useState(10); // Percentage

  const handleTargetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetAmount(formatNumberWithCommas(e.target.value));
  };
  
  const handleMonthlySavingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonthlySaving(formatNumberWithCommas(e.target.value));
  };
  
  const calculationResult = useMemo(() => {
    const target = unformatNumber(targetAmount || '0');
    const initialMonthly = unformatNumber(monthlySaving || '0');
    const rate = increaseRate / 100;

    if (target <= 0 || initialMonthly <= 0) {
      return null;
    }

    let total = 0;
    let months = 0;
    let currentMonthly = initialMonthly;

    while (total < target) {
      total += currentMonthly;
      months++;
      if (months > 0 && months % 12 === 0) {
        currentMonthly *= (1 + rate);
      }
    }
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    return {
      years,
      remainingMonths,
      finalAmount: total
    };
  }, [targetAmount, monthlySaving, increaseRate]);

  return (
    <CardContent className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="targetAmount" className="text-muted-foreground">مبلغ هدف (تومان)</Label>
          <Input 
            id="targetAmount" 
            type="text" 
            value={targetAmount} 
            onChange={handleTargetAmountChange} 
            placeholder="۱,۰۰۰,۰۰۰,۰۰۰" 
            className="h-12 text-lg text-center font-display" 
            dir="ltr"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="monthlySaving" className="text-muted-foreground">پس‌انداز ماهانه اولیه (تومان)</Label>
          <Input 
            id="monthlySaving" 
            type="text" 
            value={monthlySaving} 
            onChange={handleMonthlySavingChange} 
            placeholder="۱۰,۰۰۰,۰۰۰" 
            className="h-12 text-lg text-center font-display" 
            dir="ltr"
          />
        </div>
      </div>
      
      <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="increaseRate" className="text-muted-foreground">نرخ افزایش پس‌انداز سالانه</Label>
            <span className="font-mono text-primary text-lg">{increaseRate}%</span>
          </div>
          <Slider
            id="increaseRate"
            value={[increaseRate]}
            onValueChange={(val) => setIncreaseRate(val[0])}
            min={0}
            max={50}
            step={1}
          />
      </div>

      {calculationResult ? (
          <div className="w-full text-center bg-muted/50 p-4 rounded-lg shadow-inner mt-2 space-y-3">
              <div>
                  <p className="text-lg text-muted-foreground">زمان لازم برای رسیدن به هدف</p>
                  <p className="text-2xl font-bold text-primary font-display" dir="rtl">
                    <span>{calculationResult.years.toLocaleString('fa-IR')}</span>
                    <span className="text-base font-normal mx-1">سال و</span>
                    <span>{calculationResult.remainingMonths.toLocaleString('fa-IR')}</span>
                    <span className="text-base font-normal mx-1">ماه</span>
                  </p>
              </div>
               <div>
                  <p className="text-sm text-muted-foreground">مبلغ نهایی پس‌انداز شده</p>
                  <p className="text-xl font-medium text-foreground/80 font-display">
                     {Math.round(calculationResult.finalAmount).toLocaleString('fa-IR')} تومان
                  </p>
              </div>
          </div>
      ) : (
            <div className="flex items-center justify-center text-muted-foreground h-24 bg-muted/30 rounded-lg">
              <p>مقادیر را برای مشاهده نتیجه وارد کنید.</p>
          </div>
      )}
    </CardContent>
  );
}
