"use client";

import { useState, useEffect } from 'react';
import { CandlestickChart, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LivePrice, PriceData } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { fetchPrices as fetchPricesFlow } from '@/ai/flows/fetch-prices-flow';

const PriceChangeIndicator = ({ change }: { change: string | null }) => {
  if (!change) return <div className="h-5" />; // Placeholder for alignment

  const isPositive = !change.startsWith('-');
  const isNegative = change.startsWith('-');
  
  // Remove +/- signs for display
  const displayChange = change.replace(/[+-]/, '');

  return (
    <div className={cn("flex items-center text-xs font-mono", isPositive ? "text-green-500" : isNegative ? "text-red-500" : "text-muted-foreground")}>
      <span>{displayChange}</span>
      {isPositive && <ArrowUp className="w-3 h-3 ml-1" />}
      {isNegative && <ArrowDown className="w-3 h-3 ml-1" />}
    </div>
  );
};


const PriceCard = ({ item }: { item: LivePrice }) => (
    <div className="glass-effect rounded-2xl p-2 card-hover w-full flex-shrink-0">
        <div className="flex items-center gap-2">
            <div className="text-2xl">{item.icon}</div>
            <div className="flex-grow text-right">
                <h3 className="text-foreground font-display font-semibold text-xs truncate">{item.name}</h3>
                <div className="text-muted-foreground text-[10px] font-body">{item.symbol}</div>
            </div>
        </div>
        <div className="mt-1.5 text-right">
            <div className="text-base text-foreground font-mono text-glow">{item.price}</div>
             <div className="flex justify-end mt-0.5 h-5">
                {/* Change indicator is currently not supported by the new flow */}
            </div>
        </div>
    </div>
);

const PriceCardSkeleton = () => (
  <div className="glass-effect rounded-2xl p-2 w-full">
    <div className="flex items-center gap-2">
      <Skeleton className="w-7 h-7 rounded-full" />
      <div className="flex-grow space-y-1.5">
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-2.5 w-1/4" />
      </div>
    </div>
    <div className="mt-1.5 space-y-1.5 text-right">
        <Skeleton className="h-5 w-1/2 ml-auto" />
        <Skeleton className="h-5 w-1/4 ml-auto" />
    </div>
  </div>
);

const priceConfig: { [key in keyof PriceData]: Omit<LivePrice, 'price' | 'change'> | null } = {
    Bourse: null,
    GoldOunce: { id: 'GoldOunce', name: 'انس طلا', symbol: 'USD', icon: '🥇' },
    MesghalGold: { id: 'MesghalGold', name: 'مثقال طلا', symbol: 'IRT', icon: '⚖️' },
    Gold18K: { id: 'Gold18K', name: 'طلا ۱۸ عیار', symbol: 'IRT', icon: '⚖️' },
    EmamiCoin: { id: 'EmamiCoin', name: 'سکه امامی', symbol: 'IRT', icon: '🪙' },
    Dollar: { id: 'Dollar', name: 'دلار', symbol: 'IRT', icon: '💵' },
    BrentOil: null,
    USDT: { id: 'USDT', name: 'تتر', symbol: 'IRT', icon: '₮' },
};


export default function LivePrices() {
  const [prices, setPrices] = useState<LivePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const data = await fetchPricesFlow();
      if (!data) throw new Error("No data returned from flow");

      const newPrices: LivePrice[] = Object.entries(data)
        .map(([key, priceValue]) => {
          const config = priceConfig[key as keyof PriceData];
          if (!config || !priceValue) return null;
          
          const priceNumber = Number(priceValue);

          return {
            ...config,
            price: priceNumber.toLocaleString('fa-IR'),
            change: null, // Change is not available from the new source yet
          };
        })
        .filter((p): p is LivePrice => p !== null);

      setPrices(newPrices);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch prices:", error);
      // In case of an error, we can show an empty state or a message
      setPrices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const displayedPrices = loading 
    ? Array(6).fill(null)
    : prices;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-y-2 mb-4">
        <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground flex items-center text-glow">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center ml-3 animate-pulse">
              <CandlestickChart className="w-6 h-6 text-white" />
          </div>
          قیمت‌های لحظه‌ای
        </h2>
        <div className="flex items-center space-x-2 space-x-reverse">
             <Button variant="ghost" size="icon" onClick={fetchPrices} disabled={loading} className="text-muted-foreground">
                <RefreshCw className={cn("h-5 w-5", loading && "animate-spin")} />
             </Button>
            {lastUpdated && (
                <>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                <span className="text-sm text-muted-foreground font-body">
                {loading ? 'در حال بروزرسانی...' : `زنده - ${lastUpdated.toLocaleTimeString('fa-IR')}`}
                </span>
                </>
            )}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => <PriceCardSkeleton key={index} />)
        ) : (
          displayedPrices.map((item) => item ? <PriceCard key={item.id} item={item} /> : null)
        )}
      </div>
    </>
  );
}
