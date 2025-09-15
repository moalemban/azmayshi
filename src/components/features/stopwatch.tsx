"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Timer, Play, Pause, History, Redo } from 'lucide-react';

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const timerRef = useRef<number | null>(null);
  const lastLapTimeRef = useRef(0);

  const formatTime = (timeInMs: number) => {
    const milliseconds = `00${timeInMs % 1000}`.slice(-3);
    const totalSeconds = Math.floor(timeInMs / 1000);
    const seconds = `0${totalSeconds % 60}`.slice(-2);
    const minutes = `0${Math.floor(totalSeconds / 60) % 60}`.slice(-2);
    return { minutes, seconds, milliseconds: milliseconds.slice(0, 2) };
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
    <Card className="glass-effect h-full card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-foreground">
          <Timer className="h-6 w-6 text-indigo-400" />
          کرونومتر
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="text-center bg-muted/50 p-4 rounded-lg shadow-inner" dir="ltr">
            <p className="text-6xl font-mono text-primary tracking-wider text-glow">
              {minutes}:{seconds}
              <span className="text-3xl text-primary/70 align-baseline">.{milliseconds}</span>
            </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
            <Button onClick={handleStartPause} size="lg" className={`h-14 text-lg ${isRunning ? 'bg-yellow-500 hover:bg-yellow-600 text-yellow-50' : 'bg-green-500 hover:bg-green-600 text-green-50'}`}>
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
        
        <ScrollArea className="h-32 mt-2 bg-muted/50 rounded-lg shadow-inner">
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
                            <li key={index} className="flex justify-between items-center text-sm p-2 rounded-md bg-background/50 font-mono text-muted-foreground" dir="ltr">
                               <span className='text-foreground/80'>
                                 دور {laps.length - index}
                               </span>
                               <span>{minutes}:{seconds}.{milliseconds}</span>
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
