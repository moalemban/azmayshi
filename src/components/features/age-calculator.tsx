"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Gift } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { differenceInYears, differenceInMonths, differenceInDays, subYears, subMonths } from 'date-fns';

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState<Date | undefined>();
  const [age, setAge] = useState<{ years: number; months: number; days: number } | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const calculateAge = (date: Date) => {
    const now = new Date();
    const years = differenceInYears(now, date);
    const pastYearDate = subYears(now, years);
    const months = differenceInMonths(pastYearDate, date);
    const pastMonthDate = subMonths(pastYearDate, months);
    const days = differenceInDays(pastMonthDate, date);
    
    setAge({ years, months, days });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setBirthDate(date);
      setPopoverOpen(false);
      calculateAge(date);
    }
  };

  return (
    <Card className="h-full group/card transition-all duration-300 hover:border-primary/50">
       <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover/opacity-100 transition-opacity duration-500 -z-10"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-6 w-6 text-primary" />
          محاسبه سن
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant={'outline'} className={cn('w-full justify-start text-left font-normal h-12 text-base', !birthDate && 'text-muted-foreground')}>
              <CalendarIcon className="ml-2 h-5 w-5" />
              {birthDate ? format(birthDate, 'PPP') : <span>تاریخ تولد خود را انتخاب کنید</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={birthDate}
              onSelect={handleDateSelect}
              captionLayout="dropdown-buttons"
              fromYear={1900}
              toYear={new Date().getFullYear()}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {age ? (
          <div className="w-full text-center bg-background/50 p-4 rounded-lg shadow-inner mt-2">
            <p className="text-lg text-muted-foreground">سن شما</p>
            <div className="text-2xl font-bold text-primary" dir="rtl">
              <span>{age.years}</span>
              <span className="text-base font-normal mx-1">سال و</span>
              <span>{age.months}</span>
              <span className="text-base font-normal mx-1">ماه و</span>
              <span>{age.days}</span>
              <span className="text-base font-normal mx-1">روز</span>
            </div>
          </div>
        ) : (
            <div className="flex items-center justify-center text-muted-foreground h-24 bg-background/30 rounded-lg">
                <p>تاریخ تولد را برای محاسبه انتخاب کنید.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
