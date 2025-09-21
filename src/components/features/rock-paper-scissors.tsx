"use client";

import { useState, useEffect } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hand, Scissors, Gem, Redo } from 'lucide-react';
import { cn } from '@/lib/utils';

type Choice = 'rock' | 'paper' | 'scissors';

const choices: { name: Choice; icon: React.ReactNode; label: string }[] = [
  { name: 'rock', icon: <Gem className="w-12 h-12" />, label: 'سنگ' },
  { name: 'paper', icon: <Hand className="w-12 h-12" />, label: 'کاغذ' },
  { name: 'scissors', icon: <Scissors className="w-12 h-12" />, label: 'قیچی' },
];

const getResult = (playerChoice: Choice, computerChoice: Choice): 'win' | 'lose' | 'draw' => {
  if (playerChoice === computerChoice) return 'draw';
  if (
    (playerChoice === 'rock' && computerChoice === 'scissors') ||
    (playerChoice === 'scissors' && computerChoice === 'paper') ||
    (playerChoice === 'paper' && computerChoice === 'rock')
  ) {
    return 'win';
  }
  return 'lose';
};

export default function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<'win' | 'lose' | 'draw' | null>(null);
  const [scores, setScores] = useState({ player: 0, computer: 0 });

  const handlePlay = (choice: Choice) => {
    const computerRandomChoice = choices[Math.floor(Math.random() * choices.length)].name;
    const gameResult = getResult(choice, computerRandomChoice);

    setPlayerChoice(choice);
    setComputerChoice(computerRandomChoice);
    setResult(gameResult);

    if (gameResult === 'win') {
      setScores(s => ({ ...s, player: s.player + 1 }));
    } else if (gameResult === 'lose') {
      setScores(s => ({ ...s, computer: s.computer + 1 }));
    }
  };

  const handleReset = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
  };
  
  const handleFullReset = () => {
    handleReset();
    setScores({ player: 0, computer: 0});
  }

  const resultText: Record<string, string> = {
    win: 'شما بردید!',
    lose: 'کامپیوتر برد!',
    draw: 'مساوی شد!',
  };
  
  const resultColor: Record<string, string> = {
    win: 'text-green-500',
    lose: 'text-red-500',
    draw: 'text-yellow-500',
  };

  const ChoiceDisplay = ({ choice, label }: { choice: Choice | null, label: string }) => {
    const selected = choices.find(c => c.name === choice);
    return (
        <div className="flex flex-col items-center gap-2">
            <p className="font-semibold text-muted-foreground">{label}</p>
            <div className="w-28 h-28 bg-muted/50 rounded-full flex items-center justify-center text-primary shadow-inner">
                {selected ? selected.icon : <span className="text-4xl">?</span>}
            </div>
        </div>
    )
  }

  return (
    <CardContent className="flex flex-col items-center gap-8">
      <div className="flex justify-around w-full max-w-sm text-center">
        <div className="font-bold text-lg">
          <p>امتیاز شما</p>
          <p className="text-4xl text-primary font-display">{scores.player.toLocaleString('fa-IR')}</p>
        </div>
        <div className="font-bold text-lg">
          <p>امتیاز کامپیوتر</p>
          <p className="text-4xl text-foreground font-display">{scores.computer.toLocaleString('fa-IR')}</p>
        </div>
      </div>

      {!result ? (
        <div className="space-y-4 text-center">
          <p className="text-lg font-semibold">انتخاب شما:</p>
          <div className="flex justify-center gap-4">
            {choices.map(choice => (
              <Button key={choice.name} onClick={() => handlePlay(choice.name)} variant="outline" size="icon" className="w-24 h-24 rounded-full flex-col gap-1">
                {choice.icon}
                <span className='text-xs'>{choice.label}</span>
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4 text-center">
            <div className="flex items-center justify-around gap-4 w-full">
                <ChoiceDisplay choice={playerChoice} label="شما"/>
                 <p className={cn("text-2xl font-bold", resultColor[result])}>
                    {resultText[result]}
                 </p>
                <ChoiceDisplay choice={computerChoice} label="کامپیوتر"/>
            </div>
          <Button onClick={handleReset} variant="default" size="lg" className="w-full">
            بازی بعد
          </Button>
        </div>
      )}
      
       <Button onClick={handleFullReset} variant="ghost" className="text-muted-foreground">
            <Redo className="ml-2 h-4 w-4" />
            شروع مجدد کل بازی
        </Button>
    </CardContent>
  );
}
