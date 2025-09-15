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
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps(prevLaps => [time, ...prevLaps]);
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
  }, [isRunning]);
  
  const { minutes, seconds, milliseconds } = formatTime(time);

  return (
    <Card className="glass-effect h-full card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-white">
          <Timer className="h-6 w-6 text-indigo-400" />
          کرونومتر
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="text-center bg-black/20 p-4 rounded-lg shadow-inner" dir="ltr">
            <p className="text-6xl font-mono text-primary tracking-wider text-glow">
              {minutes}:{seconds}
              <span className="text-3xl text-primary/70">.{milliseconds}</span>
            </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
            <Button onClick={handleStartPause} size="lg" className={`h-14 text-lg ${isRunning ? 'bg-yellow-500/80 hover:bg-yellow-500/90' : 'bg-green-500/80 hover:bg-green-500/90'} text-white`}>
              {isRunning ? <Pause className="ml-2" /> : <Play className="ml-2" />}
              {isRunning ? 'توقف' : 'شروع'}
            </Button>
            <Button onClick={handleLap} size="lg" variant="secondary" className="h-14 text-lg bg-white/10 text-white/80 hover:bg-white/20" disabled={!isRunning}>
              <History className="ml-2" />
              دور
            </Button>
             <Button onClick={handleReset} variant="destructive" className="h-14 text-lg col-span-2 bg-red-500/80 hover:bg-red-500/90 text-white">
                <Redo className="ml-2"/>
                ریست
            </Button>
        </div>
        
        <ScrollArea className="h-32 mt-2 bg-black/20 rounded-lg shadow-inner">
            <div className="p-2">
            {laps.length === 0 ? (
                 <div className="flex items-center justify-center h-full text-white/60 py-12">
                    <p>دوری ثبت نشده است.</p>
                </div>
            ) : (
                <ul className="space-y-1">
                    {laps.map((lapTime, index) => {
                        const { minutes, seconds, milliseconds } = formatTime(lapTime);
                        return (
                            <li key={index} className="flex justify-between items-center text-sm p-2 rounded-md bg-black/20 font-mono text-white/80" dir="ltr">
                               <span className='text-white/60'>
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
