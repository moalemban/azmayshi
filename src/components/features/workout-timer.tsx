"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Play, Pause, Redo, Plus, Minus, Repeat } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const CircularProgress = ({ percentage, children, colorClass }: { percentage: number, children: React.ReactNode, colorClass: string }) => {
  const radius = 110;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle stroke="hsl(var(--muted))" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
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
      <div className="absolute flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  );
};

type Phase = 'idle' | 'workout' | 'rest' | 'finished';

export default function WorkoutTimer() {
  // Settings
  const [sets, setSets] = useState(3);
  const [workoutTime, setWorkoutTime] = useState(30);
  const [restTime, setRestTime] = useState(10);
  
  // State
  const [phase, setPhase] = useState<Phase>('idle');
  const [currentSet, setCurrentSet] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [reps, setReps] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Client-side effect to initialize audio
    audioRef.current = new Audio('https://cdn.pixabay.com/audio/2021/08/04/audio_12b0c142c5.mp3');
  }, []);

  const playSound = useCallback(() => {
    audioRef.current?.play().catch(e => console.log("Audio play failed:", e));
  }, []);

  const handleStart = () => {
    setCurrentSet(1);
    setPhase('workout');
    setTimeLeft(workoutTime);
    setReps(0);
  };
  
  const handlePause = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase(prev => (prev === 'idle' ? 'idle' : 'paused' as any));
  };
  
  const handleResume = () => {
      setPhase( (currentSet > sets && phase === 'rest') ? 'finished' : (phase === ('paused' as any) ? (timeLeft > 0 ? (currentSet > sets ? 'rest' : 'workout') : 'rest') : 'workout') );
  }

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('idle');
    setCurrentSet(1);
    setReps(0);
    setTimeLeft(0);
  };

  useEffect(() => {
    if (phase === 'workout' || phase === 'rest') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if(timerRef.current) clearInterval(timerRef.current) };
  }, [phase]);

  useEffect(() => {
    if (timeLeft <= 0 && (phase === 'workout' || phase === 'rest')) {
      playSound();
      if (phase === 'workout') {
        if (currentSet < sets) {
          setPhase('rest');
          setTimeLeft(restTime);
          toast({ title: `پایان ست ${currentSet}`, description: 'زمان استراحت شروع شد.' });
        } else {
          setPhase('finished');
          toast({ title: 'تمرین تمام شد!', description: 'خسته نباشی قهرمان!' });
        }
      } else if (phase === 'rest') {
        setCurrentSet(prev => prev + 1);
        setPhase('workout');
        setTimeLeft(workoutTime);
        setReps(0);
        toast({ title: `شروع ست ${currentSet + 1}` });
      }
    }
  }, [timeLeft, phase, currentSet, sets, restTime, workoutTime, playSound, toast]);


  const isRunning = phase === 'workout' || phase === 'rest';

  const renderContent = () => {
    if (phase === 'idle' || phase === 'paused' as any) {
      return (
        <div className="space-y-4 text-center">
            <div className='flex items-center gap-2'>
                <Settings className='w-6 h-6 text-muted-foreground'/>
                <h3 className="text-lg font-semibold text-muted-foreground">تنظیمات تمرین</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                    <Label htmlFor="sets">تعداد ست</Label>
                    <Input id="sets" type="number" value={sets} onChange={e => setSets(Math.max(1, +e.target.value))} className="h-14 text-2xl text-center" />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="workout-time">زمان تمرین (ثانیه)</Label>
                    <Input id="workout-time" type="number" value={workoutTime} onChange={e => setWorkoutTime(Math.max(1, +e.target.value))} className="h-14 text-2xl text-center" />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="rest-time">زمان استراحت (ثانیه)</Label>
                    <Input id="rest-time" type="number" value={restTime} onChange={e => setRestTime(Math.max(0, +e.target.value))} className="h-14 text-2xl text-center" />
                </div>
            </div>
        </div>
      );
    }
    
    const totalDuration = phase === 'workout' ? workoutTime : restTime;
    const percentage = totalDuration > 0 ? (timeLeft / totalDuration) * 100 : 0;
    
    return (
      <div className="flex flex-col items-center gap-4">
        <CircularProgress 
            percentage={percentage} 
            colorClass={phase === 'workout' ? 'text-green-500' : 'text-yellow-500'}
        >
          <p className="text-xl font-semibold">{phase === 'workout' ? `ست ${currentSet}` : 'استراحت'}</p>
          <p className="text-6xl font-mono">{String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}</p>
          <p className="text-lg text-muted-foreground">از {sets} ست</p>
        </CircularProgress>
        {phase === 'workout' && (
          <div className='flex flex-col items-center gap-2'>
            <p className='text-muted-foreground'>تعداد حرکت</p>
            <div className="flex items-center gap-4">
              <Button size="icon" variant="outline" className="rounded-full w-12 h-12" onClick={() => setReps(r => Math.max(0, r - 1))}><Minus/></Button>
              <span className="text-4xl font-bold w-20 text-center">{reps}</span>
              <Button size="icon" variant="outline" className="rounded-full w-12 h-12" onClick={() => setReps(r => r + 1)}><Plus/></Button>
            </div>
            <Button className='w-full mt-2' onClick={() => setReps(r => r + 1)}><Repeat className='w-4 h-4 ml-2'/> ثبت حرکت</Button>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <CardContent className="flex flex-col items-center justify-center gap-6 p-4 md:p-6 min-h-[450px]">
        {renderContent()}
        <div className="flex justify-center items-center gap-4 w-full max-w-sm pt-6 border-t">
          {phase !== 'idle' && (
            <Button onClick={handleReset} variant="outline" size="icon" className="h-16 w-16 rounded-full" disabled={isRunning}>
                <Redo className="h-7 w-7" />
            </Button>
          )}
          <Button 
            onClick={isRunning ? handlePause : (phase === 'idle' ? handleStart : handleResume)} 
            size="lg" 
            className={`h-20 w-20 rounded-full text-lg ${isRunning ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {isRunning ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
          </Button>
           {phase !== 'idle' && <div className='w-16'></div>}
        </div>
    </CardContent>
  );
}
