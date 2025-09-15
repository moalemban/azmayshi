"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft, Landmark } from 'lucide-react';
import { currencies, mockExchangeRates } from '@/lib/constants';

export default function CurrencyConverter() {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('IRT');
  const [amount, setAmount] = useState<number>(1);
  const [isFrom, setIsFrom] = useState(true);

  const getRate = (from: string, to: string) => {
    if (from === to) return 1;
    if (from === 'IRR' && to === 'IRT') return 0.1;
    if (from === 'IRT' && to === 'IRR') return 10;
    
    let fromRate = mockExchangeRates[`USD-${from}`]
    if(from === 'IRT') fromRate = mockExchangeRates['USD-IRR'] / 10;

    let toRate = mockExchangeRates[`USD-${to}`]
    if(to === 'IRT') toRate = mockExchangeRates['USD-IRR'] / 10;
    
    if (from === 'USD') fromRate = 1;
    if (to === 'USD') toRate = 1;

    if (fromRate && toRate) {
        return toRate / fromRate;
    }
    return 1;
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
        <Input dir="ltr" type="text" value={formatValue(value)} onChange={onValueChange} placeholder="0" className="pr-24 text-lg h-12 bg-black/20 text-white border-white/20"/>
        <div className="absolute inset-y-0 right-0 flex items-center">
            <Select value={currencyCode} onValueChange={onCurrencyChange}>
              <SelectTrigger className="w-[100px] border-0 bg-transparent h-full rounded-r-md text-white">
                <SelectValue placeholder="ارز" />
              </SelectTrigger>
              <SelectContent className="glass-effect">
                {currencies.map(c => <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>)}
              </SelectContent>
            </Select>
        </div>
      </div>
       <p className="text-xs text-white/70 text-right pr-2 h-4">
        {currencies.find(c => c.code === currencyCode)?.name}
      </p>
    </div>
  );


  return (
    <Card className="glass-effect h-full card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-white">
          <Landmark className="h-6 w-6 text-green-400" />
          تبدیل ارز
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-2">
           {renderInput(fromAmount, (e) => handleAmountChange(e, true), fromCurrency, setFromCurrency)}

          <Button variant="ghost" size="icon" className="shrink-0 my-1 text-white/70 hover:bg-white/10" onClick={swapCurrencies}>
            <ArrowRightLeft className="h-5 w-5 transition-transform group-hover/card:rotate-180 duration-300" />
          </Button>

          {renderInput(toAmount, (e) => handleAmountChange(e, false), toCurrency, setToCurrency)}

        </div>
      </CardContent>
    </Card>
  );
}
