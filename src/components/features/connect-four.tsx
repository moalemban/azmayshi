"use client";

import { useState, useEffect } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Redo } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

const ROWS = 6;
const COLS = 7;
type Player = 'red' | 'yellow';
type Cell = Player | null;
type Board = Cell[][];

const createEmptyBoard = (): Board => Array.from({ length: ROWS }, () => Array(COLS).fill(null));

const GamePiece = ({ player, isLastMove }: { player: Player | null; isLastMove?: boolean }) => {
  if (!player) return null;

  const playerClasses = {
    red: "from-red-500 to-red-700 shadow-red-900/50",
    yellow: "from-yellow-400 to-yellow-600 shadow-yellow-800/50",
  };
  
  return (
      <div 
        className={cn(
            "w-full h-full rounded-full bg-gradient-to-b shadow-inner transition-transform duration-300 ease-out", 
            playerClasses[player],
            isLastMove ? 'animate-drop' : ''
        )} 
      />
  );
};

export default function ConnectFour() {
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>('red');
  const [winner, setWinner] = useState<Player | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [lastMove, setLastMove] = useState<{ row: number; col: number } | null>(null);

  const checkWinner = (currentBoard: Board): Player | null => {
    // Horizontal
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        if (currentBoard[r][c] && currentBoard[r][c] === currentBoard[r][c+1] && currentBoard[r][c] === currentBoard[r][c+2] && currentBoard[r][c] === currentBoard[r][c+3]) {
          return currentBoard[r][c];
        }
      }
    }
    // Vertical
    for (let r = 0; r <= ROWS - 4; r++) {
      for (let c = 0; c < COLS; c++) {
        if (currentBoard[r][c] && currentBoard[r][c] === currentBoard[r+1][c] && currentBoard[r][c] === currentBoard[r+2][c] && currentBoard[r][c] === currentBoard[r+3][c]) {
          return currentBoard[r][c];
        }
      }
    }
    // Diagonal (down-right)
    for (let r = 0; r <= ROWS - 4; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        if (currentBoard[r][c] && currentBoard[r][c] === currentBoard[r+1][c+1] && currentBoard[r][c] === currentBoard[r+2][c+2] && currentBoard[r][c] === currentBoard[r+3][c+3]) {
          return currentBoard[r][c];
        }
      }
    }
    // Diagonal (up-right)
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

    setLastMove(null); // Reset last move for animation
    
    const newBoard = board.map(row => [...row]);
    for (let r = ROWS - 1; r >= 0; r--) {
      if (!newBoard[r][col]) {
        newBoard[r][col] = currentPlayer;
        setBoard(newBoard);
        setTimeout(() => setLastMove({ row: r, col }), 10);
        
        const newWinner = checkWinner(newBoard);
        if (newWinner) {
          setWinner(newWinner);
        } else if (newBoard.flat().every(cell => cell !== null)) {
          setIsDraw(true);
        } else {
          setCurrentPlayer(currentPlayer === 'red' ? 'yellow' : 'red');
        }
        return;
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
  
  const getStatus = () => {
    if (winner) return { text: `بازیکن ${winner === 'red' ? 'قرمز' : 'زرد'} برنده شد! 🎉`, color: winner === 'red' ? 'bg-red-500' : 'bg-yellow-500' };
    if (isDraw) return { text: 'بازی مساوی شد!', color: 'bg-muted-foreground' };
    return { text: `نوبت بازیکن: ${currentPlayer === 'red' ? 'قرمز' : 'زرد'}`, color: currentPlayer === 'red' ? 'bg-red-500/20 text-red-600' : 'bg-yellow-500/20 text-yellow-600' };
  }
  
  const status = getStatus();

  return (
    <CardContent className="flex flex-col items-center gap-6">
      <style>
        {`@keyframes drop {
          from { transform: translateY(-300px); }
          to { transform: translateY(0); }
        }
        .animate-drop {
          animation: drop 0.4s cubic-bezier(0.5, 0, 0.75, 0) forwards;
        }`}
      </style>
      
      <Badge className={cn("text-lg font-semibold px-4 py-2", status.color)}>
        {status.text}
      </Badge>

      <div className="p-2 sm:p-4 bg-blue-800 rounded-2xl shadow-2xl inline-block">
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {Array.from({ length: COLS }).map((_, c) => (
            <div
              key={`col-${c}`}
              className="flex flex-col-reverse gap-1 sm:gap-2 cursor-pointer"
              onClick={() => handleColumnClick(c)}
            >
              {Array.from({ length: ROWS }).map((_, r) => (
                <div
                  key={`${r}-${c}`}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-900/70 rounded-full flex items-center justify-center"
                >
                  <GamePiece player={board[r][c]} isLastMove={lastMove?.row === r && lastMove?.col === c} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {(winner || isDraw) && (
        <Button onClick={resetGame} size="lg" variant="secondary">
          <Redo className="ml-2 h-5 w-5" />
          بازی جدید
        </Button>
      )}
    </CardContent>
  );
}
