"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Pause, Redo, Settings } from 'lucide-react';
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


const CircularProgress = ({
  percentage,
  timeLeftFormatted,
}: {
  percentage: number;
  timeLeftFormatted: string;
}) => {
  const radius = 100;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let colorClass = 'text-primary';
   if (percentage <= 50) colorClass = 'text-yellow-400';
   if (percentage <= 25) colorClass = 'text-orange-500';
   if (percentage <= 10) colorClass = 'text-red-500';
  
  return (
    <div className="relative flex items-center justify-center w-72 h-72">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        {/* Background Circle */}
        <circle
          stroke="hsl(var(--muted) / 0.2)"
          fill="hsl(var(--background) / 0.3)"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Foreground Circle (Progress) */}
        <circle
          className={cn("transition-all duration-300", colorClass)}
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
         {/* Inner Glow */}
        <circle
          className={cn("transition-colors duration-300", colorClass)}
          fill="currentColor"
          r={normalizedRadius - stroke}
          cx={radius}
          cy={radius}
          style={{ filter: `blur(20px)`, opacity: 0.3 }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={cn("text-7xl font-display font-bold tracking-tighter text-glow-strong", colorClass)}>
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

  const handleInputChange = (field: 'hours' | 'minutes' | 'seconds', value: string) => {
    if (isRunning) return;
    const numValue = parseInt(value.replace(/[^۰-۹]/g, ''), 10) || 0;
    
    const currentHours = Math.floor(initialTotalSeconds / 3600);
    const currentMinutes = Math.floor((initialTotalSeconds % 3600) / 60);
    const currentSeconds = initialTotalSeconds % 60;

    let newTotalSeconds = 0;
    if (field === 'hours') newTotalSeconds = numValue * 3600 + currentMinutes * 60 + currentSeconds;
    if (field === 'minutes') newTotalSeconds = currentHours * 3600 + numValue * 60 + currentSeconds;
    if (field === 'seconds') newTotalSeconds = currentHours * 3600 + currentMinutes * 60 + numValue;
    
    setInitialTotalSeconds(newTotalSeconds);
    setTimeLeft(newTotalSeconds);
  };
  
   useEffect(() => {
    if (isRunning) {
      if (timeLeft <= 0) {
        setIsRunning(false);
        setIsFinished(true);
        if (timerRef.current) clearInterval(timerRef.current);
        toast({ title: "پایان تایمر!", description: "زمان شما به پایان رسید." });
        playSound();
        return;
      }
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft, playSound, toast]);


  const handleStartPause = () => {
    if (isFinished) return;
    if (isConfiguring) {
        setIsConfiguring(false);
    }
    if (timeLeft > 0) {
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
    setTimeLeft(initialTotalSeconds);
  }
  
  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return {
      hours: hours.toLocaleString('fa-IR', { minimumIntegerDigits: 2 }),
      minutes: minutes.toLocaleString('fa-IR', { minimumIntegerDigits: 2 }),
      seconds: seconds.toLocaleString('fa-IR', { minimumIntegerDigits: 2 }),
    };
  };

  const { hours, minutes, seconds } = formatTime(timeLeft);
  
  const getInputHours = (totalSeconds: number) => Math.floor(totalSeconds / 3600);
  const getInputMinutes = (totalSeconds: number) => Math.floor((totalSeconds % 3600) / 60);
  const getInputSeconds = (totalSeconds: number) => totalSeconds % 60;

  return (
    <CardContent className="flex flex-col gap-6 p-4 items-center justify-center min-h-[450px]">
      
      { isConfiguring ? (
        <Card className="w-full max-w-sm glass-effect">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Settings className="w-6 h-6 text-primary"/>
                    تنظیم زمان
                </CardTitle>
                <CardDescription>زمان مورد نظر خود را برای شروع شمارش معکوس وارد کنید.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-row-reverse gap-2 items-end p-4">
                    <div className="flex-1 space-y-1 text-center">
                        <Input id="hours-input" type="number" placeholder="۰۰" value={getInputHours(initialTotalSeconds).toLocaleString('fa-IR', { useGrouping: false })} onChange={e => handleInputChange('hours', e.target.value)} className="h-16 w-full text-4xl text-center font-display" min={0}/>
                        <Label htmlFor="hours-input" className="text-xs text-muted-foreground">ساعت</Label>
                    </div>
                    <span className='text-4xl font-display text-muted-foreground pb-8'>:</span>
                    <div className="flex-1 space-y-1 text-center">
                        <Input id="minutes-input" type="number" placeholder="۰۱" value={getInputMinutes(initialTotalSeconds).toLocaleString('fa-IR', { useGrouping: false })} onChange={e => handleInputChange('minutes', e.target.value)} className="h-16 w-full text-4xl text-center font-display" max={59} min={0}/>
                        <Label htmlFor="minutes-input" className="text-xs text-muted-foreground">دقیقه</Label>
                    </div>
                    <span className='text-4xl font-display text-muted-foreground pb-8'>:</span>
                    <div className="flex-1 space-y-1 text-center">
                        <Input id="seconds-input" type="number" placeholder="۰۰" value={getInputSeconds(initialTotalSeconds).toLocaleString('fa-IR', { useGrouping: false })} onChange={e => handleInputChange('seconds', e.target.value)} className="h-16 w-full text-4xl text-center font-display" max={59} min={0}/>
                        <Label htmlFor="seconds-input" className="text-xs text-muted-foreground">ثانیه</Label>
                    </div>
                </div>
            </CardContent>
        </Card>
      ) : (
          <CircularProgress 
            percentage={(timeLeft / initialTotalSeconds) * 100} 
            timeLeftFormatted={`${hours}:${minutes}:${seconds}`} 
          />
      )}


      <div className="flex justify-center items-center gap-4 w-full max-w-sm mt-4">
        {isConfiguring ? (
            <Button onClick={handleStartPause} size="lg" className="w-full h-14 text-lg bg-green-500 hover:bg-green-600 text-green-50" disabled={isFinished || initialTotalSeconds <= 0}>
                <Play className="ml-2 h-6 w-6"/>
                شروع شمارش
            </Button>
        ) : (
          <div className="flex w-full items-center justify-around gap-2">
            <Button onClick={handleReset} variant="outline" className="h-14 flex-1" disabled={isRunning}>
              <Redo className="h-5 w-5 ml-2" />
              ریست
            </Button>
            <Button onClick={handleStartPause} size="lg" className={cn('h-14 flex-1 text-lg shadow-lg', 
                isRunning ? 'bg-yellow-500 hover:bg-yellow-600 text-yellow-50 animate-pulse-slow' : 'bg-green-500 hover:bg-green-600 text-green-50'
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
