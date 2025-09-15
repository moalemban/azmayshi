"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CandlestickChart, ArrowUp, ArrowDown } from 'lucide-react';
import { livePrices } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { LivePrice } from '@/lib/types';

const PriceChangeIndicator = ({ change }: { change: number }) => {
  const isPositive = change > 0;
  if (change === 0) return null;

  return (
    <span
      dir="ltr"
      className={cn(
        'flex items-center text-xs font-medium tabular-nums rounded-full px-2 py-0.5',
        isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
      )}
    >
      {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
      <span className="mr-1">{isPositive && '+'}
      {(change * 100).toLocaleString('fa-IR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
      </span>
    </span>
  );
};

const PriceCard = ({ item, icon }: { item: LivePrice, icon: string }) => (
    <div className="glass-effect rounded-2xl p-4 sm:p-5 text-center card-hover">
        <div className="text-4xl mb-3">{icon}</div>
        <h3 className="text-white font-display font-bold mb-2 text-md sm:text-lg">{item.name}</h3>
        <div className="text-xl sm:text-2xl lg:text-3xl text-white mb-2 font-mono text-glow">{Number(item.price.replace(/,/g, '')).toLocaleString('fa-IR')}</div>
        <div className="flex justify-center items-center gap-2">
            <PriceChangeIndicator change={item.change} />
            <div className="text-white/60 text-xs font-body">{item.symbol}</div>
        </div>
    </div>
);


export default function LivePrices() {
  return (
    <>
      <h2 className="text-xl sm:text-2xl font-display font-bold text-white mb-6 flex items-center text-glow">
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center ml-3 animate-pulse">
            <CandlestickChart className="w-6 h-6 text-white" />
        </div>
        قیمت‌های لحظه‌ای
        <div className="mr-auto flex items-center space-x-2 space-x-reverse">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
            <span className="text-sm text-white/80 font-body">زنده</span>
        </div>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <PriceCard item={livePrices.gold[0]} icon="🥇" />
        <PriceCard item={livePrices.gold[1]} icon="🪙" />
        <PriceCard item={livePrices.currencies[0]} icon="💵" />
        <PriceCard item={livePrices.crypto[0]} icon="₿" />
      </div>
    </>
  );
}
