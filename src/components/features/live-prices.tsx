"use client";

import React, { useState, useEffect, useRef } from 'react';
import { CandlestickChart, ArrowUp, ArrowDown, RefreshCw, Timer, Globe, Scale, Gem, CircleDollarSign, Coins, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LivePrice, PriceData } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { fetchPrices as fetchPricesFlow } from '@/ai/flows/fetch-prices-flow';

const PriceChangeIndicator = ({ change }: { change: string | null }) => {
  if (!change || change === "0" || change === "۰") return <div className="h-5" />;

  const isPositive = !change.startsWith('-');
  const isNegative = change.startsWith('-');
  
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
    <div className="glass-effect rounded-2xl p-3 card-hover w-full flex-shrink-0">
        <div className="flex items-center gap-2">
            <div className="text-primary w-8 h-8 flex items-center justify-center">
                {React.isValidElement(item.icon) ? React.cloneElement(item.icon, { className: 'w-6 h-6' }) : item.icon}
            </div>
            <div className="flex-grow text-right">
                <h3 className="text-foreground font-display font-semibold text-sm truncate">{item.name}</h3>
                <div className="text-muted-foreground text-[11px] font-body">{item.symbol}</div>
            </div>
        </div>
        <div className="mt-2 text-right">
            <div className="text-lg text-foreground font-display font-bold text-glow">{item.price}</div>
             <div className="flex justify-end mt-1 h-5">
                <PriceChangeIndicator change={item.change} />
            </div>
        </div>
    </div>
);

const PriceCardSkeleton = () => (
  <div className="glass-effect rounded-2xl p-3 w-full">
    <div className="flex items-center gap-2">
      <Skeleton className="w-8 h-8 rounded-full" />
      <div className="flex-grow space-y-1.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
    <div className="mt-2 space-y-2 text-right">
        <Skeleton className="h-5 w-1/2 ml-auto" />
        <Skeleton className="h-5 w-1/4 ml-auto" />
    </div>
  </div>
);

const priceConfig: { [key in keyof Omit<PriceData, 'Bourse' | 'BrentOil'>]: Omit<LivePrice, 'price' | 'change'> | null } = {
    GoldOunce: { id: 'GoldOunce', name: 'انس طلا', symbol: 'USD', icon: <Globe /> },
    MesghalGold: { id: 'MesghalGold', name: 'مثقال طلا', symbol: 'IRT', icon: <Scale /> },
    Gold18K: { id: 'Gold18K', name: 'طلا ۱۸ عیار', symbol: 'IRT', icon: <Gem /> },
    EmamiCoin: { id: 'EmamiCoin', name: 'سکه امامی', symbol: 'IRT', icon: <Coins /> },
    Dollar: { id: 'Dollar', name: 'دلار', symbol: 'IRT', icon: <CircleDollarSign /> },
    USDT: { id: 'USDT', name: 'تتر', symbol: 'IRT', icon: <Bot /> },
};


export default function LivePrices() {
  const [prices, setPrices] = useState<LivePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const [isCooldown, setIsCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const cooldownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const COOLDOWN_SECONDS = 30;

  const fetchPrices = async () => {
    setLoading(true);
    setIsCooldown(true);
    setCooldownTime(COOLDOWN_SECONDS);

    try {
      const data = await fetchPricesFlow();
      if (!data) throw new Error("No data returned from flow");

      const newPrices: LivePrice[] = Object.entries(data)
        .map(([key, priceData]) => {
          const configKey = key as keyof Omit<PriceData, 'Bourse' | 'BrentOil'>;
          const config = priceConfig[configKey];
          
          if (!config || !priceData?.price) return null;
          
          const priceNumber = Number(priceData.price);

          return {
            ...config,
            price: priceNumber.toLocaleString('fa-IR'),
            change: priceData.change,
          };
        })
        .filter((p): p is LivePrice => p !== null);

      setPrices(newPrices);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch prices:", error);
      setPrices([]);
    } finally {
      setLoading(false);
      cooldownIntervalRef.current = setInterval(() => {
        setCooldownTime(prev => prev - 1);
      }, 1000);
      setTimeout(() => {
          setIsCooldown(false);
          if (cooldownIntervalRef.current) {
            clearInterval(cooldownIntervalRef.current);
          }
      }, COOLDOWN_SECONDS * 1000);
    }
  };

  useEffect(() => {
    fetchPrices();
    
    return () => {
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current);
      }
    };
  }, []);

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
             <Button variant="ghost" size="sm" onClick={fetchPrices} disabled={loading || isCooldown} className="text-muted-foreground w-28">
                {loading ? <RefreshCw className={cn("h-5 w-5 animate-spin")} /> 
                         : isCooldown ? <><Timer className="h-5 w-5 ml-2" /> {cooldownTime} ثانیه</>
                         : <><RefreshCw className="h-5 w-5 ml-2" /> به‌روزرسانی</>
                }
             </Button>
            {lastUpdated && !loading && (
                <>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                <span className="text-sm text-muted-foreground font-body">
                 زنده - {lastUpdated.toLocaleTimeString('fa-IR')}
                </span>
                </>
            )}
             {loading && (
                <span className="text-sm text-muted-foreground font-body">
                در حال بروزرسانی...
                </span>
            )}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {loading && prices.length === 0 ? (
          Array.from({ length: 6 }).map((_, index) => <PriceCardSkeleton key={index} />)
        ) : (
          prices.map((item) => item ? <PriceCard key={item.id} item={item} /> : null)
        )}
      </div>
    </>
  );
}
