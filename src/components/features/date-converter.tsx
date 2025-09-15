"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, CalendarDays, ArrowRightLeft } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { jalaliToGregorian, gregorianToJalali } from '@/lib/date-converter';

type ConversionMode = 'gregorian-to-shamsi' | 'shamsi-to-gregorian';

export default function DateConverter() {
  const [mode, setMode] = useState<ConversionMode>('gregorian-to-shamsi');
  
  const [gregorianDate, setGregorianDate] = useState<Date | undefined>(new Date());
  const [gregorianPopoverOpen, setGregorianPopoverOpen] = useState(false);

  const [shamsiYear, setShamsiYear] = useState(gregorianToJalali(new Date()).jy);
  const [shamsiMonth, setShamsiMonth] = useState(gregorianToJalali(new Date()).jm);
  const [shamsiDay, setShamsiDay] = useState(gregorianToJalali(new Date()).jd);
  
  const [convertedDate, setConvertedDate] = useState('');
  const [convertedWeekday, setConvertedWeekday] = useState('');

  const performConversion = () => {
    try {
      if (mode === 'gregorian-to-shamsi' && gregorianDate) {
        const { jy, jm, jd } = gregorianToJalali(gregorianDate);
        const weekday = new Intl.DateTimeFormat('fa-IR', { weekday: 'long' }).format(gregorianDate);
        setConvertedDate(`${jy} / ${jm} / ${jd}`);
        setConvertedWeekday(weekday);
      } else if (mode === 'shamsi-to-gregorian') {
        if(shamsiYear && shamsiMonth && shamsiDay && shamsiYear > 0 && shamsiMonth > 0 && shamsiDay > 0) {
          const { gy, gm, gd } = jalaliToGregorian(shamsiYear, shamsiMonth, shamsiDay);
          const converted = new Date(gy, gm - 1, gd);
          const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(converted);
          setConvertedDate(format(converted, 'PPP'));
          setConvertedWeekday(weekday);
        } else {
            setConvertedDate('تاریخ شمسی را کامل وارد کنید');
            setConvertedWeekday('');
        }
      }
    } catch (e) {
      setConvertedDate('تاریخ نامعتبر است');
      setConvertedWeekday('');
    }
  };

  useEffect(() => {
    performConversion();
  }, [mode, gregorianDate, shamsiYear, shamsiMonth, shamsiDay]);


  const handleDateSelect = (d: Date | undefined) => {
    if (!d) return;
    setGregorianDate(d);
    setGregorianPopoverOpen(false);
  };
  
  const swapConversion = () => {
    setMode(prev => prev === 'gregorian-to-shamsi' ? 'shamsi-to-gregorian' : 'gregorian-to-shamsi');
  }

  return (
    <Card className="glass-effect h-full card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-white">
          <CalendarDays className="h-6 w-6 text-purple-400" />
          تبدیل تاریخ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col justify-between h-[calc(100%-80px)]">
        
        <div className='flex flex-col items-center gap-2'>
            <div>
              <Label className='text-sm font-medium text-white/70'>{mode === 'gregorian-to-shamsi' ? 'تاریخ میلادی' : 'تاریخ شمسی'}</Label>
              {mode === 'gregorian-to-shamsi' ? (
                  <Popover open={gregorianPopoverOpen} onOpenChange={setGregorianPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button variant={'outline'} className={cn('w-full justify-start text-left font-normal h-12 text-base bg-black/20 border-white/20 text-white', !gregorianDate && 'text-white/70')} >
                        <CalendarIcon className="ml-2 h-5 w-5" />
                        {gregorianDate ? format(gregorianDate, 'PPP') : <span>یک تاریخ انتخاب کنید</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 glass-effect" align="start">
                      <Calendar 
                        mode="single" 
                        selected={gregorianDate} 
                        onSelect={handleDateSelect}
                        captionLayout="dropdown-buttons"
                        fromYear={1900}
                        toYear={new Date().getFullYear() + 10}
                        initialFocus />
                    </PopoverContent>
                  </Popover>
              ) : (
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2" dir="ltr">
                        <div className="flex-1 space-y-1">
                            <Label htmlFor="shamsi-day" className="text-xs text-white/70">روز</Label>
                            <Input id="shamsi-day" type="number" placeholder="۲" value={shamsiDay} onChange={e => setShamsiDay(parseInt(e.target.value))} className="h-12 text-center bg-black/20 text-white border-white/20" max={31} min={1}/>
                        </div>
                        <div className="flex-1 space-y-1">
                            <Label htmlFor="shamsi-month" className="text-xs text-white/70">ماه</Label>
                            <Input id="shamsi-month" type="number" placeholder="۸" value={shamsiMonth} onChange={e => setShamsiMonth(parseInt(e.target.value))} className="h-12 text-center bg-black/20 text-white border-white/20" max={12} min={1}/>
                        </div>
                        <div className="flex-1 space-y-1">
                            <Label htmlFor="shamsi-year" className="text-xs text-white/70">سال</Label>
                            <Input id="shamsi-year" type="number" placeholder="۱۳۷۵" value={shamsiYear} onChange={e => setShamsiYear(parseInt(e.target.value))} className="h-12 text-center bg-black/20 text-white border-white/20" />
                        </div>
                    </div>
                </div>
              )}
            </div>

            <Button variant="ghost" size="icon" className="shrink-0 text-white/70 hover:bg-white/10" onClick={swapConversion}>
                <ArrowRightLeft className="h-5 w-5 transition-transform group-hover/card:rotate-180 duration-300" />
            </Button>
            
            <div className="w-full text-center bg-black/20 p-4 rounded-lg shadow-inner">
                <p className="text-sm text-white/70">{mode === 'gregorian-to-shamsi' ? 'معادل شمسی' : 'معادل میلادی'}</p>
                <p className="text-xl font-semibold text-primary">{convertedWeekday}</p>
                <p className="text-2xl font-bold text-primary" dir="ltr">{convertedDate}</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
