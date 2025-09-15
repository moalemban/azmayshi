"use client";

import { useState, useEffect } from 'react';
import { CandlestickChart, ArrowUp, ArrowDown } from 'lucide-react';
import { livePrices as staticPrices } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { LivePrice } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const PriceChangeIndicator = ({ change }: { change: number }) => {
  const isPositive = change > 0;
  if (change === 0) return null;

  return (
    <span
      dir="ltr"
      className={cn(
        'flex items-center text-xs font-medium tabular-nums rounded-full px-2 py-0.5',
        isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
      )}
    >
      {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
      <span className="ml-1">{isPositive && '+'}
      {(change * 100).toLocaleString('fa-IR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
      </span>
    </span>
  );
};

const PriceCard = ({ item }: { item: LivePrice }) => (
    <div className="glass-effect rounded-2xl p-4 sm:p-5 text-center card-hover">
        <div className="text-4xl mb-3">{item.icon}</div>
        <h3 className="text-foreground font-display font-bold mb-2 text-md sm:text-lg">{item.name}</h3>
        <div className="text-xl sm:text-2xl lg:text-3xl text-foreground mb-2 font-mono text-glow">{Number(item.price.replace(/,/g, '')).toLocaleString('fa-IR')}</div>
        <div className="flex justify-center items-center gap-2">
            <PriceChangeIndicator change={item.change} />
            <div className="text-muted-foreground text-xs font-body">{item.symbol}</div>
        </div>
    </div>
);

const PriceCardSkeleton = () => (
  <div className="glass-effect rounded-2xl p-4 sm:p-5 text-center">
    <Skeleton className="w-10 h-10 rounded-full mx-auto mb-3" />
    <Skeleton className="h-5 w-3/4 mx-auto mb-2" />
    <Skeleton className="h-8 w-1/2 mx-auto mb-2" />
    <Skeleton className="h-4 w-1/4 mx-auto" />
  </div>
);


export default function LivePrices() {
  const [prices, setPrices] = useState<LivePrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,gold&vs_currencies=usd,irr&include_24hr_change=true');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        const newPrices: LivePrice[] = [
          {
            id: 'gold',
            name: 'انس طلا',
            price: data.gold.usd.toString(),
            change: data.gold.usd_24h_change / 100,
            symbol: 'USD',
            icon: '🥇'
          },
          ...staticPrices.gold,
          {
            id: 'usd-market',
            name: 'دلار (تتر)',
            price: (data.tether.irr / 10).toString(),
            change: data.tether.irr_24h_change / 100,
            symbol: 'IRT',
            icon: '💵'
          },
          {
            id: 'bitcoin',
            name: 'بیت‌کوین',
            price: data.bitcoin.usd.toString(),
            change: data.bitcoin.usd_24h_change / 100,
            symbol: 'USD',
            icon: '₿'
          },
        ];
        
        setPrices(newPrices);
      } catch (error) {
        console.error("Failed to fetch prices:", error);
        // In case of error, you might want to set some default or cached prices
        // For now, we'll just show the static prices
        setPrices([...staticPrices.gold, ...staticPrices.currencies.slice(0,1), ...staticPrices.crypto.slice(0,1)]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  const displayedPrices = loading ? [] : [prices[0], staticPrices.gold[0], prices[2], prices[3]];

  return (
    <>
      <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-6 flex items-center text-glow">
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center ml-3 animate-pulse">
            <CandlestickChart className="w-6 h-6 text-white" />
        </div>
        قیمت‌های لحظه‌ای
        <div className="mr-auto flex items-center space-x-2 space-x-reverse">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
            <span className="text-sm text-muted-foreground font-body">زنده</span>
        </div>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {loading ? (
          <>
            <PriceCardSkeleton />
            <PriceCardSkeleton />
            <PriceCardSkeleton />
            <PriceCardSkeleton />
          </>
        ) : (
          displayedPrices.map(item => item && <PriceCard key={item.id} item={item} />)
        )}
      </div>
    </>
  );
}
