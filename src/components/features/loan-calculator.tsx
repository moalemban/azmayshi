"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Banknote } from 'lucide-react';
import { Button } from '../ui/button';

type InterestType = 'compound' | 'simple';

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [loanTerm, setLoanTerm] = useState<string>('');
  const [interestType, setInterestType] = useState<InterestType>('compound');

  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value === '') {
      setLoanAmount('');
      return;
    }
    const numberValue = parseInt(value, 10);
    setLoanAmount(numberValue.toLocaleString('en-US'));
  };
  
  const amount = parseFloat(loanAmount.replace(/,/g, ''));
  const rate = parseFloat(interestRate);
  const term = parseInt(loanTerm);

  const formatNumber = (num: number) => {
    if (isNaN(num)) return '۰';
    return Math.round(num).toLocaleString('fa-IR');
  };

  const { monthlyPayment, totalInterest, totalPayment, hasValues } = useMemo(() => {
    if (isNaN(amount) || isNaN(rate) || isNaN(term) || amount <= 0 || rate < 0 || term <= 0) {
      return { monthlyPayment: 0, totalInterest: 0, totalPayment: 0, hasValues: false };
    }
    
    let payment = 0;
    let interestPaid = 0;
    let totalPaid = 0;

    if (interestType === 'compound') {
        const monthlyRate = rate / 100 / 12;
        if (monthlyRate === 0) {
            payment = amount / term;
        } else {
            payment = amount * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
        }
        totalPaid = payment * term;
        interestPaid = totalPaid - amount;
    } else { // simple interest
        interestPaid = amount * (rate / 100) * (term / 12);
        totalPaid = amount + interestPaid;
        payment = totalPaid / term;
    }


    return {
      monthlyPayment: payment,
      totalInterest: interestPaid,
      totalPayment: totalPaid,
      hasValues: true
    };
  }, [amount, rate, term, interestType]);


  return (
    <CardContent className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="loanAmount" className="text-muted-foreground">مبلغ وام (تومان)</Label>
          <Input id="loanAmount" type="text" value={loanAmount} onChange={handleLoanAmountChange} placeholder="۱۰۰,۰۰۰,۰۰۰" className="h-12 text-lg text-center font-display" dir="ltr"/>
        </div>
        <div className="space-y-2">
          <Label htmlFor="interestRate" className="text-muted-foreground">نرخ سود سالانه (%)</Label>
          <Input id="interestRate" type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} placeholder="۲۳" className="h-12 text-lg text-center font-display" />
        </div>
          <div className="space-y-2">
          <Label htmlFor="loanTerm" className="text-muted-foreground">مدت بازپرداخت (ماه)</Label>
          <Input id="loanTerm" type="number" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} placeholder="۳۶" className="h-12 text-lg text-center font-display" />
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
                  <p className="text-sm text-muted-foreground">مبلغ هر قسط</p>
                  <p className="text-2xl font-bold text-primary mt-1 font-display">{formatNumber(monthlyPayment)}</p>
                  <p className="text-xs text-muted-foreground">تومان</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg shadow-inner">
                  <p className="text-sm text-muted-foreground">مجموع سود</p>
                  <p className="text-2xl font-bold text-foreground mt-1 font-display">{formatNumber(totalInterest)}</p>
                  <p className="text-xs text-muted-foreground">تومان</p>
              </div>
                <div className="p-4 bg-muted/50 rounded-lg shadow-inner">
                  <p className="text-sm text-muted-foreground">مبلغ کل بازپرداخت</p>
                  <p className="text-2xl font-bold text-foreground mt-1 font-display">{formatNumber(totalPayment)}</p>
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
