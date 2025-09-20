"use client";

import { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRightLeft } from 'lucide-react';

const formatNumber = (value: string) => {
    const num = parseInt(value.replace(/,/g, ''), 10);
    return isNaN(num) ? '' : num.toLocaleString('en-US');
};

const unformatNumber = (value: string) => {
    return value.replace(/,/g, '');
};

export default function RialTomanConverter() {
    const [rial, setRial] = useState('');
    const [toman, setToman] = useState('');

    const handleRialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = unformatNumber(e.target.value);
        const numericValue = parseInt(rawValue, 10);
        
        setRial(formatNumber(rawValue));

        if (!isNaN(numericValue)) {
            setToman(formatNumber(String(numericValue / 10)));
        } else {
            setToman('');
        }
    };

    const handleTomanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = unformatNumber(e.target.value);
        const numericValue = parseInt(rawValue, 10);
        
        setToman(formatNumber(rawValue));

        if (!isNaN(numericValue)) {
            setRial(formatNumber(String(numericValue * 10)));
        } else {
            setRial('');
        }
    };

    return (
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 items-end">
                <div className="space-y-2">
                    <Label htmlFor="toman-input" className="text-muted-foreground">مبلغ به تومان</Label>
                    <Input
                        id="toman-input"
                        dir="ltr"
                        type="text"
                        value={toman}
                        onChange={handleTomanChange}
                        placeholder="۱,۰۰۰"
                        className="text-lg h-14 text-center text-primary"
                    />
                </div>

                <div className="flex justify-center">
                    <ArrowRightLeft className="h-6 w-6 text-muted-foreground" />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="rial-input" className="text-muted-foreground">مبلغ به ریال</Label>
                    <Input
                        id="rial-input"
                        dir="ltr"
                        type="text"
                        value={rial}
                        onChange={handleRialChange}
                        placeholder="۱۰,۰۰۰"
                        className="text-lg h-14 text-center"
                    />
                </div>
            </div>
        </CardContent>
    );
}
