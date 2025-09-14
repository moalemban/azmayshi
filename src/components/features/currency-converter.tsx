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
        // Fallback through USD
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
    const amount = typeof fromAmount === 'string' ? parseFloat(fromAmount) : fromAmount;
    if (!isNaN(amount)) {
      const converted = calculateConversion(amount, fromCurrency, toCurrency, 'from');
      setToAmount(converted.toLocaleString('en-US', { maximumFractionDigits: 2 }));
    } else {
      setToAmount('');
    }
  }, [fromAmount, fromCurrency, toCurrency]);


  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromAmount(e.target.value);
  };
  
  const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    setToAmount(value);
    const amount = parseFloat(value);
     if (!isNaN(amount)) {
      const converted = calculateConversion(amount, toCurrency, fromCurrency, 'to');
      setFromAmount(converted.toLocaleString('en-US', { maximumFractionDigits: 2 }));
    } else {
      setFromAmount('');
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
  };

  return (
    <Card className="transition-transform transform hover:scale-[1.02] duration-300 ease-in-out">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="h-6 w-6" />
          Currency Converter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full space-y-2">
            <label className="text-sm font-medium">From</label>
            <Input type="text" value={fromAmount} onChange={handleFromAmountChange} placeholder="Enter amount"/>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(c => <SelectItem key={c.code} value={c.code}>{c.code} - {c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button variant="ghost" size="icon" className="sm:mt-8 shrink-0" onClick={swapCurrencies}>
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
          <div className="w-full space-y-2">
            <label className="text-sm font-medium">To</label>
            <Input type="text" value={toAmount} onChange={handleToAmountChange} placeholder="Converted amount" />
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
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
