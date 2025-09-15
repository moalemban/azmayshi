"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Banknote } from 'lucide-react';

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState<string>('100000000');
  const [interestRate, setInterestRate] = useState<string>('23');
  const [loanTerm, setLoanTerm] = useState<string>('36'); // in months

  const amount = parseFloat(loanAmount);
  const rate = parseFloat(interestRate);
  const term = parseInt(loanTerm);

  const formatNumber = (num: number) => {
    if (isNaN(num)) return '۰';
    return Math.round(num).toLocaleString('fa-IR');
  };

  const { monthlyPayment, totalInterest, totalPayment } = useMemo(() => {
    if (isNaN(amount) || isNaN(rate) || isNaN(term) || amount <= 0 || rate < 0 || term <= 0) {
      return { monthlyPayment: 0, totalInterest: 0, totalPayment: 0 };
    }
    const monthlyRate = (rate / 100) / 12;
    const payment = amount * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
    const totalPaid = payment * term;
    const interestPaid = totalPaid - amount;

    return {
      monthlyPayment: payment,
      totalInterest: interestPaid,
      totalPayment: totalPaid
    };
  }, [amount, rate, term]);


  return (
    <Card className="h-full group/card transition-all duration-300 hover:border-primary/50">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Banknote className="h-6 w-6 text-primary" />
          ماشین‌حساب اقساط وام
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="loanAmount">مبلغ وام (تومان)</Label>
            <Input id="loanAmount" type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} placeholder="مثلا: ۱۰۰,۰۰۰,۰۰۰" className="h-12 text-lg"/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="interestRate">نرخ سود سالانه (%)</Label>
            <Input id="interestRate" type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} placeholder="مثلا: ۲۳" className="h-12 text-lg" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="loanTerm">مدت بازپرداخت (ماه)</Label>
            <Input id="loanTerm" type="number" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} placeholder="مثلا: ۳۶" className="h-12 text-lg" />
          </div>
        </div>

        {/* Outputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-background/40 rounded-lg shadow-inner">
                <p className="text-sm text-muted-foreground">مبلغ هر قسط</p>
                <p className="text-2xl font-bold text-primary mt-1">{formatNumber(monthlyPayment)}</p>
                <p className="text-xs text-muted-foreground/80">تومان</p>
            </div>
            <div className="p-4 bg-background/40 rounded-lg shadow-inner">
                <p className="text-sm text-muted-foreground">مجموع سود</p>
                <p className="text-2xl font-bold text-foreground mt-1">{formatNumber(totalInterest)}</p>
                <p className="text-xs text-muted-foreground/80">تومان</p>
            </div>
             <div className="p-4 bg-background/40 rounded-lg shadow-inner">
                <p className="text-sm text-muted-foreground">مبلغ کل بازپرداخت</p>
                <p className="text-2xl font-bold text-foreground mt-1">{formatNumber(totalPayment)}</p>
                <p className="text-xs text-muted-foreground/80">تومان</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
