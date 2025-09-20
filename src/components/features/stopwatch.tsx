"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Timer, Play, Pause, History, Redo } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const timerRef = useRef<number | null>(null);
  const lastLapTimeRef = useRef(0);

  const formatTime = (timeInMs: number) => {
    const milliseconds = Math.floor(timeInMs % 1000 / 10);
    const totalSeconds = Math.floor(timeInMs / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    
    return { 
        minutes: minutes.toLocaleString('fa-IR', {minimumIntegerDigits: 2}), 
        seconds: seconds.toLocaleString('fa-IR', {minimumIntegerDigits: 2}), 
        milliseconds: milliseconds.toLocaleString('fa-IR', {minimumIntegerDigits: 2})
    };
  };

  const handleStartPause = () => setIsRunning(!isRunning);

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    lastLapTimeRef.current = 0;
  };

  const handleLap = () => {
    if (isRunning) {
        const currentLapTime = time - lastLapTimeRef.current;
        setLaps(prevLaps => [currentLapTime, ...prevLaps]);
        lastLapTimeRef.current = time;
    }
  };

  useEffect(() => {
    if (isRunning) {
      const startTime = Date.now() - time;
      timerRef.current = window.setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, time]);
  
  const { minutes, seconds, milliseconds } = formatTime(time);

  return (
    <CardContent className="flex flex-col gap-6 items-center">
      <div className="text-center bg-muted/50 p-6 rounded-full shadow-inner font-display aspect-square w-64 h-64 flex flex-col justify-center items-center" dir="ltr">
          <p className="text-6xl font-bold text-primary tracking-wider text-glow-strong">
            {minutes}:{seconds}
          </p>
          <p className="text-3xl text-primary/70 tracking-widest text-glow-strong">.{milliseconds}</p>
      </div>

      <div className="flex justify-center items-center gap-4 w-full max-w-sm">
         <Button onClick={handleReset} variant="outline" className="h-16 w-16 rounded-full flex-col text-xs" disabled={isRunning}>
              <Redo className="h-6 w-6 mb-1"/>
              ریست
          </Button>
          <Button onClick={handleStartPause} size="lg" className={cn('h-20 w-20 rounded-full text-lg shadow-lg flex-col', 
             isRunning ? 'bg-yellow-500 hover:bg-yellow-600 text-yellow-50' : 'bg-green-500 hover:bg-green-600 text-green-50'
          )}>
            {isRunning ? <><Pause className="h-7 w-7 mb-1" /><span>توقف</span></> : <><Play className="h-7 w-7 mb-1" /><span>شروع</span></>}
          </Button>
          <Button onClick={handleLap} variant="secondary" className="h-16 w-16 rounded-full flex-col text-xs" disabled={!isRunning}>
            <History className="h-6 w-6 mb-1" />
            ثبت دور
          </Button>
      </div>
      
      <ScrollArea className="h-32 mt-2 bg-muted/30 rounded-lg shadow-inner w-full max-w-sm">
          <div className="p-2">
          {laps.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground py-12">
                  <p>دوری ثبت نشده است.</p>
              </div>
          ) : (
              <ul className="space-y-1">
                  {laps.map((lapTime, index) => {
                      const { minutes, seconds, milliseconds } = formatTime(lapTime);
                      return (
                          <li key={index} className="flex justify-between items-center text-base p-2 rounded-md bg-background/50 text-foreground" dir="ltr">
                              <span className='font-display'>
                                دور {laps.length - index}
                              </span>
                              <span className="font-display font-bold text-lg text-primary">{minutes}:{seconds}.{milliseconds}</span>
                          </li>
                      )
                  })}
              </ul>
          )}
          </div>
      </ScrollArea>

    </CardContent>
  );
}
