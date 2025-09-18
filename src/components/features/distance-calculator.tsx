"use client";

import { useState, useMemo } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, Check, Map } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { provincialCapitals } from '@/lib/constants';
import { getRoadDistance } from '@/services/distance-service';
import { cn } from '@/lib/utils';

export default function DistanceCalculator() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [originPopover, setOriginPopover] = useState(false);
  const [destinationPopover, setDestinationPopover] = useState(false);

  const distance = useMemo(() => {
    if (!origin || !destination) return null;
    return getRoadDistance(origin, destination);
  }, [origin, destination]);


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
                    {value || "یک شهر انتخاب کنید..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0 glass-effect">
                    <Command>
                        <CommandInput placeholder="جستجوی مرکز استان..." />
                        <CommandEmpty>شهری یافت نشد.</CommandEmpty>
                        <CommandList>
                            <CommandGroup>
                                {provincialCapitals.map((city) => (
                                <CommandItem
                                    key={city}
                                    value={city}
                                    onSelect={(currentValue) => {
                                        onSelect(currentValue === value ? "" : currentValue);
                                        onOpenChange(false);
                                    }}
                                >
                                    <Check
                                        className={cn( "mr-2 h-4 w-4", value === city ? "opacity-100" : "opacity-0" )}
                                    />
                                    {city}
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
      
      {distance !== null ? (
        <div className="w-full text-center bg-muted/50 p-4 rounded-lg shadow-inner mt-2">
          <p className="text-lg text-muted-foreground">فاصله جاده‌ای</p>
          <div className="text-3xl font-bold text-primary" dir="rtl">
            <span>{distance.toLocaleString('fa-IR', { maximumFractionDigits: 0 })}</span>
            <span className="text-base font-normal mx-1">کیلومتر</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center text-muted-foreground h-24 bg-muted/30 rounded-lg">
            <p>لطفا مبدأ و مقصد را انتخاب کنید.</p>
        </div>
      )}
    </CardContent>
  );
}
