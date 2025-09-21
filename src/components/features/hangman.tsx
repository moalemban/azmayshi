"use client";

import { useState, useEffect, useCallback } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Redo, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

const words = [
  'جاوااسکریپت', 'ری‌اکت', 'کامپوننت', 'اپلیکیشن', 'برنامه‌نویسی', 'توسعه‌دهنده',
  'هوشمند', 'تبدیلا', 'طراحی', 'کاربردی', 'سرویس', 'اینترنت'
];
const alphabet = 'ا ب پ ت ث ج چ ح خ د ذ ر ز ژ س ش ص ض ط ظ ع غ ف ق ک گ ل م ن و ه ی'.split(' ');

const HangmanFigure = ({ wrongGuesses }: { wrongGuesses: number }) => {
  const parts = [
    <line key="1" x1="60" y1="20" x2="140" y2="20" />, // Top bar
    <line key="2" x1="140" y1="20" x2="140" y2="50" />, // Rope
    <circle key="3" cx="140" cy="70" r="20" />, // Head
    <line key="4" x1="140" y1="90" x2="140" y2="150" />, // Body
    <line key="5" x1="140" y1="120" x2="110" y2="100" />, // Left arm
    <line key="6" x1="140" y1="120" x2="170" y2="100" />, // Right arm
    <line key="7" x1="140" y1="150" x2="110" y2="180" />, // Left leg
    <line key="8" x1="140" y1="150" x2="170" y2="180" />, // Right leg
  ];

  return (
    <svg height="250" width="200" className="stroke-current text-foreground mx-auto">
      {/* Stand */}
      <line x1="20" y1="230" x2="100" y2="230" />
      <line x1="60" y1="230" x2="60" y2="20" />
      {/* Figure parts */}
      {parts.slice(0, wrongGuesses)}
    </svg>
  );
};

export default function Hangman() {
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);

  const startNewGame = useCallback(() => {
    setWord(words[Math.floor(Math.random() * words.length)]);
    setGuessedLetters([]);
    setMistakes(0);
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const wrongGuesses = guessedLetters.filter(letter => !word.includes(letter)).length;
  const isWinner = word.split('').every(letter => guessedLetters.includes(letter));
  const isLoser = wrongGuesses >= 8;
  const gameOver = isWinner || isLoser;

  const handleGuess = (letter: string) => {
    if (gameOver || guessedLetters.includes(letter)) return;
    setGuessedLetters(prev => [...prev, letter]);
  };

  const getHint = () => {
    const unGuessedLetters = word.split('').filter(letter => !guessedLetters.includes(letter));
    if (unGuessedLetters.length > 0) {
      const hintLetter = unGuessedLetters[Math.floor(Math.random() * unGuessedLetters.length)];
      handleGuess(hintLetter);
    }
  };

  return (
    <CardContent className="flex flex-col items-center gap-6">
      <HangmanFigure wrongGuesses={wrongGuesses} />

      <div dir="rtl" className="flex justify-center gap-2 text-2xl sm:text-3xl font-bold tracking-[0.2em]">
        {word.split('').map((letter, index) => (
          <span key={index} className="w-10 h-14 border-b-4 flex items-center justify-center">
            {guessedLetters.includes(letter) ? letter : '_'}
          </span>
        ))}
      </div>

      {gameOver ? (
        <div className="text-center space-y-4">
          <p className={cn("text-2xl font-bold", isWinner ? 'text-green-500' : 'text-red-500')}>
            {isWinner ? '🎉 شما بردید! 🎉' : 'باختی! دوباره تلاش کن.'}
          </p>
          {!isWinner && <p className="text-lg">کلمه صحیح: <span className="font-bold text-primary">{word}</span></p>}
          <Button onClick={startNewGame}>
            <Redo className="ml-2 h-4 w-4" />
            بازی جدید
          </Button>
        </div>
      ) : (
        <div className="w-full max-w-lg space-y-4">
          <div dir="rtl" className="flex flex-wrap justify-center gap-2">
            {alphabet.map(letter => (
              <Button
                key={letter}
                onClick={() => handleGuess(letter)}
                disabled={guessedLetters.includes(letter)}
                variant="outline"
                className="w-12 h-12 text-lg"
              >
                {letter}
              </Button>
            ))}
          </div>
          <Button onClick={getHint} variant="secondary" className="w-full">
            <Lightbulb className="ml-2 h-4 w-4"/>
            راهنمایی بگیر
          </Button>
        </div>
      )}
    </CardContent>
  );
}
