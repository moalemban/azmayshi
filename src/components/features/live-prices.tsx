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
      className={cn(
        'flex items-center text-xs font-medium',
        isPositive ? 'text-green-600' : 'text-red-500'
      )}
    >
      {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
      {isPositive && '+'}
      {(change * 100).toFixed(2)}%
    </span>
  );
};

const PriceList = ({ prices }: { prices: LivePrice[] }) => (
  <ul className="space-y-3">
    {prices.map((item) => (
      <li key={item.name} className="flex justify-between items-center">
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.symbol}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">{item.price}</p>
          <PriceChangeIndicator change={item.change} />
        </div>
      </li>
    ))}
  </ul>
);

export default function LivePrices() {
  return (
    <Card className="transition-transform transform hover:scale-[1.02] duration-300 ease-in-out">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CandlestickChart className="h-6 w-6" />
          Live Prices
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gold">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="gold">Gold</TabsTrigger>
            <TabsTrigger value="currencies">Currencies</TabsTrigger>
            <TabsTrigger value="stocks">Stocks</TabsTrigger>
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
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
