"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Redo, Award, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { icons } from 'lucide-react';

const availableIcons = [
  'Cat', 'Dog', 'Fish', 'Bird', 'Apple', 'Bitcoin', 'Car', 'Cloud', 'Coffee', 'Cpu', 'Gift', 'Heart'
];

type CardItem = {
  icon: string;
  id: number;
  isFlipped: boolean;
  isMatched: boolean;
};

const shuffleArray = (array: string[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function MemoryGame() {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    // Add some required CSS for the 3D flip effect
    const style = document.createElement('style');
    style.innerHTML = `
      .transform-rotate-y-180 {
        transform: rotateY(180deg);
      }
      .backface-hidden {
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
      }
    `;
    document.head.appendChild(style);
    
    // Cleanup the style element on component unmount
    return () => {
        document.head.removeChild(style);
    };
  }, []);

  const startNewGame = useCallback(() => {
    const gameIcons = shuffleArray([...availableIcons, ...availableIcons]);
    setCards(
      gameIcons.map((icon, index) => ({
        icon,
        id: index,
        isFlipped: false,
        isMatched: false,
      }))
    );
    setFlippedCards([]);
    setMoves(0);
    setGameOver(false);
    setStartTime(null);
    setElapsedTime(0);
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  useEffect(() => {
    if (startTime && !gameOver) {
      const timer = setInterval(() => {
        setElapsedTime(Math.floor((new Date().getTime() - startTime.getTime()) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [startTime, gameOver]);


  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstCardIndex, secondCardIndex] = flippedCards;
      const firstCard = cards[firstCardIndex];
      const secondCard = cards[secondCardIndex];

      if (firstCard.icon === secondCard.icon) {
        // Match found
        setCards(prevCards =>
          prevCards.map(card =>
            card.icon === firstCard.icon ? { ...card, isMatched: true } : card
          )
        );
        setFlippedCards([]);
      } else {
        // No match
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              flippedCards.includes(card.id) ? { ...card, isFlipped: false } : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
       setMoves(m => m + 1);
    }
  }, [flippedCards, cards]);
  
  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      setGameOver(true);
      setStartTime(null);
    }
  }, [cards]);


  const handleCardClick = (id: number) => {
    if (gameOver || flippedCards.length >= 2 || cards[id].isFlipped) {
      return;
    }
    
    if(!startTime) {
        setStartTime(new Date());
    }

    setCards(prevCards =>
      prevCards.map(card =>
        card.id === id ? { ...card, isFlipped: true } : card
      )
    );
    setFlippedCards(prev => [...prev, id]);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }


  const Card = ({ item }: { item: CardItem }) => {
    const IconComponent = icons[item.icon as keyof typeof icons];
    return (
        <div 
            className="w-16 h-16 sm:w-20 sm:h-20"
            onClick={() => handleCardClick(item.id)}
            style={{ perspective: '1000px' }}
        >
            <div className={cn("relative w-full h-full transition-transform duration-500", (item.isFlipped || item.isMatched) && "transform-rotate-y-180")}
                 style={{ transformStyle: 'preserve-3d' }}>
                {/* Card Back */}
                 <div className="absolute w-full h-full bg-primary/80 rounded-lg flex items-center justify-center cursor-pointer backface-hidden">
                    <span className="text-3xl text-primary-foreground">?</span>
                </div>
                {/* Card Front */}
                <div className="absolute w-full h-full bg-muted rounded-lg flex items-center justify-center transform-rotate-y-180 backface-hidden">
                    <IconComponent className="w-10 h-10 text-foreground" />
                </div>
            </div>
        </div>
    )
  }

  return (
    <CardContent className="flex flex-col items-center gap-6">
       <div className="flex justify-around w-full max-w-md bg-muted/30 p-2 rounded-xl">
            <div className="flex flex-col items-center">
                <span className="text-sm text-muted-foreground">حرکت</span>
                <span className="text-2xl font-bold font-display">{moves.toLocaleString('fa-IR')}</span>
            </div>
            <div className="flex flex-col items-center">
                <span className="text-sm text-muted-foreground">زمان</span>
                <span className="text-2xl font-bold font-display">{formatTime(elapsedTime)}</span>
            </div>
       </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4 justify-center">
        {cards.map(item => (
          <Card key={item.id} item={item} />
        ))}
      </div>

       {gameOver && (
            <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-4 z-10 backdrop-blur-sm">
                <Award className="w-20 h-20 text-yellow-400 animate-bounce" />
                <h3 className="text-3xl font-bold text-foreground">تبریک! شما بردید!</h3>
                <div className="flex gap-4 text-lg">
                    <p>تعداد حرکات: <span className="font-bold text-primary">{moves.toLocaleString('fa-IR')}</span></p>
                    <p>زمان: <span className="font-bold text-primary">{formatTime(elapsedTime)}</span></p>
                </div>
                <Button onClick={startNewGame} size="lg">
                    <Redo className="ml-2 h-5 w-5" />
                    بازی جدید
                </Button>
            </div>
        )}
      
       {!gameOver && (
          <Button onClick={startNewGame} variant="outline">
            <Redo className="ml-2 h-4 w-4" />
            شروع مجدد
          </Button>
       )}
    </CardContent>
  );
}
