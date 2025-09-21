"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Redo, Trophy, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

const BOARD_SIZE = 8;
type Player = 'black' | 'white';
type CellState = Player | null;
type Board = CellState[][];

const createInitialBoard = (): Board => {
  const board: Board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
  board[3][3] = 'white';
  board[3][4] = 'black';
  board[4][3] = 'black';
  board[4][4] = 'white';
  return board;
};

const directions = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],         [0, 1],
  [1, -1], [1, 0], [1, 1],
];

export default function OthelloGame() {
  const [board, setBoard] = useState<Board>(createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>('black');
  const [scores, setScores] = useState({ black: 2, white: 2 });
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);

  const opponent = useMemo(() => (currentPlayer === 'black' ? 'white' : 'black'), [currentPlayer]);

  const getValidMoves = useCallback((boardState: Board, player: Player): [number, number][] => {
    const moves: [number, number][] = [];
    const opp = player === 'black' ? 'white' : 'black';

    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (boardState[r][c] !== null) continue;

        let isValidMove = false;
        for (const [dr, dc] of directions) {
          let r_ = r + dr;
          let c_ = c + dc;
          let hasOpponentPiece = false;

          while (r_ >= 0 && r_ < BOARD_SIZE && c_ >= 0 && c_ < BOARD_SIZE) {
            if (boardState[r_][c_] === opp) {
              hasOpponentPiece = true;
            } else if (boardState[r_][c_] === player) {
              if (hasOpponentPiece) {
                isValidMove = true;
              }
              break;
            } else {
              break;
            }
            r_ += dr;
            c_ += dc;
          }
          if (isValidMove) break;
        }
        if (isValidMove) {
          moves.push([r, c]);
        }
      }
    }
    return moves;
  }, []);

  const validMoves = useMemo(() => getValidMoves(board, currentPlayer), [board, currentPlayer, getValidMoves]);

  const calculateScores = (boardState: Board) => {
    let black = 0;
    let white = 0;
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (boardState[r][c] === 'black') black++;
        if (boardState[r][c] === 'white') white++;
      }
    }
    return { black, white };
  };

  const checkGameOver = useCallback((boardState: Board) => {
    const blackMoves = getValidMoves(boardState, 'black');
    const whiteMoves = getValidMoves(boardState, 'white');

    if (blackMoves.length === 0 && whiteMoves.length === 0) {
      setGameOver(true);
      const finalScores = calculateScores(boardState);
      if (finalScores.black > finalScores.white) setWinner('black');
      else if (finalScores.white > finalScores.black) setWinner('white');
      else setWinner('draw');
    }
  }, [getValidMoves]);
  
  useEffect(() => {
    checkGameOver(board);
  }, [board, checkGameOver]);

  const handleCellClick = (row: number, col: number) => {
    if (gameOver || !validMoves.some(([r, c]) => r === row && c === col)) return;

    const newBoard = board.map(r => [...r]);
    const piecesToFlip = [];

    for (const [dr, dc] of directions) {
      let r = row + dr;
      let c = col + dc;
      const lineToFlip = [];

      while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
        if (newBoard[r][c] === opponent) {
          lineToFlip.push([r, c]);
        } else if (newBoard[r][c] === currentPlayer) {
          piecesToFlip.push(...lineToFlip);
          break;
        } else {
          break;
        }
        r += dr;
        c += dc;
      }
    }

    newBoard[row][col] = currentPlayer;
    piecesToFlip.forEach(([r, c]) => {
      newBoard[r][c] = currentPlayer;
    });

    setBoard(newBoard);
    const newScores = calculateScores(newBoard);
    setScores(newScores);

    // Switch player
    const opponentHasMoves = getValidMoves(newBoard, opponent).length > 0;
    if (opponentHasMoves) {
      setCurrentPlayer(opponent);
    } else {
      // If opponent has no moves, current player plays again if they have moves
      const currentPlayerHasMoves = getValidMoves(newBoard, currentPlayer).length > 0;
      if (!currentPlayerHasMoves) {
         checkGameOver(newBoard);
      }
    }
  };

  const startNewGame = () => {
    setBoard(createInitialBoard());
    setCurrentPlayer('black');
    setScores({ black: 2, white: 2 });
    setGameOver(false);
    setWinner(null);
  };
  
  const getStatusText = () => {
      if (winner) {
          if(winner === 'draw') return "بازی مساوی شد!";
          return `برنده: بازیکن ${winner === 'black' ? 'سیاه' : 'سفید'}`;
      }
      return `نوبت بازیکن: ${currentPlayer === 'black' ? 'سیاه' : 'سفید'}`;
  }

  return (
    <CardContent className="flex flex-col items-center gap-4">
       <div className="flex justify-around items-center w-full max-w-sm bg-muted/50 p-3 rounded-xl shadow-inner">
            <div className="text-center font-semibold text-lg flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-black border-2 border-white"/>
                <span>{scores.black.toLocaleString('fa-IR')}</span>
            </div>
            <Badge variant="outline" className="text-base font-semibold px-4 py-1">
                {getStatusText()}
            </Badge>
            <div className="text-center font-semibold text-lg flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-white border-2 border-black"/>
                <span>{scores.white.toLocaleString('fa-IR')}</span>
            </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 rounded-lg bg-muted/30 max-w-sm text-center">
          <Info className="w-5 h-5 shrink-0" />
          <span>
             مهره‌های حریف را بین مهره‌های خود محاصره کنید تا به رنگ شما درآیند. بازیکنی که در پایان بیشترین مهره را داشته باشد، برنده است.
          </span>
        </div>

      <div className="p-2 bg-green-800 rounded-lg shadow-xl">
        <div className="grid grid-cols-8 gap-1">
          {board.map((row, r) =>
            row.map((cell, c) => {
              const isHint = validMoves.some(([vr, vc]) => vr === r && vc === c);
              return (
                <div
                  key={`${r}-${c}`}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 flex items-center justify-center cursor-pointer rounded"
                  onClick={() => handleCellClick(r, c)}
                >
                  {cell ? (
                    <div className={cn("w-5/6 h-5/6 rounded-full shadow-md transition-transform duration-300", 
                        cell === 'black' ? 'bg-black' : 'bg-white')} />
                  ) : isHint && !gameOver ? (
                    <div className={cn("w-1/3 h-1/3 rounded-full opacity-50",
                        currentPlayer === 'black' ? 'bg-black' : 'bg-white'
                    )} />
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </div>

       {gameOver && (
        <div className="text-center space-y-2">
           <Trophy className="w-12 h-12 text-yellow-400 mx-auto animate-bounce"/>
           <p className="text-xl font-bold">بازی تمام شد!</p>
        </div>
      )}
      
      <Button onClick={startNewGame} variant="outline">
        <Redo className="ml-2 h-4 w-4" />
        بازی جدید
      </Button>

    </CardContent>
  );
}
