"use client";

import { useState, useEffect } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Redo, Award, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

const ROWS = 6;
const COLS = 7;

type Player = 'red' | 'yellow';
type Cell = Player | null;
type Board = Cell[][];

const createEmptyBoard = (): Board => Array.from({ length: ROWS }, () => Array(COLS).fill(null));

export default function ConnectFour() {
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>('red');
  const [winner, setWinner] = useState<Player | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [lastMove, setLastMove] = useState<{ row: number, col: number } | null>(null);

  const checkWinner = (currentBoard: Board): Player | null => {
    // Check horizontal
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        if (currentBoard[r][c] && currentBoard[r][c] === currentBoard[r][c+1] && currentBoard[r][c] === currentBoard[r][c+2] && currentBoard[r][c] === currentBoard[r][c+3]) {
          return currentBoard[r][c];
        }
      }
    }
    // Check vertical
    for (let r = 0; r <= ROWS - 4; r++) {
      for (let c = 0; c < COLS; c++) {
        if (currentBoard[r][c] && currentBoard[r][c] === currentBoard[r+1][c] && currentBoard[r][c] === currentBoard[r+2][c] && currentBoard[r][c] === currentBoard[r+3][c]) {
          return currentBoard[r][c];
        }
      }
    }
    // Check diagonal (down-right)
    for (let r = 0; r <= ROWS - 4; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        if (currentBoard[r][c] && currentBoard[r][c] === currentBoard[r+1][c+1] && currentBoard[r][c] === currentBoard[r+2][c+2] && currentBoard[r][c] === currentBoard[r+3][c+3]) {
          return currentBoard[r][c];
        }
      }
    }
    // Check diagonal (up-right)
    for (let r = 3; r < ROWS; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        if (currentBoard[r][c] && currentBoard[r][c] === currentBoard[r-1][c+1] && currentBoard[r][c] === currentBoard[r-2][c+2] && currentBoard[r][c] === currentBoard[r-3][c+3]) {
          return currentBoard[r][c];
        }
      }
    }
    return null;
  };

  const handleColumnClick = (col: number) => {
    if (winner || board[0][col]) return;

    const newBoard = board.map(row => [...row]);
    for (let r = ROWS - 1; r >= 0; r--) {
      if (!newBoard[r][col]) {
        newBoard[r][col] = currentPlayer;
        setLastMove({ row: r, col });
        setBoard(newBoard);
        
        const newWinner = checkWinner(newBoard);
        if (newWinner) {
          setWinner(newWinner);
        } else if (newBoard.flat().every(cell => cell !== null)) {
          setIsDraw(true);
        } else {
          setCurrentPlayer(currentPlayer === 'red' ? 'yellow' : 'red');
        }
        break;
      }
    }
  };

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer('red');
    setWinner(null);
    setIsDraw(false);
    setLastMove(null);
  };
  
  const getStatusText = () => {
    if (winner) return `بازیکن ${winner === 'red' ? 'قرمز' : 'زرد'} برنده شد! 🎉`;
    if (isDraw) return 'بازی مساوی شد!';
    return `نوبت بازیکن: ${currentPlayer === 'red' ? 'قرمز' : 'زرد'}`;
  }

  return (
    <CardContent className="flex flex-col items-center gap-6">
      <Badge className={cn(
        "text-lg font-semibold px-4 py-2",
        winner === 'red' && 'bg-red-500',
        winner === 'yellow' && 'bg-yellow-500',
        isDraw && 'bg-muted-foreground'
      )}>
        {getStatusText()}
      </Badge>

      <div className="p-2 sm:p-4 bg-blue-800 rounded-2xl shadow-2xl inline-block">
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {board.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center cursor-pointer"
                onClick={() => handleColumnClick(c)}
              >
                <div className="relative w-full h-full">
                  <Circle className="w-full h-full text-blue-900" fill="currentColor"/>
                  {cell && (
                    <Circle 
                      className={cn(
                        "w-full h-full absolute top-0 left-0 transition-transform duration-500 ease-out",
                        cell === 'red' ? 'text-red-500' : 'text-yellow-400',
                         lastMove?.row === r && lastMove?.col === c ? 'transform-none' : 'transform -translate-y-96'
                      )}
                      style={{ transitionDelay: `${r * 0.05}s`}}
                      fill="currentColor"
                    />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {(winner || isDraw) && (
        <Button onClick={resetGame} size="lg">
          <Redo className="ml-2 h-5 w-5" />
          بازی جدید
        </Button>
      )}
    </CardContent>
  );
}
