"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Play, Pause, Redo, Plus, Minus, Repeat, History, BarChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Separator } from '../ui/separator';

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

type Phase = 'configuring' | 'workout' | 'rest' | 'paused' | 'finished';
type TimerMode = 'auto' | 'manual';
type SetHistory = { set: number; reps: number; duration: number };

export default function WorkoutTimer() {
  // Settings
  const [sets, setSets] = useState(4);
  const [workoutTime, setWorkoutTime] = useState(45);
  const [restTime, setRestTime] = useState(15);
  const [timerMode, setTimerMode] = useState<TimerMode>('auto');
  
  // State
  const [phase, setPhase] = useState<Phase>('configuring');
  const [currentSet, setCurrentSet] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [reps, setReps] = useState(0);
  const [history, setHistory] = useState<SetHistory[]>([]);
  const [pausedFrom, setPausedFrom] = useState<Phase | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    audioRef.current = new Audio('https://cdn.pixabay.com/audio/2021/08/04/audio_12b0c142c5.mp3');
  }, []);

  const playSound = useCallback(() => {
    audioRef.current?.play().catch(e => console.log("Audio play failed:", e));
  }, []);
  
  const totalWorkoutTime = history.reduce((acc, h) => acc + h.duration, 0);
  const totalReps = history.reduce((acc, h) => acc + h.reps, 0);
  const totalRestTime = (history.length -1) * restTime;


  const handleStart = () => {
    setCurrentSet(1);
    setPhase('workout');
    setTimeLeft(workoutTime);
    setReps(0);
    setHistory([]);
    toast({ title: "شروع تمرین!", description: `ست ۱ از ${sets} شروع شد.` });
  };
  
  const handlePause = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPausedFrom(phase);
    setPhase('paused');
  };
  
  const handleResume = () => {
    if(pausedFrom) setPhase(pausedFrom);
    setPausedFrom(null);
  }

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('configuring');
    setCurrentSet(1);
    setReps(0);
    setTimeLeft(0);
    setHistory([]);
  };

  const finishSet = () => {
      const newHistory: SetHistory = { set: currentSet, reps: reps, duration: workoutTime };
      setHistory(prev => [...prev, newHistory]);
      playSound();

      if (currentSet < sets) {
        if (timerMode === 'auto') {
          setPhase('rest');
          setTimeLeft(restTime);
          toast({ title: `پایان ست ${currentSet}`, description: `زمان استراحت (${restTime} ثانیه) شروع شد.` });
        } else {
           setPhase('paused');
           setPausedFrom('rest'); // So resume goes to rest
           toast({ title: `پایان ست ${currentSet}`, description: 'برای شروع استراحت، دکمه پلی را بزنید.' });
        }
      } else {
        setPhase('finished');
        toast({ title: 'تمرین تمام شد!', description: 'خسته نباشی قهرمان!' });
      }
  }

  const finishRest = () => {
      playSound();
      setCurrentSet(prev => prev + 1);
      setPhase('workout');
      setTimeLeft(workoutTime);
      setReps(0);
      toast({ title: `شروع ست ${currentSet + 1}` });
  }

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
       if (phase === 'workout') finishSet();
       if (phase === 'rest') finishRest();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase]);

  const isRunning = phase === 'workout' || phase === 'rest';

  const formatSeconds = (totalSeconds: number) => {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }
  
  const StatDisplay = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-background/50 flex-1 min-w-[80px]">
        {icon}
        <span className="text-sm font-semibold text-muted-foreground mt-1">{label}</span>
        <span className="text-lg font-bold text-foreground">{value}</span>
    </div>
  );

  const renderContent = () => {
    if (phase === 'configuring') {
      return (
        <div className="space-y-6 text-center w-full max-w-md">
            <div className='flex items-center gap-2'>
                <Settings className='w-6 h-6 text-muted-foreground'/>
                <h3 className="text-lg font-semibold text-muted-foreground">تنظیمات تمرین</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
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
             <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <Label htmlFor="timer-mode" className="text-muted-foreground">حالت خودکار (تمرین » استراحت » ست بعدی)</Label>
                <Switch id="timer-mode" checked={timerMode === 'auto'} onCheckedChange={(checked) => setTimerMode(checked ? 'auto' : 'manual')} />
            </div>
        </div>
      );
    }

    if (phase === 'finished') {
       return (
         <div className="space-y-4 text-center w-full max-w-md">
            <div className='flex items-center gap-2'>
                <BarChart className='w-6 h-6 text-primary'/>
                <h3 className="text-xl font-semibold text-primary">خلاصه تمرین امروز</h3>
            </div>
            <div className='flex gap-2 justify-center'>
                <StatDisplay icon={<Repeat className="w-6 h-6 text-blue-400"/>} label="تعداد ست" value={history.length}/>
                <StatDisplay icon={<Plus className="w-6 h-6 text-green-400"/>} label="کل حرکات" value={totalReps}/>
                <StatDisplay icon={<Timer className="w-6 h-6 text-orange-400"/>} label="زمان تمرین" value={formatSeconds(totalWorkoutTime)}/>
                <StatDisplay icon={<Pause className="w-6 h-6 text-yellow-400"/>} label="زمان استراحت" value={formatSeconds(totalRestTime)}/>
            </div>
            <Button onClick={handleStart} size="lg" className="w-full h-12 mt-4">شروع تمرین جدید</Button>
         </div>
       )
    }
    
    const totalDuration = phase === 'workout' || (phase === 'paused' && pausedFrom === 'workout') ? workoutTime : restTime;
    const percentage = totalDuration > 0 ? (timeLeft / totalDuration) * 100 : 0;
    
    return (
      <div className="flex flex-col items-center gap-4">
        <CircularProgress 
            percentage={percentage} 
            colorClass={phase === 'workout' ? 'text-green-500' : 'text-yellow-500'}
        >
          <p className="text-xl font-semibold">{phase === 'workout' ? `ست ${currentSet}` : (phase === 'rest' ? 'استراحت' : 'متوقف شده')}</p>
          <p className="text-6xl font-mono">{formatSeconds(timeLeft)}</p>
          <p className="text-lg text-muted-foreground">از {sets} ست</p>
        </CircularProgress>
        
        { (phase === 'workout' || (phase === 'paused' && pausedFrom === 'workout')) && (
          <div className='flex flex-col items-center gap-2'>
            <p className='text-muted-foreground'>تعداد حرکت</p>
            <div className="flex items-center gap-4">
              <Button size="icon" variant="outline" className="rounded-full w-12 h-12" onClick={() => setReps(r => Math.max(0, r - 1))} disabled={isRunning}><Minus/></Button>
              <span className="text-4xl font-bold w-20 text-center">{reps}</span>
              <Button size="icon" variant="outline" className="rounded-full w-12 h-12" onClick={() => setReps(r => r + 1)} disabled={isRunning}><Plus/></Button>
            </div>
            <Button className='w-full mt-2' onClick={() => setReps(r => r + 1)} disabled={!isRunning}><Repeat className='w-4 h-4 ml-2'/> ثبت حرکت</Button>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <CardContent className="flex flex-col items-center justify-center gap-6 p-4 md:p-6 min-h-[500px]">
        {renderContent()}
        
        { phase !== 'finished' && (
            <div className="flex justify-center items-center gap-4 w-full max-w-sm pt-6 border-t mt-auto">
                <Button onClick={handleReset} variant="outline" size="icon" className="h-16 w-16 rounded-full" disabled={isRunning}>
                    <Redo className="h-7 w-7" />
                </Button>
            
                <Button 
                    onClick={isRunning ? handlePause : (phase === 'configuring' ? handleStart : handleResume)} 
                    size="lg" 
                    className={cn('h-20 w-20 rounded-full text-lg', 
                        isRunning ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
                    )}
                >
                    {isRunning ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                </Button>
                <div className='w-16'></div>
            </div>
        )}

    </CardContent>
  );
}
