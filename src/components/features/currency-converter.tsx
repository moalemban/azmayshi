"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft, Landmark } from 'lucide-react';
import { currencies, mockExchangeRates } from '@/lib/constants';

export default function CurrencyConverter() {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('IRR');
  const [amount, setAmount] = useState<number>(1);
  const [isFrom, setIsFrom] = useState(true); // True if the user is editing the 'from' amount

  const getRate = (from: string, to: string) => {
    if (from === to) return 1;
    if (mockExchangeRates[`${from}-${to}`]) return mockExchangeRates[`${from}-${to}`];
    if (mockExchangeRates[`${to}-${from}`]) return 1 / mockExchangeRates[`${to}-${from}`];
    
    // Fallback via USD
    const fromToUsd = from === 'USD' ? 1 : (1 / (mockExchangeRates[`${from}-USD`] || (1/mockExchangeRates[`USD-${from}`] || 1)));
    const usdToTo = to === 'USD' ? 1 : (mockExchangeRates[`USD-${to}`] || (1/mockExchangeRates[`${to}-USD`] || 1));
    return fromToUsd * usdToTo;
  };

  const fromAmount = isFrom ? amount : amount * getRate(toCurrency, fromCurrency);
  const toAmount = isFrom ? amount * getRate(fromCurrency, toCurrency) : amount;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>, isFromField: boolean) => {
    const value = e.target.value.replace(/,/g, '');
    const numValue = Number(value);

    if (!isNaN(numValue) || value === '') {
      setIsFrom(isFromField);
      setAmount(numValue || 0);
    }
  };

  const swapCurrencies = () => {
    const newFrom = toCurrency;
    const newTo = fromCurrency;
    setFromCurrency(newFrom);
    setToCurrency(newTo);
    // Keep the input that was being edited stable
    setIsFrom(!isFrom); 
  };
  
  const formatValue = (val: number) => {
    if (isNaN(val) || val === 0) return '0';
    return val.toLocaleString('fa-IR', { maximumFractionDigits: val < 1 ? 6 : 2 });
  }

  return (
    <Card className="h-full group/card transition-all duration-300 hover:border-primary/50">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Landmark className="h-6 w-6 text-primary" />
          تبدیل ارز
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <div className="w-full space-y-2">
            <label className="text-sm font-medium text-muted-foreground">مبلغ</label>
            <Input dir="ltr" type="text" value={formatValue(fromAmount)} onChange={(e) => handleAmountChange(e, true)} placeholder="0"/>
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
            <Input dir="ltr" type="text" value={formatValue(toAmount)} onChange={(e) => handleAmountChange(e, false)} placeholder="0" />
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
