"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Redo, BrainCircuit, XCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { useToast } from '@/hooks/use-toast';

type Color = 'green' | 'red' | 'yellow' | 'blue';
const colors: Color[] = ['green', 'red', 'yellow', 'blue'];

const colorClasses = {
  green: { bg: 'bg-green-500', shadow: 'shadow-green-500/50' },
  red: { bg: 'bg-red-500', shadow: 'shadow-red-500/50' },
  yellow: { bg: 'bg-yellow-400', shadow: 'shadow-yellow-400/50' },
  blue: { bg: 'bg-blue-500', shadow: 'shadow-blue-500/50' },
};

export default function SimonSays() {
  const [sequence, setSequence] = useState<Color[]>([]);
  const [playerSequence, setPlayerSequence] = useState<Color[]>([]);
  const [activeColor, setActiveColor] = useState<Color | null>(null);
  const [isDisplaying, setIsDisplaying] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const { toast } = useToast();

  const audioContext = useMemo(() => {
     if (typeof window !== 'undefined') {
        return new (window.AudioContext || (window as any).webkitAudioContext)();
     }
     return null;
  }, []);

  const playSound = useCallback((frequency: number) => {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(1, audioContext.currentTime);
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
    setIsGameOver(false);
    setScore(0);
    addNewColorToSequence(true);
  };
  
  useEffect(() => {
    // This effect is to load the high score from localStorage on mount.
    const storedHighScore = localStorage.getItem('simonHighScore');
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore, 10));
    }
  }, []);

  const addNewColorToSequence = (isNewGame = false) => {
    setIsPlayerTurn(false);
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    const newSequence = isNewGame ? [newColor] : [...sequence, newColor];
    setSequence(newSequence);
    displaySequence(newSequence);
  };

  const displaySequence = (seq: Color[]) => {
    setIsDisplaying(true);
    let i = 0;
    const interval = setInterval(() => {
      setActiveColor(seq[i]);
      playSound(soundMap[seq[i]]);
      
      setTimeout(() => setActiveColor(null), 350);
      
      i++;
      if (i >= seq.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsDisplaying(false);
          setIsPlayerTurn(true);
          setPlayerSequence([]);
        }, 400);
      }
    }, 700);
  };

  const handleColorClick = (color: Color) => {
    if (!isPlayerTurn || isDisplaying) return;

    playSound(soundMap[color]);
    const newPlayerSequence = [...playerSequence, color];
    setPlayerSequence(newPlayerSequence);

    // Check if the move is correct
    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      setIsGameOver(true);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('simonHighScore', score.toString());
        toast({ title: 'رکورد جدید!', description: `رکورد شما: ${score}` });
      }
      toast({ title: 'باختی!', description: 'دوباره تلاش کن.', variant: 'destructive' });
      return;
    }

    // Check if the round is complete
    if (newPlayerSequence.length === sequence.length) {
      setScore(score + 1);
      setTimeout(() => {
        addNewColorToSequence();
      }, 1000);
    }
  };

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
      
      <div className="relative">
        <div className="grid grid-cols-2 gap-2 w-64 h-64 sm:w-80 sm:h-80">
          {colors.map(color => (
            <button
              key={color}
              onClick={() => handleColorClick(color)}
              disabled={!isPlayerTurn || isGameOver}
              className={cn(
                'transition-all duration-200',
                'focus:outline-none',
                colorClasses[color].bg,
                color === 'green' && 'rounded-tl-full',
                color === 'red' && 'rounded-tr-full',
                color === 'yellow' && 'rounded-bl-full',
                color === 'blue' && 'rounded-br-full',
                activeColor === color ? 'opacity-100 scale-105' : 'opacity-70 hover:opacity-90',
                (!isPlayerTurn || isGameOver) && 'cursor-not-allowed'
              )}
            />
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-card rounded-full flex flex-col items-center justify-center shadow-2xl">
                <BrainCircuit className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                <p className="text-sm font-semibold text-muted-foreground mt-1">سایمون</p>
            </div>
        </div>
      </div>
      
      {isGameOver ? (
        <Button onClick={startNewGame} size="lg">
          <Redo className="ml-2 h-5 w-5" />
          بازی جدید
        </Button>
      ) : (
        <Badge variant="outline" className="h-10 text-base font-semibold px-4">
            {isDisplaying && <><Lightbulb className="w-5 h-5 ml-2 animate-pulse text-yellow-400"/><span>به خاطر بسپار...</span></>}
            {isPlayerTurn && <><CheckCircle className="w-5 h-5 ml-2 animate-pulse text-green-500"/><span>نوبت شماست!</span></>}
            {!isDisplaying && !isPlayerTurn && !isGameOver && <span className="animate-pulse">برای شروع آماده شو...</span>}
        </Badge>
      )}

    </CardContent>
  );
}
