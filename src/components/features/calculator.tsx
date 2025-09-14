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
    { label: 'C', handler: clearAll, className: 'col-span-2' },
    { label: '÷', handler: () => handleOperator('/'), variant: 'secondary' },
    { label: '×', handler: () => handleOperator('*'), variant: 'secondary' },
    { label: '7', handler: () => inputDigit('7') },
    { label: '8', handler: () => inputDigit('8') },
    { label: '9', handler: () => inputDigit('9') },
    { label: '-', handler: () => handleOperator('-'), variant: 'secondary' },
    { label: '4', handler: () => inputDigit('4') },
    { label: '5', handler: () => inputDigit('5') },
    { label: '6', handler: () => inputDigit('6') },
    { label: '+', handler: () => handleOperator('+'), variant: 'secondary' },
    { label: '1', handler: () => inputDigit('1') },
    { label: '2', handler: () => inputDigit('2') },
    { label: '3', handler: () => inputDigit('3') },
    { label: '=', handler: handleEquals, className: 'row-span-2', variant: 'primary' },
    { label: '0', handler: () => inputDigit('0'), className: 'col-span-2' },
    { label: '.', handler: inputDecimal },
  ];

  return (
    <Card className="h-full flex flex-col transition-transform transform hover:scale-[1.02] duration-300 ease-in-out">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalculatorIcon className="h-6 w-6" />
          Quick Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="bg-muted rounded-md p-4 w-full text-right mb-4">
          <p className="text-3xl font-mono break-all">{displayValue}</p>
        </div>
        <div className="grid grid-cols-4 grid-rows-5 gap-2 flex-grow">
          {buttons.map(({ label, handler, className, variant }) => (
            <Button
              key={label}
              onClick={handler}
              className={cn('text-xl h-full w-full', className)}
              variant={variant as any || 'outline'}
            >
              {label === '×' ? 'x' : label === '÷' ? '/' : label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
