"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator as CalculatorIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function QuickCalculator() {
  const [displayValue, setDisplayValue] = useState('0');
  const [operator, setOperator] = useState<string | null>(null);
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplayValue(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
    }
  };

  const inputDecimal = () => {
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForSecondOperand) {
      setOperator(nextOperator);
      return;
    }

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = performCalculation();
      setDisplayValue(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const performCalculation = () => {
    if (operator && firstOperand !== null) {
      const secondOperand = parseFloat(displayValue);
      switch (operator) {
        case '/':
          return firstOperand / secondOperand;
        case '*':
          return firstOperand * secondOperand;
        case '+':
          return firstOperand + secondOperand;
        case '-':
          return firstOperand - secondOperand;
        default:
          return secondOperand;
      }
    }
    return parseFloat(displayValue);
  };

  const handleEquals = () => {
    const result = performCalculation();
    setDisplayValue(String(result));
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const clearAll = () => {
    setDisplayValue('0');
    setOperator(null);
    setFirstOperand(null);
    setWaitingForSecondOperand(false);
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
    <Card className="h-full flex flex-col group/card">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent group-hover:from-primary/20 transition-all duration-500 -z-10"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalculatorIcon className="h-6 w-6 text-primary" />
          ماشین حساب
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="bg-background/50 rounded-lg p-4 w-full text-left mb-4 shadow-inner">
          <p className="text-4xl font-mono break-all text-right text-foreground">
            {displayValue.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d, 10)] )}
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
      </CardContent>
    </Card>
  );
}
