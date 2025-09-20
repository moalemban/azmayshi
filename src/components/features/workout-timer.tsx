"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Play, Pause, Redo, Plus, Minus, Repeat, History, BarChart, Clock } from 'lucide-react';
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

const toPersianDigits = (str: string | number): string => {
    return String(str).replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);
};

const toEnglishDigits = (str: string): string => {
    return str.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
};

const InputWithControls = ({ label, id, value, onValueChange, placeholder, incrementStep = 1 }: {
    label: string,
    id: string,
    value: string,
    onValueChange: (newValue: string) => void,
    placeholder: string,
    incrementStep?: number
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange(toEnglishDigits(e.target.value).replace(/[^0-9]/g, ''));
    };
    
    const handleStep = (amount: number) => {
        const currentValue = parseInt(toEnglishDigits(value), 10) || 0;
        onValueChange(String(Math.max(0, currentValue + amount)));
    }

    return (
        <div className="space-y-1 text-center">
            <Label htmlFor={id}>{label}</Label>
            <div className="flex items-center justify-center">
                <Button variant="outline" size="icon" className="h-14 w-10 rounded-l-full rounded-r-none" onClick={() => handleStep(-incrementStep)}><Minus className="w-5 h-5"/></Button>
                <Input 
                    id={id} 
                    value={toPersianDigits(value)} 
                    onChange={handleChange} 
                    placeholder={placeholder} 
                    className="h-14 text-2xl text-center font-display w-24 rounded-none z-10 border-x-0 focus-visible:ring-offset-0 focus-visible:ring-0" 
                />
                <Button variant="outline" size="icon" className="h-14 w-10 rounded-r-full rounded-l-none" onClick={() => handleStep(incrementStep)}><Plus className="w-5 h-5"/></Button>
            </div>
        </div>
    );
};


export default function WorkoutTimer() {
  // Settings
  const [sets, setSets] = useState('1');
  const [workoutTime, setWorkoutTime] = useState('45');
  const [restTime, setRestTime] = useState('15');
  const [timerMode, setTimerMode] = useState<TimerMode>('auto');
  const [manualRestEnabled, setManualRestEnabled] = useState(false);
  
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
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
  }, []);
  
  const totalWorkoutTime = history.reduce((acc, h) => acc + h.duration, 0);
  const totalReps = history.reduce((acc, h) => acc + h.reps, 0);
  
  const totalRestTime = history.reduce((acc, h, index) => {
    if (index < history.length -1) { // Don't add rest after last set
        if (timerMode === 'auto') return acc + (parseInt(restTime) || 0);
        if (timerMode === 'manual' && manualRestEnabled) return acc + (parseInt(restTime) || 0);
    }
    return acc;
  }, 0);


  const handleStart = () => {
    const numSets = parseInt(toEnglishDigits(sets), 10);
    const numWorkoutTime = parseInt(toEnglishDigits(workoutTime), 10);

    if (isNaN(numSets) || numSets <= 0) {
      toast({ title: "خطا", description: "تعداد ست‌ها (ضروری) باید یک عدد بزرگتر از صفر باشد.", variant: "destructive" });
      return;
    }
     if (isNaN(numWorkoutTime) || numWorkoutTime <= 0) {
      toast({ title: "خطا", description: "زمان تمرین (ضروری) باید بزرگتر از صفر باشد.", variant: "destructive" });
      return;
    }
    
    setCurrentSet(1);
    setPhase('workout');
    setTimeLeft(numWorkoutTime);
    setReps(0);
    setHistory([]);
    toast({ title: "تمرین شروع شد!", description: `ست ${toPersianDigits(1)} از ${toPersianDigits(numSets)} آغاز شد.` });
    playSound();
  };
  
  const handlePause = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPausedFrom(phase);
    setPhase('paused');
  };
  
  const handleResume = () => {
    if (pausedFrom) {
      setPhase(pausedFrom);
      setPausedFrom(null);
    }
  }

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('configuring');
    setCurrentSet(1);
    setReps(0);
    setTimeLeft(0);
    setHistory([]);
    setPausedFrom(null);
  };

  const finishSet = () => {
      const numWorkoutTime = parseInt(toEnglishDigits(workoutTime), 10);
      const duration = (phase === 'workout' ? numWorkoutTime - timeLeft : numWorkoutTime);
      const newHistory: SetHistory = { set: currentSet, reps: reps, duration: duration };
      setHistory(prev => [...prev, newHistory]);
      playSound();

      const numSets = parseInt(toEnglishDigits(sets), 10);
      const numRestTime = parseInt(toEnglishDigits(restTime) || '0', 10);

      if (currentSet < numSets) {
          if (timerMode === 'auto' && numRestTime > 0) {
            setPhase('rest');
            setTimeLeft(numRestTime);
            toast({ title: `پایان ست ${toPersianDigits(currentSet)}`, description: `زمان استراحت (${toPersianDigits(numRestTime)} ثانیه) شروع شد.` });
          } else if (timerMode === 'manual' && manualRestEnabled && numRestTime > 0) {
            setPhase('paused');
            setPausedFrom('rest');
            setTimeLeft(numRestTime);
            toast({ title: `پایان ست ${toPersianDigits(currentSet)}`, description: 'برای شروع استراحت، دکمه پلی را بزنید.' });
          } else {
             // Skip rest and go to paused workout for next set
             setCurrentSet(prev => prev + 1);
             const nextSet = currentSet + 1;
             setPhase('paused');
             setPausedFrom('workout');
             setTimeLeft(numWorkoutTime);
             setReps(0);
             toast({ title: `پایان ست ${toPersianDigits(currentSet)}`, description: `برای شروع ست ${toPersianDigits(nextSet)} دکمه پلی را بزنید.` });
          }
      } else {
        setPhase('finished');
        if (timerRef.current) clearInterval(timerRef.current);
        toast({ title: 'تمرین تمام شد!', description: 'خسته نباشی قهرمان!' });
      }
  }

  const finishRest = () => {
      playSound();
      setCurrentSet(prev => prev + 1);
      const nextSet = currentSet + 1;
      const numWorkoutTime = parseInt(toEnglishDigits(workoutTime), 10);
      
      if (timerMode === 'auto') {
        setPhase('workout');
        setTimeLeft(numWorkoutTime);
        setReps(0);
        toast({ title: `شروع ست ${toPersianDigits(nextSet)}` });
      } else { // Manual mode after rest
        setPhase('paused');
        setPausedFrom('workout');
        setTimeLeft(numWorkoutTime);
        setReps(0);
        toast({ title: `پایان استراحت`, description: `برای شروع ست ${toPersianDigits(nextSet)} دکمه پلی را بزنید.` });
      }
  }
  
  const skipRest = () => {
    if (phase === 'rest' || (phase === 'paused' && pausedFrom === 'rest')) {
       finishRest();
    }
  }

  useEffect(() => {
    if ((phase === 'workout' || phase === 'rest') && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft <= 0) {
       if (phase === 'workout') finishSet();
       if (phase === 'rest') finishRest();
    }
    
    return () => { if(timerRef.current) clearInterval(timerRef.current) };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeLeft, playSound]);

  const isRunning = phase === 'workout' || phase === 'rest';

  const formatSeconds = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${toPersianDigits(minutes.toString().padStart(2, '0'))}:${toPersianDigits(seconds.toString().padStart(2, '0'))}`;
  }
  
  const StatDisplay = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-background/50 flex-1 min-w-[80px] text-center">
        {icon}
        <span className="text-sm font-semibold text-muted-foreground mt-1">{label}</span>
        <span className="text-lg font-bold text-foreground font-display">{typeof value === 'number' ? toPersianDigits(value) : value}</span>
    </div>
  );

  const renderContent = () => {
    if (phase === 'configuring') {
      return (
        <div className="space-y-6 text-center w-full max-w-md">
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-muted-foreground">تنظیمات تمرین</h3>
          </div>
          <div className="flex justify-around items-end gap-2">
            <InputWithControls
                id="sets"
                label="تعداد ست (ضروری)"
                value={sets}
                onValueChange={setSets}
                placeholder="۴"
            />
            <InputWithControls
                id="workout-time"
                label="زمان تمرین (ثانیه)"
                value={workoutTime}
                onValueChange={setWorkoutTime}
                placeholder="۴۵"
                incrementStep={5}
            />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
                <Label className="text-muted-foreground">حالت تایمر</Label>
                <div className="flex items-center justify-center p-1 bg-muted rounded-lg w-full">
                {(['auto', 'manual'] as TimerMode[]).map((mode) => (
                    <Button
                    key={mode}
                    onClick={() => setTimerMode(mode)}
                    variant={timerMode === mode ? 'default' : 'ghost'}
                    className={`w-full h-10 ${timerMode === mode ? '' : 'text-muted-foreground'}`}
                    >
                    {mode === 'auto' ? 'خودکار' : 'دستی'}
                    </Button>
                ))}
                </div>
                <p className='text-xs text-muted-foreground/80 pt-1'>حالت خودکار: زمان استراحت به صورت اتوماتیک شروع می‌شود.</p>
            </div>

            {timerMode === 'manual' && (
                 <div className="flex items-center justify-between rounded-lg border p-3">
                    <Label htmlFor="manual-rest-switch" className="cursor-pointer">
                        استراحت کنترل‌شده در حالت دستی
                    </Label>
                    <Switch id="manual-rest-switch" checked={manualRestEnabled} onCheckedChange={setManualRestEnabled} />
                </div>
            )}
             
            {(timerMode === 'auto' || (timerMode === 'manual' && manualRestEnabled)) && (
                <InputWithControls
                    id="rest-time"
                    label="زمان استراحت (ثانیه)"
                    value={restTime}
                    onValueChange={setRestTime}
                    placeholder="۱۵"
                    incrementStep={5}
                />
            )}
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
            <div className='flex gap-3 mt-4'>
                <StatDisplay icon={<Repeat className="w-6 h-6 text-blue-400"/>} label="تعداد ست" value={history.length}/>
                <StatDisplay icon={<Plus className="w-6 h-6 text-green-400"/>} label="کل حرکات" value={totalReps}/>
                <StatDisplay icon={<Clock className="w-6 h-6 text-orange-400"/>} label="زمان تمرین" value={formatSeconds(totalWorkoutTime)}/>
                <StatDisplay icon={<Pause className="w-6 h-6 text-yellow-400"/>} label="زمان استراحت" value={formatSeconds(totalRestTime)}/>
            </div>
             <Separator className="my-4" />
             <div className='space-y-2 text-right'>
                <h4 className='font-semibold flex items-center gap-2'><History className='w-5 h-5'/> تاریخچه ست‌ها</h4>
                 <div className='max-h-40 overflow-y-auto space-y-1 pr-2'>
                     {history.map(h => (
                         <div key={h.set} className='flex justify-between items-center bg-muted/30 p-2 rounded-md text-sm'>
                             <span className='font-bold font-display'>ست {toPersianDigits(h.set)}</span>
                             <div className='flex gap-4 font-display'>
                                 <span>{toPersianDigits(h.reps)} حرکت</span>
                                 <span>{formatSeconds(h.duration)}</span>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>
            <Button onClick={handleReset} size="lg" className="w-full h-12 mt-4">تنظیم تمرین جدید</Button>
         </div>
       )
    }
    
    const numWorkoutTime = parseInt(toEnglishDigits(workoutTime || '0'), 10);
    const numRestTime = parseInt(toEnglishDigits(restTime || '0'), 10);
    const totalDuration = (phase === 'workout' || pausedFrom === 'workout') ? numWorkoutTime : numRestTime;
    const percentage = totalDuration > 0 ? (timeLeft / totalDuration) * 100 : 0;
    
    return (
      <div className="flex flex-col items-center gap-4">
        <CircularProgress 
            percentage={percentage} 
            colorClass={phase === 'workout' || pausedFrom === 'workout' ? 'text-green-500' : 'text-yellow-500'}
        >
          <p className="text-xl font-semibold font-display">{phase === 'workout' || pausedFrom === 'workout' ? `ست ${toPersianDigits(currentSet)}` : (phase === 'rest' ? 'استراحت' : (pausedFrom === 'rest' ? 'شروع استراحت؟' : 'متوقف شده'))}</p>
          <p className="text-6xl font-display text-glow">{formatSeconds(timeLeft)}</p>
          <p className="text-lg text-muted-foreground font-display">از {toPersianDigits(sets)} ست</p>
        </CircularProgress>
        
        { (phase === 'workout' || (phase === 'paused' && pausedFrom === 'workout')) && (
          <div className='flex flex-col items-center gap-2 w-full'>
            <p className='text-muted-foreground'>تعداد حرکت</p>
            <div className="flex items-center gap-4">
              <Button size="icon" variant="outline" className="rounded-full w-12 h-12" onClick={() => setReps(r => Math.max(0, r - 1))}><Minus/></Button>
              <span className="text-4xl font-bold w-20 text-center font-display">{toPersianDigits(reps)}</span>
              <Button size="icon" variant="outline" className="rounded-full w-12 h-12" onClick={() => setReps(r => r + 1)}><Plus/></Button>
            </div>
             <Button variant="secondary" onClick={() => setReps(reps + 1)} className="mt-2">
                <Plus className="w-4 h-4 ml-2"/> ثبت حرکت
            </Button>
          </div>
        )}

        {(phase === 'rest' || (phase === 'paused' && pausedFrom === 'rest')) && (
            <Button onClick={skipRest} variant="secondary" className='w-full'>رد کردن استراحت</Button>
        )}
      </div>
    );
  };
  
  return (
    <CardContent className="flex flex-col items-center justify-center gap-6 p-4 md:p-6 min-h-[500px]">
        {renderContent()}
        
        { phase === 'configuring' ? (
             <Button onClick={handleStart} size="lg" className="w-full max-w-sm h-14 text-lg bg-green-500 hover:bg-green-600 mt-auto">
                <Play className="ml-2 h-6 w-6"/>
                شروع تمرین
             </Button>
        ) : phase !== 'finished' && (
            <div className="flex justify-center items-center gap-4 w-full max-w-sm pt-6 border-t mt-auto">
                <Button onClick={handleReset} variant="outline" size="icon" className="h-16 w-16 rounded-full" disabled={isRunning}>
                    <Redo className="h-7 w-7" />
                </Button>
            
                <Button 
                    onClick={isRunning ? handlePause : handleResume} 
                    size="lg" 
                    className={cn('h-20 w-20 rounded-full text-lg', 
                        isRunning ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
                    )}
                >
                    {isRunning ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                </Button>
                
                { (phase === 'workout' || (phase === 'paused' && pausedFrom === 'workout')) ? (
                    <Button onClick={finishSet} variant="secondary" className='h-16 w-16 rounded-full p-0 flex flex-col leading-tight text-xs' disabled={isRunning && timerMode === 'auto'}>
                        <span>پایان</span>
                        <span>ست</span>
                    </Button>
                ) : <div className='w-16'></div> }

            </div>
        )}

    </CardContent>
  );
}
