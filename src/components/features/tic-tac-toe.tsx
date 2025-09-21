"use client";

import { useState, useEffect } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Redo, X, Circle, User, Bot as BotIcon, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

type Player = 'X' | 'O';
type SquareValue = Player | null;
type GameMode = 'two-player' | 'vs-computer';
type Difficulty = 'easy' | 'medium' | 'hard';

const Square = ({ value, onSquareClick }: { value: SquareValue, onSquareClick: () => void }) => {
  return (
    <button 
      className="w-20 h-20 sm:w-24 sm:h-24 bg-muted/50 rounded-lg flex items-center justify-center shadow-inner text-5xl font-bold"
      onClick={onSquareClick}
    >
        {value === 'X' && <X className="w-12 h-12 text-blue-400" />}
        {value === 'O' && <Circle className="w-12 h-12 text-pink-400" />}
    </button>
  );
};

const calculateWinner = (squares: Array<SquareValue>) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

export default function TicTacToe() {
  const [squares, setSquares] = useState<Array<SquareValue>>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  
  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(Boolean);

  const makeComputerMove = (currentSquares: Array<SquareValue>) => {
    if (difficulty === 'easy') {
      const emptySquares = currentSquares.map((sq, i) => sq === null ? i : null).filter(i => i !== null);
      if(emptySquares.length > 0) return emptySquares[Math.floor(Math.random() * emptySquares.length)] as number;
      return null;
    }

    // Check if computer can win
    for (let i = 0; i < 9; i++) {
        if (!currentSquares[i]) {
            const tempSquares = currentSquares.slice();
            tempSquares[i] = 'O';
            if (calculateWinner(tempSquares) === 'O') return i;
        }
    }
    // Check if player can win and block
    for (let i = 0; i < 9; i++) {
        if (!currentSquares[i]) {
            const tempSquares = currentSquares.slice();
            tempSquares[i] = 'X';
            if (calculateWinner(tempSquares) === 'X') return i;
        }
    }
    
    // Hard difficulty: try to take strategic spots
    if (difficulty === 'hard') {
        const strategicMoves = [4, 0, 2, 6, 8]; // center, corners
        for (const move of strategicMoves) {
            if (!currentSquares[move]) return move;
        }
    }
    
    // Fallback to random move
    const emptySquares = currentSquares.map((sq, i) => sq === null ? i : null).filter(i => i !== null);
    if(emptySquares.length > 0) return emptySquares[Math.floor(Math.random() * emptySquares.length)] as number;

    return null;
  }

  useEffect(() => {
    if (gameMode === 'vs-computer' && !xIsNext && !winner && !isDraw) {
        const computerMove = makeComputerMove(squares);
        if (computerMove !== null) {
            setTimeout(() => {
                handleClick(computerMove, true);
            }, 500);
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xIsNext, gameMode, squares, winner, isDraw, difficulty]);

  const handleClick = (i: number, isComputerMove = false) => {
    if (squares[i] || winner) return;
    if (gameMode === 'vs-computer' && !xIsNext && !isComputerMove) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  };

  const handleReset = (fullReset = false) => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    if(fullReset) {
        setGameMode(null);
        setDifficulty(null);
    }
  };

  const renderStatus = () => {
    if (winner) return `برنده: بازیکن ${winner}`;
    if (isDraw) return 'بازی مساوی شد!';
    if(gameMode === 'vs-computer') {
        return xIsNext ? "نوبت شما (X)" : "نوبت ربات (O)...";
    }
    return `نوبت بازیکن: ${xIsNext ? 'X' : 'O'}`;
  }
  
  const getStatusBadgeVariant = () => {
    if(winner === 'X') return 'bg-blue-500/20 text-blue-700 dark:text-blue-400';
    if(winner === 'O') return 'bg-pink-500/20 text-pink-700 dark:text-pink-400';
    if(isDraw) return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400';
    return 'default';
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

  if (gameMode === 'vs-computer' && !difficulty) {
    return (
        <CardContent className="flex flex-col items-center gap-4 pt-6">
            <h3 className="text-lg font-semibold text-foreground">درجه سختی ربات را انتخاب کنید:</h3>
            <div className="flex gap-4">
               <Button onClick={() => setDifficulty('easy')} className="h-12">آسان</Button>
               <Button onClick={() => setDifficulty('medium')} className="h-12">متوسط</Button>
               <Button onClick={() => setDifficulty('hard')} className="h-12">سخت</Button>
            </div>
             <Button onClick={() => handleReset(true)} variant="link" className="text-muted-foreground">بازگشت</Button>
        </CardContent>
    )
  }

  return (
    <CardContent className="flex flex-col items-center gap-6 pt-6">
      <Badge variant="outline" className={cn("text-lg font-semibold h-10 px-6", getStatusBadgeVariant())}>
        {renderStatus()}
      </Badge>
      
      <div className="grid grid-cols-3 gap-2">
        {squares.map((square, i) => (
          <Square key={i} value={square} onSquareClick={() => handleClick(i)} />
        ))}
      </div>

      <div className="flex gap-2">
        <Button onClick={() => handleReset()} variant="outline">
            <Redo className="ml-2 h-4 w-4" />
            بازی مجدد
        </Button>
         <Button onClick={() => handleReset(true)} variant="ghost" className="text-muted-foreground">
            تغییر حالت بازی
        </Button>
      </div>
    </CardContent>
  );
}
