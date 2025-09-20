"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PiggyBank } from 'lucide-react';
import { Button } from '../ui/button';

type InterestType = 'compound' | 'simple';

export default function DepositCalculator() {
  const [principal, setPrincipal] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [interestType, setInterestType] = useState<InterestType>('compound');

  const handlePrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value === '') {
      setPrincipal('');
      return;
    }
    const numberValue = parseInt(value, 10);
    setPrincipal(numberValue.toLocaleString('en-US'));
  };

  const amount = parseFloat(principal.replace(/,/g, ''));
  const rate = parseFloat(interestRate);
  const term = parseInt(duration);

  const formatNumber = (num: number) => {
    if (isNaN(num)) return '۰';
    return Math.round(num).toLocaleString('fa-IR');
  };

  const { totalInterest, totalValue, monthlyInterest, hasValues } = useMemo(() => {
    if (isNaN(amount) || isNaN(rate) || isNaN(term) || amount <= 0 || rate < 0 || term <= 0) {
      return { totalInterest: 0, totalValue: 0, monthlyInterest: 0, hasValues: false };
    }
    
    let profit = 0;
    let finalAmount = 0;
    
    if (interestType === 'compound') {
      const monthlyRate = rate / 100 / 12;
      finalAmount = amount * Math.pow(1 + monthlyRate, term);
      profit = finalAmount - amount;
    } else { // simple interest
      profit = amount * (rate / 100) * (term / 12);
      finalAmount = amount + profit;
    }
    
    const monthlyProfit = profit / term;

    return {
      totalInterest: profit,
      totalValue: finalAmount,
      monthlyInterest: monthlyProfit,
      hasValues: true
    };
  }, [amount, rate, term, interestType]);

  return (
    <CardContent className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="principalAmount" className="text-muted-foreground">مبلغ سپرده (تومان)</Label>
          <Input id="principalAmount" type="text" value={principal} onChange={handlePrincipalChange} placeholder="۱۰,۰۰۰,۰۰۰" className="h-12 text-lg text-center font-display" dir="ltr"/>
        </div>
        <div className="space-y-2">
          <Label htmlFor="depositInterestRate" className="text-muted-foreground">نرخ سود سالانه (%)</Label>
          <Input id="depositInterestRate" type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} placeholder="۲۰" className="h-12 text-lg text-center font-display" />
        </div>
          <div className="space-y-2">
          <Label htmlFor="depositDuration" className="text-muted-foreground">مدت (ماه)</Label>
          <Input id="depositDuration" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="۱۲" className="h-12 text-lg text-center font-display" />
        </div>
      </div>
      
        <div className="flex items-center justify-center p-1 bg-muted rounded-lg w-full max-w-sm mx-auto">
            {(['compound', 'simple'] as InterestType[]).map((type) => (
            <Button 
                key={type}
                onClick={() => setInterestType(type)} 
                variant={interestType === type ? 'default' : 'ghost'}
                className={`w-full ${interestType === type ? '' : 'text-muted-foreground'}`}
            >
                {type === 'compound' ? 'سود مرکب' : 'سود ساده'}
            </Button>
            ))}
        </div>

      {hasValues ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-muted/50 rounded-lg shadow-inner">
                  <p className="text-sm text-muted-foreground">سود ماهانه</p>
                  <p className="text-2xl font-bold text-primary mt-1 font-display">{formatNumber(monthlyInterest)}</p>
                  <p className="text-xs text-muted-foreground">تومان</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg shadow-inner">
                  <p className="text-sm text-muted-foreground">سود کل</p>
                  <p className="text-2xl font-bold text-primary mt-1 font-display">{formatNumber(totalInterest)}</p>
                  <p className="text-xs text-muted-foreground">تومان</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg shadow-inner">
                  <p className="text-sm text-muted-foreground">مبلغ نهایی (اصل + سود)</p>
                  <p className="text-2xl font-bold text-foreground mt-1 font-display">{formatNumber(totalValue)}</p>
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
