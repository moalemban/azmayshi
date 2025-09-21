"use client";

import { useState, useEffect } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hand, Scissors, Gem, Redo, Bot as BotIcon, Users, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';

type Choice = 'rock' | 'paper' | 'scissors';
type GameMode = 'vs-computer' | 'two-player';
type Difficulty = 'easy' | 'medium' | 'hard';

const choices: { name: Choice; icon: React.ReactNode; label: string }[] = [
  { name: 'rock', icon: <Gem className="w-12 h-12" />, label: 'سنگ' },
  { name: 'paper', icon: <Hand className="w-12 h-12" />, label: 'کاغذ' },
  { name: 'scissors', icon: <Scissors className="w-12 h-12" />, label: 'قیچی' },
];

const getResult = (player1Choice: Choice, player2Choice: Choice): 'win' | 'lose' | 'draw' => {
  if (player1Choice === player2Choice) return 'draw';
  if (
    (player1Choice === 'rock' && player2Choice === 'scissors') ||
    (player1Choice === 'scissors' && player2Choice === 'paper') ||
    (player1Choice === 'paper' && player2Choice === 'rock')
  ) {
    return 'win';
  }
  return 'lose';
};

const getComputerChoice = (difficulty: Difficulty, playerHistory: Choice[]): Choice => {
    // For now, AI is random. Difficulty can be implemented later.
    return choices[Math.floor(Math.random() * choices.length)].name;
}

export default function RockPaperScissors() {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [player1Choice, setPlayer1Choice] = useState<Choice | null>(null);
  const [player2Choice, setPlayer2Choice] = useState<Choice | null>(null);
  const [result, setResult] = useState<'win' | 'lose' | 'draw' | null>(null);
  const [scores, setScores] = useState({ player1: 0, computer: 0, player2: 0, draws: 0 });
  const [isPlayer1Turn, setIsPlayer1Turn] = useState(true);
  const [playerHistory, setPlayerHistory] = useState<Choice[]>([]);


  const handlePlay = (choice: Choice) => {
    if(gameMode === 'two-player') {
        if(isPlayer1Turn) {
            setPlayer1Choice(choice);
            setIsPlayer1Turn(false);
        } else {
            setPlayer2Choice(choice);
            const gameResult = getResult(player1Choice!, choice);
            setResult(gameResult);
             if (gameResult === 'win') setScores(s => ({ ...s, player1: s.player1 + 1 }));
             else if (gameResult === 'lose') setScores(s => ({ ...s, player2: s.player2 + 1 }));
             else setScores(s => ({ ...s, draws: s.draws + 1 }));
        }
    } else { // vs-computer
        const computerRandomChoice = getComputerChoice(difficulty!, playerHistory);
        const gameResult = getResult(choice, computerRandomChoice);
        setPlayerHistory(prev => [...prev, choice]);

        setPlayer1Choice(choice);
        setPlayer2Choice(computerRandomChoice);
        setResult(gameResult);

        if (gameResult === 'win') setScores(s => ({ ...s, player1: s.player1 + 1 }));
        else if (gameResult === 'lose') setScores(s => ({ ...s, computer: s.computer + 1 }));
        else setScores(s => ({...s, draws: s.draws + 1}));
    }
  };

  const handleReset = () => {
    setPlayer1Choice(null);
    setPlayer2Choice(null);
    setResult(null);
    setIsPlayer1Turn(true);
  };
  
  const handleFullReset = (modeChange = false) => {
    handleReset();
    if(modeChange) {
        setGameMode(null);
        setDifficulty(null);
    }
    setScores({ player1: 0, computer: 0, player2: 0, draws: 0 });
    setPlayerHistory([]);
  }
  
  const resultText: Record<string, string> = {
    win: gameMode === 'two-player' ? 'بازیکن ۱ برنده شد!' : 'شما بردید!',
    lose: gameMode === 'two-player' ? 'بازیکن ۲ برنده شد!' : 'ربات برد!',
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

  if (!gameMode) {
      return (
          <CardContent className="flex flex-col items-center gap-4 pt-6">
              <h3 className="text-lg font-semibold text-foreground">حالت بازی را انتخاب کنید:</h3>
              <div className="flex gap-4">
                 <Button onClick={() => setGameMode('two-player')} className="h-12 text-base">
                      <Users className="ml-2 w-5 h-5"/>
                      بازی با دوست
                  </Button>
                  <Button onClick={() => setGameMode('vs-computer')} variant="secondary" className="h-12 text-base">
                       <BotIcon className="ml-2 w-5 h-5"/>
                      بازی با ربات
                  </Button>
              </div>
          </CardContent>
      )
  }

  if(gameMode === 'vs-computer' && !difficulty) {
      return (
          <CardContent className="flex flex-col items-center gap-4 pt-6">
              <h3 className="text-lg font-semibold text-foreground">درجه سختی ربات را انتخاب کنید:</h3>
              <div className="flex gap-4">
                 <Button onClick={() => setDifficulty('easy')} className="h-12">آسان</Button>
                 <Button onClick={() => setDifficulty('medium')} className="h-12">متوسط</Button>
                 <Button onClick={() => setDifficulty('hard')} className="h-12">سخت</Button>
              </div>
               <Button onClick={() => handleFullReset(true)} variant="link" className="text-muted-foreground">بازگشت</Button>
          </CardContent>
      )
  }
  
  const renderTurnStatus = () => {
    if (result) return <p className={cn("text-2xl font-bold", resultColor[result])}>{resultText[result]}</p>;
    if (gameMode === 'two-player') return <p className="text-xl font-semibold">نوبت بازیکن {isPlayer1Turn ? '۱' : '۲'}</p>;
    return <p className="text-xl font-semibold">انتخاب شما:</p>;
  }

  return (
    <CardContent className="flex flex-col items-center gap-8">
       <div className="flex justify-around w-full max-w-md text-center">
            <div className="font-bold text-lg">
                <p>{gameMode === 'two-player' ? 'امتیاز بازیکن ۱' : 'امتیاز شما'}</p>
                <p className="text-4xl text-primary font-display">{scores.player1.toLocaleString('fa-IR')}</p>
            </div>
             <div className="font-bold text-lg text-muted-foreground">
                <p>مساوی</p>
                <p className="text-4xl font-display">{scores.draws.toLocaleString('fa-IR')}</p>
            </div>
            <div className="font-bold text-lg">
                <p>{gameMode === 'two-player' ? 'امتیاز بازیکن ۲' : 'امتیاز ربات'}</p>
                <p className="text-4xl text-foreground font-display">{(gameMode === 'two-player' ? scores.player2 : scores.computer).toLocaleString('fa-IR')}</p>
            </div>
      </div>
      
      {gameMode === 'vs-computer' && (
          <div className="flex flex-col items-center gap-2">
            <Label>درجه سختی</Label>
            <div className="flex p-1 bg-muted rounded-lg">
                 {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                     <Button key={d} variant={difficulty === d ? 'default' : 'ghost'} size="sm" onClick={() => setDifficulty(d)}>
                         {d === 'easy' ? 'آسان' : d === 'medium' ? 'متوسط' : 'سخت'}
                     </Button>
                 ))}
            </div>
          </div>
      )}


      {!result ? (
        <div className="space-y-4 text-center">
          {renderTurnStatus()}
           {(gameMode === 'two-player' && !isPlayer1Turn) ? (
                <div className='flex flex-col items-center gap-4 p-4 bg-muted/30 rounded-lg'>
                     <p className='text-muted-foreground'>بازیکن ۱ انتخاب کرد. حالا نوبت بازیکن ۲ است.</p>
                     <div className="flex justify-center gap-4">
                        {choices.map(choice => (
                            <Button key={choice.name} onClick={() => handlePlay(choice.name)} variant="outline" size="icon" className="w-24 h-24 rounded-full flex-col gap-1">
                                {choice.icon} <span className='text-xs'>{choice.label}</span>
                            </Button>
                        ))}
                    </div>
                </div>
           ) : (
                <div className="flex justify-center gap-4">
                    {choices.map(choice => (
                    <Button key={choice.name} onClick={() => handlePlay(choice.name)} variant="outline" size="icon" className="w-24 h-24 rounded-full flex-col gap-1">
                        {choice.icon} <span className='text-xs'>{choice.label}</span>
                    </Button>
                    ))}
                </div>
           )}
        </div>
      ) : (
        <div className="space-y-4 text-center w-full">
            <div className="flex items-center justify-around gap-4 w-full">
                <ChoiceDisplay choice={player1Choice} label={gameMode === 'two-player' ? "بازیکن ۱" : "شما"}/>
                 {renderTurnStatus()}
                <ChoiceDisplay choice={player2Choice} label={gameMode === 'two-player' ? "بازیکن ۲" : "ربات"}/>
            </div>
          <Button onClick={handleReset} variant="default" size="lg" className="w-full">
            دست بعدی
          </Button>
        </div>
      )}
      
       <Button onClick={() => handleFullReset(true)} variant="ghost" className="text-muted-foreground">
            <Redo className="ml-2 h-4 w-4" />
            تغییر حالت بازی
        </Button>
    </CardContent>
  );
}
