"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Scale, ArrowRightLeft } from 'lucide-react';
import { unitCategories } from '@/lib/constants';

// A simple conversion library (can be expanded)
const conversionRates: { [key: string]: number } = {
  // Length
  meter: 1,
  kilometer: 1000,
  centimeter: 0.01,
  millimeter: 0.001,
  mile: 1609.34,
  yard: 0.9144,
  foot: 0.3048,
  inch: 0.0254,
  // Mass
  kilogram: 1,
  gram: 0.001,
  milligram: 0.000001,
  pound: 0.453592,
  ounce: 0.0283495,
  // Volume
  liter: 1,
  milliliter: 0.001,
  'cubic meter': 1000,
  gallon: 3.78541,
  quart: 0.946353,
  pint: 0.473176,
  cup: 0.24,
};

const getUnitCategory = (unit: string) => {
    for (const category in unitCategories) {
        if (unitCategories[category].includes(unit)) {
            return category;
        }
    }
    return null;
}

export default function UnitConverter() {
    const [fromUnit, setFromUnit] = useState('meter');
    const [toUnit, setToUnit] = useState('kilometer');
    const [fromValue, setFromValue] = useState<string>('1');
    const [toValue, setToValue] = useState<string>('');
    const [currentCategory, setCurrentCategory] = useState('طول');

    const convert = (value: number, from: string, to: string) => {
        if (from === to) return value;
        // Temperature is special case
        if (from === 'celsius' && to === 'fahrenheit') return (value * 9/5) + 32;
        if (from === 'fahrenheit' && to === 'celsius') return (value - 32) * 5/9;
        if (from === 'celsius' && to === 'kelvin') return value + 273.15;
        if (from === 'kelvin' && to === 'celsius') return value - 273.15;
        if (from === 'fahrenheit' && to === 'kelvin') return ((value - 32) * 5/9) + 273.15;
        if (from === 'kelvin' && to === 'fahrenheit') return ((value - 273.15) * 9/5) + 32;

        const fromRate = conversionRates[from];
        const toRate = conversionRates[to];

        if (fromRate && toRate) {
            const valueInBase = value * fromRate;
            return valueInBase / toRate;
        }
        return NaN; // Cannot convert
    };

    useEffect(() => {
        const value = parseFloat(fromValue);
        if (!isNaN(value)) {
            const result = convert(value, fromUnit, toUnit);
            if (!isNaN(result)) {
                setToValue(result.toLocaleString('fa-IR', { maximumFractionDigits: 4 }));
            } else {
                setToValue('');
            }
        } else {
            setToValue('');
        }
    }, [fromValue, fromUnit, toUnit]);
    
    const handleFromUnitChange = (unit: string) => {
        const newCategory = getUnitCategory(unit);
        setFromUnit(unit);
        if(newCategory !== currentCategory) {
            setCurrentCategory(newCategory!);
            const newToUnit = unitCategories[newCategory!][0] === unit ? unitCategories[newCategory!][1] : unitCategories[newCategory!][0];
            setToUnit(newToUnit);
        }
    }
    
    const swapUnits = () => {
        setFromUnit(toUnit);
        setToUnit(fromUnit);
        setFromValue(toValue.replace(/,/g, ''));
    }

    const renderSelect = (value: string, onChange: (val:string)=>void) => (
         <Select onValueChange={onChange} value={value}>
            <SelectTrigger className="h-12 text-lg">
              <SelectValue placeholder="یک واحد انتخاب کنید" />
            </SelectTrigger>
          <SelectContent>
            {Object.entries(unitCategories).map(([category, units]) => (
                <SelectGroup key={category}>
                    <SelectLabel>{category}</SelectLabel>
                    {units.map((unit) => (
                        <SelectItem key={unit} value={unit} disabled={currentCategory && currentCategory !== category}>{unit}</SelectItem>
                    ))}
                </SelectGroup>
            ))}
          </SelectContent>
        </Select>
    );

  return (
    <Card className="h-full group/card transition-all duration-300 hover:border-primary/50">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Scale className="h-7 w-7 text-primary" />
          تبدیل واحد
        </CardTitle>
      </CardHeader>
      <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className='w-full space-y-2'>
                    <Input type="number" value={fromValue} onChange={e => setFromValue(e.target.value)} className="h-12 text-lg" />
                    {renderSelect(fromUnit, handleFromUnitChange)}
                </div>

                <div className='my-2 sm:my-0'>
                     <ArrowRightLeft className="h-6 w-6 text-muted-foreground transition-transform group-hover/card:rotate-180 duration-300 cursor-pointer" onClick={swapUnits}/>
                </div>
               
                <div className='w-full space-y-2'>
                    <Input readOnly value={toValue} className="h-12 text-lg bg-background/50" />
                     {renderSelect(toUnit, setToUnit)}
                </div>
            </div>
          </div>
      </CardContent>
    </Card>
  );
}
