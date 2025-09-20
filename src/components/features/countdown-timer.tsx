"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Pause, Redo, Settings, Hourglass } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


const RectangularProgress = ({
  percentage,
  timeLeftFormatted,
}: {
  percentage: number;
  timeLeftFormatted: string;
}) => {
  let colorClass = 'bg-primary/20';
   if (percentage <= 50) colorClass = 'bg-yellow-400/20';
   if (percentage <= 25) colorClass = 'bg-orange-500/20';
   if (percentage <= 10) colorClass = 'bg-red-500/20';

  return (
    <div className="relative flex items-center justify-center w-full max-w-sm h-32 bg-card/30 rounded-2xl overflow-hidden glass-effect">
      {/* Background Glow */}
      <div className={cn("absolute w-full h-full blur-2xl animate-pulse-slow", colorClass)} />

      {/* Progress bar */}
      <div className="absolute top-0 right-0 h-full bg-gradient-to-l from-primary/50 to-accent/50 transition-all duration-500"
           style={{ width: `${percentage}%` }}
      />
      
      {/* Text container with semi-transparent background */}
      <div className="relative flex flex-col items-center justify-center bg-black/40 p-4 rounded-lg">
        <span className="text-6xl font-display text-cyan-300 drop-shadow-glow tracking-widest text-glow-strong">
          {timeLeftFormatted}
        </span>
      </div>
    </div>
  );
};


export default function CountdownTimer() {
  const [initialTotalSeconds, setInitialTotalSeconds] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(true);

  // Separate state for input fields
  const [inputHours, setInputHours] = useState('0');
  const [inputMinutes, setInputMinutes] = useState('1');
  const [inputSeconds, setInputSeconds] = useState('0');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

   useEffect(() => {
    // This should only run on the client
    audioRef.current = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_2b31b8a1da.mp3');
  }, []);

  const playSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
  }, []);

  const toEnglishDigits = (str: string): string => {
    return str.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
  };

  const toPersianDigits = (str: string): string => {
    return str.replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    if (isRunning) return;
    const englishValue = toEnglishDigits(value);
    const numericValue = englishValue.replace(/[^0-9]/g, '');
    setter(numericValue);
  };
  
   useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft <= 0 && isRunning) {
        setIsRunning(false);
        setIsFinished(true);
        if (timerRef.current) clearInterval(timerRef.current);
        toast({ title: "پایان تایمر!", description: "زمان شما به پایان رسید." });
        playSound();
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft, playSound, toast]);


  const handleStartPause = () => {
    if (isFinished) return;
    
    if (isConfiguring) {
        const h = parseInt(toEnglishDigits(inputHours) || '0', 10);
        const m = parseInt(toEnglishDigits(inputMinutes) || '0', 10);
        const s = parseInt(toEnglishDigits(inputSeconds) || '0', 10);
        const totalSeconds = h * 3600 + m * 60 + s;

        if (totalSeconds <= 0) {
            toast({ title: "خطا", description: "لطفا زمان معتبری را وارد کنید.", variant: "destructive"});
            return;
        }

        setInitialTotalSeconds(totalSeconds);
        setTimeLeft(totalSeconds);
        setIsConfiguring(false);
        setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsFinished(false);
    setTimeLeft(initialTotalSeconds);
  };

  const openSettings = () => {
    setIsRunning(false);
    setIsFinished(false);
    setIsConfiguring(true);

    const h = Math.floor(initialTotalSeconds / 3600);
    const m = Math.floor((initialTotalSeconds % 3600) / 60);
    const s = initialTotalSeconds % 60;
    setInputHours(h.toString());
    setInputMinutes(m.toString());
    setInputSeconds(s.toString());

    setTimeLeft(initialTotalSeconds);
  }
  
  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return {
      hours: toPersianDigits(hours.toString().padStart(2, '0')),
      minutes: toPersianDigits(minutes.toString().padStart(2, '0')),
      seconds: toPersianDigits(seconds.toString().padStart(2, '0')),
    };
  };

  const { hours, minutes, seconds } = formatTime(timeLeft);

  return (
    <CardContent className="flex flex-col gap-6 p-4 items-center justify-center min-h-[450px]">
      
      { isConfiguring ? (
        <Card className="w-full max-w-sm glass-effect">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyan-400 neon-text">
                    <Hourglass className="w-6 h-6" />
                    تنظیم زمان
                </CardTitle>
                <CardDescription>زمان مورد نظر خود را برای شروع شمارش معکوس وارد کنید.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-row-reverse gap-2 items-end p-4">
                    <div className="flex-1 space-y-1 text-center">
                        <Input id="hours-input" value={toPersianDigits(inputHours)} onChange={e => handleInputChange(setInputHours, e.target.value)} className="h-16 w-full text-4xl text-center font-display" placeholder="۰۰" />
                        <Label htmlFor="hours-input" className="text-xs text-muted-foreground">ساعت</Label>
                    </div>
                    <span className='text-4xl font-display text-muted-foreground pb-8'>:</span>
                    <div className="flex-1 space-y-1 text-center">
                        <Input id="minutes-input" value={toPersianDigits(inputMinutes)} onChange={e => handleInputChange(setInputMinutes, e.target.value)} className="h-16 w-full text-4xl text-center font-display" placeholder="۰۱" />
                        <Label htmlFor="minutes-input" className="text-xs text-muted-foreground">دقیقه</Label>
                    </div>
                    <span className='text-4xl font-display text-muted-foreground pb-8'>:</span>
                    <div className="flex-1 space-y-1 text-center">
                        <Input id="seconds-input" value={toPersianDigits(inputSeconds)} onChange={e => handleInputChange(setInputSeconds, e.target.value)} className="h-16 w-full text-4xl text-center font-display" placeholder="۰۰" />
                        <Label htmlFor="seconds-input" className="text-xs text-muted-foreground">ثانیه</Label>
                    </div>
                </div>
            </CardContent>
        </Card>
      ) : (
          <RectangularProgress 
            percentage={(timeLeft / initialTotalSeconds) * 100} 
            timeLeftFormatted={`${hours}:${minutes}:${seconds}`} 
          />
      )}


      <div className="flex justify-center items-center gap-4 w-full max-w-sm mt-4">
        {isConfiguring ? (
            <Button onClick={handleStartPause} size="lg" className="w-full h-14 text-lg neon-btn bg-green-500 hover:bg-green-500/90 text-white shadow-green-500/30 hover:shadow-green-500/50">
                <Play className="ml-2 h-6 w-6"/>
                شروع شمارش
            </Button>
        ) : (
          <div className="flex w-full items-center justify-around gap-2">
            <Button onClick={handleReset} variant="outline" className="h-14 flex-1 glass-btn" disabled={isRunning}>
              <Redo className="h-5 w-5 ml-2" />
              ریست
            </Button>
            <Button onClick={handleStartPause} size="lg" className={cn('h-14 flex-1 text-lg neon-btn', 
                isRunning ? 'bg-yellow-500 hover:bg-yellow-500/90 text-white shadow-yellow-500/30 hover:shadow-yellow-500/50' : 'bg-green-500 hover:bg-green-500/90 text-white shadow-green-500/30 hover:shadow-green-500/50'
            )} disabled={isFinished}>
              {isRunning ? <><Pause className="h-6 w-6 ml-2" /> توقف</> : <><Play className="h-6 w-6 ml-2" /> ادامه</>}
            </Button>
             <Button onClick={openSettings} variant="ghost" size="icon" className="h-14 w-14 text-muted-foreground hover:text-primary">
              <Settings className="h-7 w-7" />
               <span className="sr-only">تنظیمات</span>
            </Button>
          </div>
        )}
      </div>
    </CardContent>
  );
}
