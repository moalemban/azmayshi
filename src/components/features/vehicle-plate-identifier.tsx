"use client";

import { useState, useMemo } from 'react';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { plateCodes, plateLetters } from '@/lib/constants';
import { MapPin, Building } from 'lucide-react';

export default function VehiclePlateIdentifier() {
  const [plateNumber, setPlateNumber] = useState('');
  const [plateLetter, setPlateLetter] = useState('');

  const result = useMemo(() => {
    const num = parseInt(plateNumber, 10);
    if (isNaN(num) || !plateLetter || num < 10 || num > 99) {
      return null;
    }

    const provinceData = plateCodes[num as keyof typeof plateCodes];
    if (!provinceData) {
      return { province: "کد نامعتبر", city: "این کد برای هیچ استانی تعریف نشده است." };
    }

    const city = provinceData.cities[plateLetter];
    if (!city) {
      return { province: provinceData.province, city: `حرف '${plateLetter}' برای این کد استان تعریف نشده.` };
    }

    return { province: provinceData.province, city };
  }, [plateNumber, plateLetter]);
  
  const handlePlateNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
      setPlateNumber(value);
  }

  return (
    <CardContent className="space-y-4">
      <div className="flex items-center gap-2" dir="rtl">
        <div className="flex-1 space-y-2">
          <Label htmlFor="plate-number" className="text-muted-foreground">شماره دو رقمی</Label>
          <Input
            id="plate-number"
            type="text"
            value={plateNumber}
            onChange={handlePlateNumberChange}
            placeholder="مثلا ۱۱"
            className="h-12 text-lg text-center font-mono tracking-widest"
            maxLength={2}
          />
        </div>
        
        <div className="flex-1 space-y-2">
           <Label htmlFor="plate-letter" className="text-muted-foreground">حرف</Label>
           <Select value={plateLetter} onValueChange={setPlateLetter}>
            <SelectTrigger className="h-12 text-lg">
              <SelectValue placeholder="انتخاب حرف" />
            </SelectTrigger>
            <SelectContent className="glass-effect">
              {plateLetters.map(letter => (
                <SelectItem key={letter} value={letter}>{letter}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {result ? (
         <div className="w-full text-center bg-muted/50 p-4 rounded-lg shadow-inner mt-2 space-y-3">
            <div className='flex items-center justify-center gap-2'>
                <MapPin className='w-5 h-5 text-primary'/>
                <p className="text-lg font-semibold text-primary">{result.province}</p>
            </div>
             <div className='flex items-center justify-center gap-2'>
                <Building className='w-5 h-5 text-muted-foreground'/>
                <p className="text-md text-foreground">{result.city}</p>
            </div>
         </div>
      ) : (
        <div className="flex items-center justify-center text-muted-foreground h-24 bg-muted/30 rounded-lg">
          <p>شماره و حرف پلاک را برای تشخیص وارد کنید.</p>
        </div>
      )}
    </CardContent>
  );
}
