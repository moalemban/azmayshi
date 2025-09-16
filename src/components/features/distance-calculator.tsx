"use client";

import { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { calculateDistance } from '@/ai/flows/calculate-distance-flow';

export default function DistanceCalculator() {
  const [origin, setOrigin] = useState('Tehran');
  const [destination, setDestination] = useState('Shiraz');
  const [distance, setDistance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCalculate = async () => {
    if (!origin || !destination) {
      toast({
        title: 'خطا',
        description: 'لطفاً مبدأ و مقصد را وارد کنید.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setDistance(null);
    
    try {
      const result = await calculateDistance({ origin, destination });
      if (result.distanceKm) {
        setDistance(result.distanceKm);
      } else {
        toast({
            title: 'خطا در محاسبه',
            description: result.error || 'مکان‌های وارد شده معتبر نیستند یا فاصله قابل محاسبه نیست.',
            variant: 'destructive',
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'خطای سرور',
        description: 'مشکلی در ارتباط با سرور به وجود آمد.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div className="space-y-2">
          <Label htmlFor="origin">مبدأ</Label>
          <Input 
            id="origin" 
            value={origin} 
            onChange={(e) => setOrigin(e.target.value)} 
            placeholder="مثال: تهران" 
            className="h-12 text-lg text-center"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="destination">مقصد</Label>
          <Input 
            id="destination" 
            value={destination} 
            onChange={(e) => setDestination(e.target.value)} 
            placeholder="مثال: شیراز"
            className="h-12 text-lg text-center"
          />
        </div>
      </div>
      
      <Button onClick={handleCalculate} disabled={loading} className="w-full h-12">
        {loading ? (
          <>
            <Loader2 className="ml-2 h-5 w-5 animate-spin" />
            در حال محاسبه...
          </>
        ) : (
          <>
            محاسبه فاصله
            <ArrowRight className="mr-2 h-5 w-5" />
          </>
        )}
      </Button>

      {distance !== null && (
        <div className="w-full text-center bg-muted/50 p-4 rounded-lg shadow-inner mt-2">
          <p className="text-lg text-muted-foreground">فاصله هوایی (خط مستقیم)</p>
          <div className="text-3xl font-bold text-primary" dir="rtl">
            <span>{distance.toLocaleString('fa-IR', { maximumFractionDigits: 0 })}</span>
            <span className="text-base font-normal mx-1">کیلومتر</span>
          </div>
        </div>
      )}
    </CardContent>
  );
}
