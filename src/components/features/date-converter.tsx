"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export default function DateConverter() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [conversionType, setConversionType] = useState<'gts' | 'stg'>('gts');
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Dummy conversion logic
  const convertDate = (d: Date, type: 'gts' | 'stg') => {
    if (!d) return 'یک تاریخ انتخاب کنید';
    
    try {
      if (type === 'gts') {
        return new Intl.DateTimeFormat('fa-IR-u-nu-latn', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long'
        }).format(d);
      } else {
        // This is just a simulation, not an actual conversion
        const year = d.getFullYear() + 621;
        const month = (d.getMonth() + 3) % 12 + 1;
        const day = (d.getDate() + 20) % 30 + 1;
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} (میلادی)`;
      }
    } catch (error) {
        return 'تاریخ نامعتبر';
    }
  };

  return (
    <Card className="h-full group/card">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent group-hover:from-primary/20 transition-all duration-500 -z-10"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-primary" />
          تبدیل تاریخ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 flex flex-col justify-between h-full">
        <div className="space-y-4">
          <div>
            <Label className="mb-3 block">نوع تبدیل</Label>
            <RadioGroup defaultValue="gts" onValueChange={(v) => setConversionType(v as 'gts' | 'stg')} className="flex gap-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="gts" id="gts" />
                <Label htmlFor="gts">میلادی به شمسی</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="stg" id="stg" />
                <Label htmlFor="stg">شمسی به میلادی</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn('w-full justify-start text-left font-normal h-12 text-base', !date && 'text-muted-foreground')}
                >
                  <CalendarIcon className="ml-2 h-5 w-5" />
                  {date ? format(date, 'PPP') : <span>یک تاریخ انتخاب کنید</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar 
                  mode="single" 
                  selected={date} 
                  onSelect={(d) => {
                    setDate(d);
                    setPopoverOpen(false);
                  }} 
                  initialFocus 
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="text-center bg-background/50 p-4 rounded-lg shadow-inner">
          <p className="text-sm text-muted-foreground">تاریخ تبدیل شده</p>
          <p className="text-xl font-semibold text-primary">{convertDate(date!, conversionType)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
