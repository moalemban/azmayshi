"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PiggyBank } from 'lucide-react';

export default function DepositCalculator() {
  const [principal, setPrincipal] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [duration, setDuration] = useState<string>(''); // in months

  const amount = parseFloat(principal);
  const rate = parseFloat(interestRate);
  const term = parseInt(duration);

  const formatNumber = (num: number) => {
    if (isNaN(num)) return '۰';
    return Math.round(num).toLocaleString('fa-IR');
  };

  const { totalInterest, totalValue, hasValues } = useMemo(() => {
    if (isNaN(amount) || isNaN(rate) || isNaN(term) || amount <= 0 || rate < 0 || term <= 0) {
      return { totalInterest: 0, totalValue: 0, hasValues: false };
    }
    
    const monthlyRate = rate / 100 / 12;
    const finalAmount = amount * Math.pow(1 + monthlyRate, term);
    const profit = finalAmount - amount;
    
    return {
      totalInterest: profit,
      totalValue: finalAmount,
      hasValues: true
    };
  }, [amount, rate, term]);

  return (
    <CardContent className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="principalAmount" className="text-muted-foreground">مبلغ سپرده (تومان)</Label>
          <Input id="principalAmount" type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="۱۰,۰۰۰,۰۰۰" className="h-12 text-lg"/>
        </div>
        <div className="space-y-2">
          <Label htmlFor="depositInterestRate" className="text-muted-foreground">نرخ سود سالانه (%)</Label>
          <Input id="depositInterestRate" type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} placeholder="۲۰" className="h-12 text-lg" />
        </div>
          <div className="space-y-2">
          <Label htmlFor="depositDuration" className="text-muted-foreground">مدت (ماه)</Label>
          <Input id="depositDuration" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="۱۲" className="h-12 text-lg" />
        </div>
      </div>

      {hasValues ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-muted/50 rounded-lg shadow-inner">
                  <p className="text-sm text-muted-foreground">سود کل</p>
                  <p className="text-2xl font-bold text-primary mt-1">{formatNumber(totalInterest)}</p>
                  <p className="text-xs text-muted-foreground">تومان</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg shadow-inner">
                  <p className="text-sm text-muted-foreground">مبلغ نهایی (اصل + سود)</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{formatNumber(totalValue)}</p>
                  <p className="text-xs text-muted-foreground">تومان</p>
              </div>
          </div>
      ) : (
            <div className="flex items-center justify-center text-muted-foreground h-24 bg-muted/30 rounded-lg">
              <p>مقادیر را برای محاسبه وارد کنید.</p>
          </div>
      )}
    </CardContent>
  );
}
