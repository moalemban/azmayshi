"use client";

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Timer, Play, Pause, Square, History, Redo } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (timeInMs: number) => {
    const milliseconds = `00${timeInMs % 1000}`.slice(-3);
    const totalSeconds = Math.floor(timeInMs / 1000);
    const seconds = `0${totalSeconds % 60}`.slice(-2);
    const minutes = `0${Math.floor(totalSeconds / 60) % 60}`.slice(-2);
    const hours = `0${Math.floor(totalSeconds / 3600)}`.slice(-2);
    return { hours, minutes, seconds, milliseconds };
  };

  const handleStartPause = () => {
    if (isRunning) {
      clearInterval(timerRef.current!);
    } else {
      const startTime = Date.now() - time;
      timerRef.current = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10); // Update every 10ms for smoother display
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    clearInterval(timerRef.current!);
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps([time, ...laps]);
    }
  };
  
  const { hours, minutes, seconds, milliseconds } = formatTime(time);

  return (
    <Card className="h-full group/card transition-all duration-300 hover:border-primary/50">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover/opacity-100 transition-opacity duration-500 -z-10"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-6 w-6 text-primary" />
          کرونومتر
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="text-center bg-background/50 p-4 rounded-lg shadow-inner" dir="ltr">
            <p className="text-6xl font-mono text-primary tracking-wider">
              {hours}:{minutes}:{seconds}
              <span className="text-3xl text-primary/70">.{milliseconds.slice(0, 2)}</span>
            </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
            <Button onClick={handleStartPause} size="lg" className="h-14 text-lg">
              {isRunning ? <Pause className="ml-2" /> : <Play className="ml-2" />}
              {isRunning ? 'توقف' : 'شروع'}
            </Button>
            <Button onClick={handleLap} size="lg" variant="secondary" className="h-14 text-lg" disabled={!isRunning}>
              <History className="ml-2" />
              دور
            </Button>
             <Button onClick={handleReset} variant="destructive" className="h-14 text-lg col-span-2">
                <Redo className="ml-2"/>
                ریست
            </Button>
        </div>
        
        <ScrollArea className="h-32 mt-2 bg-background/30 rounded-lg shadow-inner">
            <div className="p-2">
            {laps.length === 0 ? (
                 <div className="flex items-center justify-center h-full text-muted-foreground py-12">
                    <p>دوری ثبت نشده است.</p>
                </div>
            ) : (
                <ul className="space-y-1">
                    {laps.map((lapTime, index) => {
                        const { hours, minutes, seconds, milliseconds } = formatTime(lapTime);
                        return (
                            <li key={index} className="flex justify-between items-center text-sm p-2 rounded-md bg-background/50 font-mono" dir="ltr">
                               <span className='text-muted-foreground'>
                                 دور {laps.length - index}
                               </span>
                               <span>{hours}:{minutes}:{seconds}.{milliseconds}</span>
                            </li>
                        )
                    })}
                </ul>
            )}
            </div>
        </ScrollArea>

      </CardContent>
    </Card>
  );
}
