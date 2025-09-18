"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Pause, Redo } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const CircularProgress = ({
  percentage,
  timeLeftFormatted,
}: {
  percentage: number;
  timeLeftFormatted: string;
}) => {
  const radius = 90;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let colorClass = 'text-primary';
  if (percentage < 25) colorClass = 'text-yellow-500';
  if (percentage < 10) colorClass = 'text-red-500';
  
  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        <circle
          stroke="hsl(var(--muted))"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          className={cn('transition-all duration-500', colorClass)}
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
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={cn("text-5xl font-mono tracking-tighter", colorClass)}>
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
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const handleInputChange = (field: 'hours' | 'minutes' | 'seconds', value: string) => {
    if (isRunning) return;
    const numValue = parseInt(value, 10) || 0;
    
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
        if (timerRef.current) clearInterval(timerRef.current);
        toast({ title: "پایان تایمر!", description: "زمان شما به پایان رسید." });
        try {
            // Play a sound, handle potential browser restrictions
            new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_2b31b8a1da.mp3').play().catch(e => console.log("Audio play failed"));
        } catch(e) {
            console.error("Could not play audio", e);
        }
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
  }, [isRunning, timeLeft, toast]);


  const handleStartPause = () => {
    if (timeLeft > 0) {
      setIsRunning(!isRunning);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialTotalSeconds);
  };
  
  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return {
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
    };
  };

  const { hours, minutes, seconds } = formatTime(timeLeft);
  const { hours: initialH, minutes: initialM, seconds: initialS } = formatTime(initialTotalSeconds);

  return (
    <div className="flex flex-col gap-6 p-4 items-center">
      
      {isRunning || timeLeft < initialTotalSeconds ? (
          <CircularProgress 
            percentage={(timeLeft / initialTotalSeconds) * 100} 
            timeLeftFormatted={`${hours}:${minutes}:${seconds}`} 
          />
      ) : (
        <div className="flex flex-row-reverse gap-2 items-end p-4">
            <div className="flex-1 space-y-1 text-center">
                <Input id="hours-input" type="number" placeholder="00" value={initialH} onChange={e => handleInputChange('hours', e.target.value)} className="h-20 w-24 text-5xl text-center font-mono" min={0}/>
                <Label htmlFor="hours-input" className="text-xs text-muted-foreground">ساعت</Label>
            </div>
            <span className='text-5xl font-mono text-muted-foreground pb-8'>:</span>
            <div className="flex-1 space-y-1 text-center">
                <Input id="minutes-input" type="number" placeholder="01" value={initialM} onChange={e => handleInputChange('minutes', e.target.value)} className="h-20 w-24 text-5xl text-center font-mono" max={59} min={0}/>
                <Label htmlFor="minutes-input" className="text-xs text-muted-foreground">دقیقه</Label>
            </div>
            <span className='text-5xl font-mono text-muted-foreground pb-8'>:</span>
            <div className="flex-1 space-y-1 text-center">
                <Input id="seconds-input" type="number" placeholder="00" value={initialS} onChange={e => handleInputChange('seconds', e.target.value)} className="h-20 w-24 text-5xl text-center font-mono" max={59} min={0}/>
                <Label htmlFor="seconds-input" className="text-xs text-muted-foreground">ثانیه</Label>
            </div>
        </div>
      )}


      <div className="flex justify-center items-center gap-4 w-full max-w-sm">
        <Button onClick={handleReset} variant="outline" size="icon" className="h-16 w-16 rounded-full" disabled={isRunning && timeLeft > 0}>
          <Redo className="h-7 w-7" />
        </Button>
        <Button onClick={handleStartPause} size="lg" className={`h-20 w-20 rounded-full text-lg ${isRunning ? 'bg-yellow-500 hover:bg-yellow-600 text-yellow-50' : 'bg-green-500 hover:bg-green-600 text-green-50'}`}>
          {isRunning ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
        </Button>
        <div className='w-16'></div>
      </div>
    </div>
  );
}
