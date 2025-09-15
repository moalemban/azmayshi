"use client";

import { useState, useEffect } from 'react';
import { CandlestickChart, ArrowUp, ArrowDown, RefreshCw, Briefcase, Droplet, Mountain, Coins, Banknote, CircleDollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LivePrice, PriceData } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { fetchPrices as fetchPricesFlow } from '@/ai/flows/fetch-prices-flow';

const PriceChangeIndicator = ({ change }: { change: number }) => {
  // The new source does not provide change percentage easily, so we hide this for now.
  // We can add it back later if we enhance the flow.
  return null;
};

const PriceCard = ({ item }: { item: LivePrice }) => (
    <div className="glass-effect rounded-2xl p-3 card-hover w-full">
        <div className="flex items-center gap-3">
            <div className="text-3xl">{item.icon}</div>
            <div className="flex-grow text-right">
                <h3 className="text-foreground font-display font-semibold text-sm truncate">{item.name}</h3>
                <div className="text-muted-foreground text-xs font-body">{item.symbol}</div>
            </div>
        </div>
        <div className="mt-2 text-right">
            <div className="text-xl text-foreground font-mono text-glow">{item.price}</div>
             <div className="flex justify-end mt-1 h-5">
                <PriceChangeIndicator change={item.change} />
            </div>
        </div>
    </div>
);

const PriceCardSkeleton = () => (
  <div className="glass-effect rounded-2xl p-3 w-full">
    <div className="flex items-center gap-3">
      <Skeleton className="w-8 h-8 rounded-full" />
      <div className="flex-grow space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
    <div className="mt-2 space-y-2 text-right">
        <Skeleton className="h-6 w-1/2 ml-auto" />
        <Skeleton className="h-5 w-1/4 ml-auto" />
    </div>
  </div>
);

const priceConfig: { [key in keyof PriceData]: Omit<LivePrice, 'price' | 'change'> } = {
    Bourse: { id: 'Bourse', name: 'بورس', symbol: 'واحد', icon: '📊' },
    GoldOunce: { id: 'GoldOunce', name: 'انس طلا', symbol: 'USD', icon: '🥇' },
    MesghalGold: { id: 'MesghalGold', name: 'مثقال طلا', symbol: 'IRT', icon: '⚖️' },
    Gold18K: { id: 'Gold18K', name: 'طلا ۱۸ عیار', symbol: 'IRT', icon: '⚖️' },
    EmamiCoin: { id: 'EmamiCoin', name: 'سکه امامی', symbol: 'IRT', icon: '🪙' },
    Dollar: { id: 'Dollar', name: 'دلار', symbol: 'IRT', icon: '💵' },
    BrentOil: { id: 'BrentOil', name: 'نفت برنت', symbol: 'USD', icon: '🛢️' },
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
          return {
            ...config,
            price: Number(priceValue).toLocaleString('fa-IR'),
            change: 0, // Change is not available from the new source
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
    ? Array(8).fill(null)
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
            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
            <span className="text-sm text-muted-foreground font-body">
              {loading ? 'در حال بروزرسانی...' : (lastUpdated ? `زنده - ${lastUpdated.toLocaleTimeString('fa-IR')}`: 'خطا در بروزرسانی')}
            </span>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => <PriceCardSkeleton key={index} />)
        ) : (
          displayedPrices.map((item) => item ? <PriceCard key={item.id} item={item} /> : null)
        )}
      </div>
    </>
  );
}
