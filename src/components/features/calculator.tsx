"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator as CalculatorIcon, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function QuickCalculator() {
  const [displayValue, setDisplayValue] = useState('0');
  const [operator, setOperator] = useState<string | null>(null);
  const [firstOperand, setFirstOperand] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [operationDisplay, setOperationDisplay] = useState('');

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplayValue(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
        setDisplayValue('0.');
        setWaitingForSecondOperand(false);
        return;
    }
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const clearAll = () => {
    setDisplayValue('0');
    setOperator(null);
    setFirstOperand(null);
    setWaitingForSecondOperand(false);
    setOperationDisplay('');
  };

  const performCalculation = (op: string, first: number, second: number): number => {
      switch (op) {
        case '/': return first / second;
        case '*': return first * second;
        case '+': return first + second;
        case '-': return first - second;
        default: return second;
      }
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForSecondOperand) {
      setOperator(nextOperator);
      setOperationDisplay(`${firstOperand} ${nextOperator}`);
      return;
    }

    if (firstOperand === null) {
      setFirstOperand(String(inputValue));
    } else if (operator) {
      const result = performCalculation(operator, parseFloat(firstOperand), inputValue);
      const newHistoryEntry = `${operationDisplay} ${displayValue} = ${result}`;
      setHistory([newHistoryEntry, ...history]);
      setDisplayValue(String(result));
      setFirstOperand(String(result));
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
    setOperationDisplay(`${displayValue} ${nextOperator}`);
  };
  
  const handleEquals = () => {
    if (!operator || firstOperand === null) return;
    
    const secondOperand = displayValue;
    const result = performCalculation(operator, parseFloat(firstOperand), parseFloat(secondOperand));
    const newHistoryEntry = `${firstOperand} ${operator} ${secondOperand} = ${result}`;

    setHistory([newHistoryEntry, ...history]);
    setDisplayValue(String(result));
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
    setOperationDisplay('');
  };

  const buttons = [
    { label: 'C', handler: clearAll, className: 'col-span-2 bg-destructive/80 hover:bg-destructive text-destructive-foreground' },
    { label: '÷', handler: () => handleOperator('/'), variant: 'secondary' },
    { label: '×', handler: () => handleOperator('*'), variant: 'secondary' },
    { label: '۷', handler: () => inputDigit('7') },
    { label: '۸', handler: () => inputDigit('8') },
    { label: '۹', handler: () => inputDigit('9') },
    { label: '-', handler: () => handleOperator('-'), variant: 'secondary' },
    { label: '۴', handler: () => inputDigit('4') },
    { label: '۵', handler: () => inputDigit('5') },
    { label: '۶', handler: () => inputDigit('6') },
    { label: '+', handler: () => handleOperator('+'), variant: 'secondary' },
    { label: '۱', handler: () => inputDigit('1') },
    { label: '۲', handler: () => inputDigit('2') },
    { label: '۳', handler: () => inputDigit('3') },
    { label: '=', handler: handleEquals, className: 'row-span-2', variant: 'primary' },
    { label: '۰', handler: () => inputDigit('0'), className: 'col-span-2' },
    { label: '.', handler: inputDecimal },
  ];

  return (
    <Card className="h-full flex flex-col group/card transition-all duration-300 hover:border-primary/50">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalculatorIcon className="h-6 w-6 text-primary" />
          ماشین حساب پیشرفته
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col md:flex-row gap-4">
        <div className="flex-grow flex flex-col">
          <div className="bg-background/50 rounded-lg p-4 w-full text-left mb-4 shadow-inner">
            <p className="text-muted-foreground text-sm text-right h-6" dir="ltr">
              {operationDisplay}
            </p>
            <p className="text-4xl font-mono break-all text-right text-foreground" dir="ltr">
              {parseFloat(displayValue).toLocaleString('fa-IR', { maximumFractionDigits: 10 })}
            </p>
          </div>
          <div className="grid grid-cols-4 grid-rows-5 gap-2 flex-grow">
            {buttons.map(({ label, handler, className, variant }) => (
              <Button
                key={label}
                onClick={handler}
                className={cn('text-xl h-full w-full shadow-md hover:shadow-lg transition-shadow', className)}
                variant={variant as any || 'outline'}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <History className="h-5 w-5 text-muted-foreground" />
            <h4 className="font-semibold text-muted-foreground">تاریخچه</h4>
          </div>
          <ScrollArea className="h-48 md:h-full bg-background/30 rounded-lg p-2 shadow-inner">
            {history.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-muted-foreground">تاریخچه‌ای وجود ندارد.</p>
                </div>
            ) : (
                <ul className="space-y-2">
                {history.map((entry, index) => (
                    <li key={index} className="text-sm text-right text-muted-foreground p-2 rounded-md hover:bg-background/50" dir="ltr">
                    {entry}
                    </li>
                ))}
                </ul>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
