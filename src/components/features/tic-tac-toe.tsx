"use client";

import { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Redo, X, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

const Square = ({ value, onSquareClick }: { value: 'X' | 'O' | null, onSquareClick: () => void }) => {
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

const calculateWinner = (squares: Array<'X' | 'O' | null>) => {
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
  const [squares, setSquares] = useState<Array<'X' | 'O' | null>>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(Boolean);

  let status;
  if (winner) {
    status = `برنده: بازیکن ${winner}`;
  } else if (isDraw) {
    status = 'بازی مساوی شد!';
  } else {
    status = `نوبت بازیکن: ${xIsNext ? 'X' : 'O'}`;
  }

  const handleClick = (i: number) => {
    if (squares[i] || winner) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  };

  const handleReset = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };
  
  const getStatusBadgeVariant = () => {
    if(winner === 'X') return 'bg-blue-500/20 text-blue-700 dark:text-blue-400';
    if(winner === 'O') return 'bg-pink-500/20 text-pink-700 dark:text-pink-400';
    if(isDraw) return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400';
    return 'default';
  }

  return (
    <CardContent className="flex flex-col items-center gap-6">
      <Badge variant="outline" className={cn("text-lg font-semibold h-10 px-6", getStatusBadgeVariant())}>
        {status}
      </Badge>
      
      <div className="grid grid-cols-3 gap-2">
        {squares.map((square, i) => (
          <Square key={i} value={square} onSquareClick={() => handleClick(i)} />
        ))}
      </div>

      <Button onClick={handleReset} variant="outline">
        <Redo className="ml-2 h-4 w-4" />
        شروع مجدد
      </Button>
    </CardContent>
  );
}
