"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Pause, Redo } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CountdownTimer() {
  const [initialTime, setInitialTime] = useState({ hours: 0, minutes: 1, seconds: 0 });
  const [timeLeft, setTimeLeft] = useState(60); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isRunning) {
      if (timeLeft <= 0) {
        setIsRunning(false);
        toast({ title: "پایان تایمر!", description: "زمان شما به پایان رسید." });
        // Optional: Play a sound
        // new Audio('/alert.mp3').play();
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

  const handleInputChange = (field: 'hours' | 'minutes' | 'seconds', value: string) => {
    if (isRunning) return;
    const numValue = parseInt(value, 10);
    const newTime = { ...initialTime, [field]: isNaN(numValue) ? 0 : numValue };
    setInitialTime(newTime);
    setTimeLeft(newTime.hours * 3600 + newTime.minutes * 60 + newTime.seconds);
  };

  const handleStartPause = () => {
    if (timeLeft > 0) {
      setIsRunning(!isRunning);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialTime.hours * 3600 + initialTime.minutes * 60 + initialTime.seconds);
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

  return (
    <div className="flex flex-col gap-6 p-6 items-center">
      
      {isRunning ? (
          <div className="text-center bg-muted/50 p-4 rounded-lg shadow-inner w-full" dir="ltr">
            <p className="text-6xl font-mono text-primary tracking-wider text-glow">
              {hours}:{minutes}:{seconds}
            </p>
          </div>
      ) : (
        <div className="flex flex-row-reverse gap-2 items-end">
            <div className="flex-1 space-y-1">
                <Label htmlFor="seconds-input" className="text-xs text-muted-foreground">ثانیه</Label>
                <Input id="seconds-input" type="number" placeholder="00" value={initialTime.seconds} onChange={e => handleInputChange('seconds', e.target.value)} className="h-14 text-2xl text-center" max={59} min={0}/>
            </div>
            <div className="flex-1 space-y-1">
                <Label htmlFor="minutes-input" className="text-xs text-muted-foreground">دقیقه</Label>
                <Input id="minutes-input" type="number" placeholder="01" value={initialTime.minutes} onChange={e => handleInputChange('minutes', e.target.value)} className="h-14 text-2xl text-center" max={59} min={0}/>
            </div>
            <div className="flex-1 space-y-1">
                <Label htmlFor="hours-input" className="text-xs text-muted-foreground">ساعت</Label>
                <Input id="hours-input" type="number" placeholder="00" value={initialTime.hours} onChange={e => handleInputChange('hours', e.target.value)} className="h-14 text-2xl text-center" min={0}/>
            </div>
        </div>
      )}


      <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
        <Button onClick={handleStartPause} size="lg" className={`h-14 text-lg ${isRunning ? 'bg-yellow-500 hover:bg-yellow-600 text-yellow-50' : 'bg-green-500 hover:bg-green-600 text-green-50'}`}>
          {isRunning ? <Pause className="ml-2" /> : <Play className="ml-2" />}
          {isRunning ? 'توقف' : 'شروع'}
        </Button>
        <Button onClick={handleReset} variant="destructive" size="lg" className="h-14 text-lg">
          <Redo className="ml-2" />
          ریست
        </Button>
      </div>
    </div>
  );
}

    