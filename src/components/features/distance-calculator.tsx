"use client";

import { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2, Check, ChevronsUpDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { calculateDistance } from '@/ai/flows/calculate-distance-flow';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { iranCities } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function DistanceCalculator() {
  const [origin, setOrigin] = useState('Tehran');
  const [destination, setDestination] = useState('Shiraz');
  const [distance, setDistance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [originPopover, setOriginPopover] = useState(false);
  const [destinationPopover, setDestinationPopover] = useState(false);
  const { toast } = useToast();

  const handleCalculate = async () => {
    if (!origin || !destination) {
      toast({
        title: 'خطا',
        description: 'لطفاً مبدأ و مقصد را انتخاب کنید.',
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

  const CitySelector = ({ value, onSelect, open, onOpenChange, title } : { value: string, onSelect: (val: string) => void, open: boolean, onOpenChange: (open: boolean) => void, title: string }) => {
    return (
        <div className="space-y-2">
            <p className='text-sm font-medium text-muted-foreground pr-1'>{title}</p>
            <Popover open={open} onOpenChange={onOpenChange}>
                <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-12 text-base"
                >
                    {value ? iranCities.find((city) => city.value === value)?.label : "یک شهر انتخاب کنید..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0 glass-effect">
                    <Command>
                        <CommandInput placeholder="جستجوی شهر..." />
                        <CommandEmpty>شهری یافت نشد.</CommandEmpty>
                        <CommandList>
                            <CommandGroup>
                                {iranCities.map((city) => (
                                <CommandItem
                                    key={city.value}
                                    value={city.value}
                                    onSelect={(currentValue) => {
                                        onSelect(currentValue === value ? "" : currentValue);
                                        onOpenChange(false);
                                    }}
                                >
                                    <Check
                                        className={cn( "mr-2 h-4 w-4", value === city.value ? "opacity-100" : "opacity-0" )}
                                    />
                                    {city.label}
                                </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
  };

  return (
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <CitySelector value={origin} onSelect={setOrigin} open={originPopover} onOpenChange={setOriginPopover} title="مبدأ" />
        <CitySelector value={destination} onSelect={setDestination} open={destinationPopover} onOpenChange={setDestinationPopover} title="مقصد" />
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
