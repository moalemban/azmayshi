"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PiggyBank } from 'lucide-react';

export default function DepositCalculator() {
  const [principal, setPrincipal] = useState<string>('10000000');
  const [interestRate, setInterestRate] = useState<string>('20');
  const [duration, setDuration] = useState<string>('12'); // in months

  const amount = parseFloat(principal);
  const rate = parseFloat(interestRate);
  const term = parseInt(duration);

  const formatNumber = (num: number) => {
    if (isNaN(num)) return '۰';
    return Math.round(num).toLocaleString('fa-IR');
  };

  const { totalInterest, totalValue } = useMemo(() => {
    if (isNaN(amount) || isNaN(rate) || isNaN(term) || amount <= 0 || rate < 0 || term <= 0) {
      return { totalInterest: 0, totalValue: 0 };
    }
    // Simple monthly interest calculation
    const yearlyInterest = amount * (rate / 100);
    const monthlyInterest = yearlyInterest / 12;
    const interest = monthlyInterest * term;
    
    return {
      totalInterest: interest,
      totalValue: amount + interest,
    };
  }, [amount, rate, term]);

  return (
    <Card className="h-full group/card transition-all duration-300 hover:border-primary/50">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PiggyBank className="h-6 w-6 text-primary" />
          ماشین‌حساب سود سپرده
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="principalAmount">مبلغ سپرده (تومان)</Label>
            <Input id="principalAmount" type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="مثلا: ۱۰,۰۰۰,۰۰۰" className="h-12 text-lg"/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="depositInterestRate">نرخ سود سالانه (%)</Label>
            <Input id="depositInterestRate" type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} placeholder="مثلا: ۲۰" className="h-12 text-lg" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="depositDuration">مدت (ماه)</Label>
            <Input id="depositDuration" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="مثلا: ۱۲" className="h-12 text-lg" />
          </div>
        </div>

        {/* Outputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-background/40 rounded-lg shadow-inner">
                <p className="text-sm text-muted-foreground">سود کل</p>
                <p className="text-2xl font-bold text-primary mt-1">{formatNumber(totalInterest)}</p>
                <p className="text-xs text-muted-foreground/80">تومان</p>
            </div>
            <div className="p-4 bg-background/40 rounded-lg shadow-inner">
                <p className="text-sm text-muted-foreground">مبلغ نهایی (اصل + سود)</p>
                <p className="text-2xl font-bold text-foreground mt-1">{formatNumber(totalValue)}</p>
                <p className="text-xs text-muted-foreground/80">تومان</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
