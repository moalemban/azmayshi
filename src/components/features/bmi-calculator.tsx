"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HeartPulse } from 'lucide-react';

export default function BmiCalculator() {
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [bmi, setBmi] = useState<{ value: string; category: string; color: string } | null>(null);

  const calculateBmi = () => {
    const h = Number(height);
    const w = Number(weight);
    if (h > 0 && w > 0) {
      const bmiValue = w / ((h / 100) ** 2);
      let category = '';
      let color = '';

      if (bmiValue < 18.5) {
        category = 'کمبود وزن';
        color = 'text-blue-400';
      } else if (bmiValue < 24.9) {
        category = 'وزن نرمال';
        color = 'text-green-400';
      } else if (bmiValue < 29.9) {
        category = 'اضافه وزن';
        color = 'text-yellow-400';
      } else {
        category = 'چاقی';
        color = 'text-red-400';
      }

      setBmi({
        value: bmiValue.toFixed(1),
        category,
        color,
      });
    } else {
        setBmi(null);
    }
  };
  
  useEffect(() => {
    calculateBmi();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, weight]);

  return (
    <CardContent className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor="height" className="text-muted-foreground">قد (سانتی‌متر)</Label>
        <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="۱۷۵" className="h-12 text-lg"/>
      </div>
      <div className="space-y-2">
        <Label htmlFor="weight" className="text-muted-foreground">وزن (کیلوگرم)</Label>
        <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="۷۰" className="h-12 text-lg"/>
      </div>

      {bmi ? (
        <div className="w-full text-center bg-muted/50 p-4 rounded-lg shadow-inner mt-2">
          <p className="text-lg text-muted-foreground">شاخص توده بدنی (BMI)</p>
          <p className="text-4xl font-bold text-primary">{bmi.value}</p>
          <p className={`text-xl font-semibold ${bmi.color}`}>{bmi.category}</p>
        </div>
      ) : (
          <div className="flex items-center justify-center text-muted-foreground h-28 bg-muted/30 rounded-lg">
              <p>قد و وزن خود را وارد کنید.</p>
          </div>
      )}
    </CardContent>
  );
}
