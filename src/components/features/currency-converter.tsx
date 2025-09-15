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

  const renderInput = (
    value: number,
    onValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    currencyCode: string,
    onCurrencyChange: (code: string) => void
  ) => (
    <div className="w-full space-y-2">
      <div className="relative">
        <Input dir="ltr" type="text" value={formatValue(value)} onChange={onValueChange} placeholder="0" className="pr-24 text-lg h-12"/>
        <div className="absolute inset-y-0 right-0 flex items-center">
            <Select value={currencyCode} onValueChange={onCurrencyChange}>
              <SelectTrigger className="w-[100px] border-0 bg-transparent h-full rounded-r-md">
                <SelectValue placeholder="ارز" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(c => <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>)}
              </SelectContent>
            </Select>
        </div>
      </div>
       <p className="text-xs text-muted-foreground text-right pr-2 h-4">
        {currencies.find(c => c.code === currencyCode)?.name}
      </p>
    </div>
  );


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
        <div className="flex flex-col items-center gap-2">
           {renderInput(fromAmount, (e) => handleAmountChange(e, true), fromCurrency, setFromCurrency)}

          <Button variant="ghost" size="icon" className="shrink-0 my-1" onClick={swapCurrencies}>
            <ArrowRightLeft className="h-5 w-5 text-muted-foreground transition-transform group-hover/card:rotate-180 duration-300" />
          </Button>

          {renderInput(toAmount, (e) => handleAmountChange(e, false), toCurrency, setToCurrency)}

        </div>
      </CardContent>
    </Card>
  );
}
