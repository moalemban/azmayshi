"use client";

import { useState, useEffect, useMemo } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Redo, HelpCircle, ArrowUp, ArrowDown, Check, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Difficulty = 'easy' | 'medium' | 'hard';
const difficultyRanges: Record<Difficulty, { min: number, max: number }> = {
  easy: { min: 1, max: 100 },
  medium: { min: 1, max: 500 },
  hard: { min: 1, max: 1000 },
};

export default function GuessTheNumber() {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [secretNumber, setSecretNumber] = useState(0);
  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState<number[]>([]);
  const [feedback, setFeedback] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const { toast } = useToast();

  const startNewGame = (newDifficulty: Difficulty) => {
    const { min, max } = difficultyRanges[newDifficulty];
    const newSecret = Math.floor(Math.random() * (max - min + 1)) + min;
    setDifficulty(newDifficulty);
    setSecretNumber(newSecret);
    setGuess('');
    setGuesses([]);
    setFeedback('');
    setGameOver(false);
    setAttempts(0);
  };
  
  useEffect(() => {
    // Game doesn't start until difficulty is chosen
  }, []);

  const handleGuess = () => {
    if (!difficulty) return;
    const { min, max } = difficultyRanges[difficulty];
    const numGuess = parseInt(guess, 10);

    if (isNaN(numGuess) || numGuess < min || numGuess > max) {
      toast({
        title: 'خطا!',
        description: `لطفاً یک عدد معتبر بین ${min} تا ${max} وارد کنید.`,
        variant: 'destructive',
      });
      return;
    }

    setGuesses(prev => [...prev, numGuess]);
    setAttempts(a => a + 1);
    setGuess('');

    if (numGuess === secretNumber) {
      setFeedback('درست حدس زدی! تبریک!');
      setGameOver(true);
      toast({
        title: '🎉 برنده شدی!',
        description: `شما در ${attempts + 1} تلاش عدد را پیدا کردید.`,
        className: 'bg-green-500/10 text-green-600',
      });
    } else if (numGuess < secretNumber) {
      setFeedback('بالاتر برو!');
    } else {
      setFeedback('پایین‌تر بیا!');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        handleGuess();
    }
  }
  
  const getFeedbackIcon = () => {
    if (gameOver) return <Trophy className="w-6 h-6 text-yellow-400"/>;
    if (feedback.includes('بالاتر')) return <ArrowUp className="w-6 h-6 text-red-500"/>;
    if (feedback.includes('پایین‌تر')) return <ArrowDown className="w-6 h-6 text-blue-500"/>;
    return <HelpCircle className="w-6 h-6 text-muted-foreground"/>;
  }

  if (!difficulty) {
    return (
        <CardContent className="flex flex-col items-center gap-4 pt-6">
            <h3 className="text-lg font-semibold text-foreground">درجه سختی را انتخاب کنید:</h3>
            <div className="flex gap-4">
               <Button onClick={() => startNewGame('easy')} className="h-12">آسان (۱-۱۰۰)</Button>
               <Button onClick={() => startNewGame('medium')} className="h-12">متوسط (۱-۵۰۰)</Button>
               <Button onClick={() => startNewGame('hard')} className="h-12">سخت (۱-۱۰۰۰)</Button>
            </div>
        </CardContent>
    )
  }

  return (
    <CardContent className="flex flex-col items-center gap-6">
      <p className="text-muted-foreground text-center">
        سیستم یک عدد بین {difficultyRanges[difficulty].min.toLocaleString('fa-IR')} تا {difficultyRanges[difficulty].max.toLocaleString('fa-IR')} انتخاب کرده. می‌توانی حدس بزنی؟
      </p>
      
      <div className="flex flex-col items-center gap-4 w-full max-w-sm">
        <div className="w-full space-y-2">
           <Label htmlFor="guess-input" className="text-center block">حدس شما</Label>
           <Input 
             id="guess-input"
             type="number"
             value={guess}
             onChange={(e) => setGuess(e.target.value)}
             onKeyDown={handleKeyDown}
             placeholder={`عددی بین ${difficultyRanges[difficulty].min.toLocaleString('fa-IR')} تا ${difficultyRanges[difficulty].max.toLocaleString('fa-IR')}`}
             className="h-14 text-2xl text-center font-display"
             disabled={gameOver}
           />
        </div>
        <Button onClick={handleGuess} disabled={gameOver || !guess} className="w-full h-12 text-base">
            <Check className="ml-2 w-5 h-5" />
            بررسی کن
        </Button>
      </div>

       <div className="w-full max-w-sm p-4 bg-muted/50 rounded-lg shadow-inner min-h-[6rem] flex flex-col items-center justify-center text-center gap-2">
            <div className="flex items-center gap-2 text-xl font-semibold">
                {getFeedbackIcon()}
                <span>{feedback || "منتظر حدس شما..."}</span>
            </div>
             {guesses.length > 0 && (
                <p className="text-sm text-muted-foreground">
                    تعداد تلاش‌ها: {attempts.toLocaleString('fa-IR')}
                </p>
            )}
       </div>
       
      <div className='flex gap-2'>
        <Button onClick={() => startNewGame(difficulty)} variant="outline">
          <Redo className="ml-2 h-4 w-4" />
          بازی جدید
        </Button>
        <Button onClick={() => setDifficulty(null)} variant="ghost" className="text-muted-foreground">
          تغییر درجه سختی
        </Button>
      </div>
    </CardContent>
  );
}
