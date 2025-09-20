"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Scale, ArrowRightLeft } from 'lucide-react';
import { unitCategories, unitNames } from '@/lib/constants';
import { Button } from '@/components/ui/button';

const conversionRates: { [key: string]: number } = {
  meter: 1, kilometer: 1000, centimeter: 0.01, millimeter: 0.001, mile: 1609.34, yard: 0.9144, foot: 0.3048, inch: 0.0254,
  kilogram: 1, gram: 0.001, milligram: 0.000001, pound: 0.453592, ounce: 0.0283495,
  liter: 1, milliliter: 0.001, 'cubic-meter': 1000, gallon: 3.78541, quart: 0.946353, pint: 0.473176, cup: 0.24,
};

const getUnitCategoryKey = (unit: string): string | null => {
    for (const categoryKey in unitCategories) {
        if (unitCategories[categoryKey].includes(unit)) return categoryKey;
    }
    return null;
}

export default function UnitConverter() {
    const [fromUnit, setFromUnit] = useState('meter');
    const [toUnit, setToUnit] = useState('kilometer');
    const [fromValue, setFromValue] = useState<string>('1');
    const [toValue, setToValue] = useState<string>('');
    
    const currentCategoryKey = getUnitCategoryKey(fromUnit);

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
            return (value * fromRate) / toRate;
        }
        return NaN;
    };

    useEffect(() => {
        const value = parseFloat(fromValue);
        if (!isNaN(value)) {
            const result = convert(value, fromUnit, toUnit);
            if (!isNaN(result)) {
                setToValue(result.toLocaleString('en-US', { maximumFractionDigits: 6, useGrouping: false }).replace(/\.?0+$/, ""));
            } else {
                setToValue('');
            }
        } else {
            setToValue('');
        }
    }, [fromValue, fromUnit, toUnit]);
    
    const handleFromUnitChange = (unit: string) => {
        const newCategoryKey = getUnitCategoryKey(unit);
        setFromUnit(unit);
        if(newCategoryKey !== getUnitCategoryKey(toUnit)) {
            const newCategoryUnits = unitCategories[newCategoryKey!];
            const newToUnit = newCategoryUnits[0] === unit ? newCategoryUnits[1] : newCategoryUnits[0];
            setToUnit(newToUnit || newCategoryUnits[0]);
        }
    }
    
    const swapUnits = () => {
        setFromUnit(toUnit);
        setToUnit(fromUnit);
        setFromValue(toValue.replace(/,/g, ''));
    }

    const renderSelect = (value: string, onChange: (val:string)=>void, isDisabledCheck?: (key: string) => boolean) => (
         <Select onValueChange={onChange} value={value}>
            <SelectTrigger className="h-12 text-base">
              <SelectValue placeholder="یک واحد انتخاب کنید" />
            </SelectTrigger>
          <SelectContent className="glass-effect">
            {Object.entries(unitNames).map(([category, units]) => (
                <SelectGroup key={category}>
                    <SelectLabel>{category}</SelectLabel>
                    {Object.entries(units).map(([unitKey, unitName]) => (
                        <SelectItem key={unitKey} value={unitKey} disabled={isDisabledCheck ? isDisabledCheck(unitKey) : false}>{unitName}</SelectItem>
                    ))}
                </SelectGroup>
            ))}
          </SelectContent>
        </Select>
    );

  return (
    <CardContent>
        <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className='w-full space-y-2'>
                <Input type="number" value={fromValue} onChange={e => setFromValue(e.target.value)} placeholder="مثلا: ۱" className="h-12 text-lg text-center" />
                {renderSelect(fromUnit, handleFromUnitChange)}
            </div>

            <div className='my-2 sm:my-0'>
                    <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground" onClick={swapUnits}>
                    <ArrowRightLeft className="h-6 w-6 transition-transform group-hover/card:rotate-180 duration-300"/>
                </Button>
            </div>
            
            <div className='w-full space-y-2'>
                <Input readOnly value={toValue.toLocaleString()} className="h-12 text-lg text-center bg-muted/50 text-primary" placeholder="نتیجه"/>
                    {renderSelect(toUnit, setToUnit, (unitKey) => currentCategoryKey !== getUnitCategoryKey(unitKey))}
            </div>
        </div>
        </div>
    </CardContent>
  );
}
