"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Redo, BrainCircuit, XCircle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { useToast } from '@/hooks/use-toast';

type Color = 'green' | 'red' | 'yellow' | 'blue';
const colors: Color[] = ['green', 'red', 'yellow', 'blue'];

const colorClasses: Record<Color, { base: string, active: string }> = {
  green: { base: 'bg-green-500 rounded-tl-full', active: 'bg-green-400 shadow-lg shadow-green-400/50' },
  red: { base: 'bg-red-500 rounded-tr-full', active: 'bg-red-400 shadow-lg shadow-red-400/50' },
  yellow: { base: 'bg-yellow-400 rounded-bl-full', active: 'bg-yellow-300 shadow-lg shadow-yellow-300/50' },
  blue: { base: 'bg-blue-500 rounded-br-full', active: 'bg-blue-400 shadow-lg shadow-blue-400/50' },
};


export default function SimonSays() {
  const [sequence, setSequence] = useState<Color[]>([]);
  const [playerSequence, setPlayerSequence] = useState<Color[]>([]);
  const [activeColor, setActiveColor] = useState<Color | null>(null);
  const [gameStatus, setGameStatus] = useState<'idle' | 'displaying' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isClient, setIsClient] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const storedHighScore = localStorage.getItem('simonHighScore');
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore, 10));
    }
  }, []);
  
  const audioContext = useMemo(() => {
     if (isClient) {
        return new (window.AudioContext || (window as any).webkitAudioContext)();
     }
     return null;
  // eslint-disable-next-line react-hooks-exhaustive-deps
  }, [isClient]);

  const playSound = useCallback((frequency: number) => {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.3);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
  }, [audioContext]);

  const soundMap: Record<Color, number> = useMemo(() => ({
    green: 329.63, // E4
    red: 392.00, // G4
    yellow: 440.00, // A4
    blue: 493.88, // B4
  }), []);


  const startNewGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setGameStatus('displaying');
    setScore(0);
    addNewColorToSequence(true);
  };

  const addNewColorToSequence = (isNewGame = false) => {
    setGameStatus('displaying');
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    const newSequence = isNewGame ? [newColor] : [...sequence, newColor];
    setSequence(newSequence);
    displaySequence(newSequence);
  };

  const displaySequence = (seq: Color[]) => {
    let i = 0;
    const interval = setInterval(() => {
      setActiveColor(seq[i]);
      playSound(soundMap[seq[i]]);
      
      setTimeout(() => setActiveColor(null), 400);
      
      i++;
      if (i >= seq.length) {
        clearInterval(interval);
        setTimeout(() => {
          setGameStatus('playing');
          setPlayerSequence([]);
        }, 500);
      }
    }, 800);
  };

  const handleColorClick = (color: Color) => {
    if (gameStatus !== 'playing') return;

    playSound(soundMap[color]);
    const newPlayerSequence = [...playerSequence, color];
    setPlayerSequence(newPlayerSequence);

    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      setGameStatus('gameover');
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('simonHighScore', score.toString());
        toast({ title: 'رکورد جدید!', description: `رکورد شما: ${score}` });
      }
      toast({ title: 'باختی!', description: 'دوباره تلاش کن.', variant: 'destructive' });
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      setScore(score + 1);
      setTimeout(() => {
        addNewColorToSequence();
      }, 1000);
    }
  };

  const getStatusMessage = () => {
    switch(gameStatus) {
        case 'idle': return "برای شروع، دکمه را بزنید";
        case 'displaying': return <><Lightbulb className="w-5 h-5 ml-2 animate-pulse text-yellow-400"/><span>به خاطر بسپار...</span></>;
        case 'playing': return <><CheckCircle className="w-5 h-5 ml-2 text-green-500"/><span>نوبت شماست!</span></>;
        case 'gameover': return <><XCircle className="w-5 h-5 ml-2 text-red-500"/><span>بازی تمام شد</span></>;
    }
  }

  return (
    <CardContent className="flex flex-col items-center gap-6">
      <div className="flex justify-around items-center w-full max-w-sm bg-muted/50 p-3 rounded-xl shadow-inner">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">امتیاز</p>
          <p className="text-3xl font-bold font-display">{score.toLocaleString('fa-IR')}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">رکورد</p>
          <p className="text-3xl font-bold font-display">{highScore.toLocaleString('fa-IR')}</p>
        </div>
      </div>
      
       <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 rounded-lg bg-muted/30">
          <Info className="w-5 h-5" />
          <span>الگوی رنگ‌ها را به خاطر بسپارید و آن را تکرار کنید.</span>
      </div>

      <div className="relative">
        <div className="grid grid-cols-2 gap-2 w-64 h-64 sm:w-80 sm:h-80">
          {colors.map(color => (
            <button
              key={color}
              onClick={() => handleColorClick(color)}
              disabled={gameStatus !== 'playing'}
              className={cn(
                'transition-all duration-200 ease-in-out transform',
                'focus:outline-none',
                colorClasses[color].base,
                activeColor === color ? `opacity-100 scale-105 ${colorClasses[color].active}` : 'opacity-70',
                gameStatus === 'playing' ? 'cursor-pointer hover:opacity-100 hover:scale-105' : 'cursor-not-allowed'
              )}
            />
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-card rounded-full flex flex-col items-center justify-center shadow-2xl">
                <BrainCircuit className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                <Badge variant="outline" className="h-8 text-sm font-semibold px-3 mt-2 text-center">
                   {getStatusMessage()}
                </Badge>
            </div>
        </div>
      </div>
      
      {gameStatus === 'idle' || gameStatus === 'gameover' ? (
        <Button onClick={startNewGame} size="lg" className="h-14 text-lg">
          <Redo className="ml-2 h-5 w-5" />
          {gameStatus === 'idle' ? 'شروع بازی' : 'بازی جدید'}
        </Button>
      ) : (
        <div className="h-14"></div>
      )}

    </CardContent>
  );
}
