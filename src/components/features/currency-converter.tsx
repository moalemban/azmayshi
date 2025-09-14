"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft } from 'lucide-react';
import { currencies, mockExchangeRates } from '@/lib/constants';

export default function CurrencyConverter() {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('IRR');
  const [fromAmount, setFromAmount] = useState<string | number>(1);
  const [toAmount, setToAmount] = useState<string | number>('');

  const calculateConversion = (amount: number, from: string, to: string, direction: 'from' | 'to') => {
    if (from === to) return amount;

    let rate;
    if (direction === 'from') {
      if (mockExchangeRates[`${from}-${to}`]) {
        rate = mockExchangeRates[`${from}-${to}`];
      } else if (mockExchangeRates[`${to}-${from}`]) {
        rate = 1 / mockExchangeRates[`${to}-${from}`];
      } else {
        const fromToUsd = from === 'USD' ? 1 : (1 / (mockExchangeRates[`${from}-USD`] || (1/mockExchangeRates[`USD-${from}`])));
        const usdToTo = to === 'USD' ? 1 : mockExchangeRates[`USD-${to}`];
        rate = fromToUsd * usdToTo;
      }
    } else { // direction is 'to'
      if (mockExchangeRates[`${to}-${from}`]) {
        rate = mockExchangeRates[`${to}-${from}`];
      } else if (mockExchangeRates[`${from}-${to}`]) {
        rate = 1 / mockExchangeRates[`${from}-${to}`];
      } else {
        const toToUsd = to === 'USD' ? 1 : (1 / (mockExchangeRates[`${to}-USD`] || (1/mockExchangeRates[`USD-${to}`])));
        const usdToFrom = from === 'USD' ? 1 : mockExchangeRates[`USD-${from}`];
        rate = toToUsd * usdToFrom;
      }
    }
    
    return amount * (rate || 0);
  };
  
  useEffect(() => {
    const amount = typeof fromAmount === 'string' ? parseFloat(fromAmount.toString().replace(/,/g, '')) : fromAmount;
    if (!isNaN(amount)) {
      const converted = calculateConversion(amount, fromCurrency, toCurrency, 'from');
      setToAmount(converted.toLocaleString('fa-IR', { maximumFractionDigits: 2 }));
    } else {
      setToAmount('');
    }
  }, [fromAmount, fromCurrency, toCurrency]);


  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      setFromAmount(numValue.toLocaleString('fa-IR', {maximumFractionDigits: 20}).replace(/٬/g, ','));
    } else if (value === '') {
      setFromAmount('');
    }
  };
  
  const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    const numValue = Number(value);

    if (!isNaN(numValue)) {
      setToAmount(numValue.toLocaleString('fa-IR', {maximumFractionDigits: 20}).replace(/٬/g, ','));
      const converted = calculateConversion(numValue, toCurrency, fromCurrency, 'to');
      setFromAmount(converted.toLocaleString('fa-IR', { maximumFractionDigits: 2 }));
    } else if (value === '') {
      setToAmount('');
      setFromAmount('');
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
  };

  return (
    <Card className="h-full group/card">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent group-hover:from-primary/20 transition-all duration-500 -z-10"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="h-6 w-6 text-primary" />
          تبدیل ارز
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <div className="w-full space-y-2">
            <label className="text-sm font-medium text-muted-foreground">مبلغ</label>
            <Input dir="ltr" type="text" value={fromAmount} onChange={handleFromAmountChange} placeholder="0"/>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="انتخاب ارز" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(c => <SelectItem key={c.code} value={c.code}>{c.code} - {c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button variant="ghost" size="icon" className="shrink-0" onClick={swapCurrencies}>
            <ArrowRightLeft className="h-5 w-5 text-muted-foreground transition-transform group-hover/card:rotate-180 duration-300" />
          </Button>
          <div className="w-full space-y-2">
            <label className="text-sm font-medium text-muted-foreground">مبلغ تبدیل شده</label>
            <Input dir="ltr" type="text" value={toAmount} onChange={handleToAmountChange} placeholder="0" />
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="انتخاب ارز" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(c => <SelectItem key={c.code} value={c.code}>{c.code} - {c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
