"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CandlestickChart, ArrowUp, ArrowDown } from 'lucide-react';
import { livePrices } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { LivePrice } from '@/lib/types';

const PriceChangeIndicator = ({ change }: { change: number }) => {
  const isPositive = change > 0;
  const isNegative = change < 0;

  if (change === 0) return null;

  return (
    <span
      dir="ltr"
      className={cn(
        'flex items-center text-xs font-medium tabular-nums',
        isPositive ? 'text-green-400' : 'text-red-400'
      )}
    >
      {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
      {isPositive && '+'}
      {(change * 100).toLocaleString('fa-IR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
    </span>
  );
};

const PriceList = ({ prices }: { prices: LivePrice[] }) => (
  <ul className="space-y-4">
    {prices.map((item) => (
      <li key={item.name} className="flex justify-between items-center bg-background/30 p-3 rounded-lg transition-colors hover:bg-background/60">
        <div>
          <p className="font-medium text-foreground">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.symbol}</p>
        </div>
        <div className="text-right font-mono">
          <p className="font-semibold text-foreground">{Number(item.price.replace(/,/g, '')).toLocaleString('fa-IR')}</p>
          <PriceChangeIndicator change={item.change} />
        </div>
      </li>
    ))}
  </ul>
);

export default function LivePrices() {
  return (
    <Card className="h-full group/card transition-all duration-300 hover:border-primary/50">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CandlestickChart className="h-6 w-6 text-primary" />
          قیمت‌های لحظه‌ای
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gold">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="gold">طلا و سکه</TabsTrigger>
            <TabsTrigger value="currencies">ارز</TabsTrigger>
            <TabsTrigger value="stocks">بورس</TabsTrigger>
            <TabsTrigger value="crypto">ارز دیجیتال</TabsTrigger>
          </TabsList>
          <TabsContent value="gold" className="mt-4">
            <PriceList prices={livePrices.gold} />
          </TabsContent>
          <TabsContent value="currencies" className="mt-4">
            <PriceList prices={livePrices.currencies} />
          </TabsContent>
          <TabsContent value="stocks" className="mt-4">
            <PriceList prices={livePrices.stocks} />
          </TabsContent>
          <TabsContent value="crypto" className="mt-4">
            <PriceList prices={livePrices.crypto} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
