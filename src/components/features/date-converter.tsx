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

  // Dummy conversion logic
  const convertDate = (d: Date, type: 'gts' | 'stg') => {
    if (!d) return 'یک تاریخ انتخاب کنید';
    if (type === 'gts') {
      // Dummy Gregorian to Solar Hijri
      const year = d.getFullYear() - 621;
      const month = (d.getMonth() + 10) % 12 + 1;
      const day = (d.getDate() + 10) % 30 + 1;
      return `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')} (شمسی)`;
    } else {
      // Dummy Solar Hijri to Gregorian
      const year = d.getFullYear() + 621;
      const month = (d.getMonth() + 3) % 12 + 1;
      const day = (d.getDate() + 20) % 30 + 1;
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} (میلادی)`;
    }
  };

  return (
    <Card className="transition-transform transform hover:scale-[1.02] duration-300 ease-in-out">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-6 w-6 ml-2" />
          تبدیل تاریخ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="mb-2 block">نوع تبدیل</Label>
          <RadioGroup defaultValue="gts" onValueChange={(v) => setConversionType(v as 'gts' | 'stg')} className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="gts" id="gts" />
              <Label htmlFor="gts">میلادی به شمسی</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="stg" id="stg" />
              <Label htmlFor="stg">شمسی به میلادی</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label className="mb-2 block">
            {conversionType === 'gts' ? 'تاریخ میلادی را انتخاب کنید' : 'تاریخ شمسی را انتخاب کنید (مثال)'}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}
              >
                <CalendarIcon className="ml-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>یک تاریخ انتخاب کنید</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="text-center bg-muted p-4 rounded-md">
          <p className="text-sm text-muted-foreground">تاریخ تبدیل شده</p>
          <p className="text-lg font-semibold">{convertDate(date!, conversionType)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
