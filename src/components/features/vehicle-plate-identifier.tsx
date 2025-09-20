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
      return { province: provinceData.province, city: `حرف '${plateLetter}' برای این کد استان تعریف نشده است.` };
    }

    return { province: provinceData.province, city };
  }, [plateNumber, plateLetter]);
  
  const handlePlateNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
      setPlateNumber(value);
  }

  return (
    <CardContent className="space-y-6 flex flex-col items-center">
        <div className="w-full max-w-sm mx-auto">
            <div className="bg-white border-2 border-blue-800 rounded-lg flex items-center h-20 shadow-md" dir="ltr">
                {/* Left section (Flag) */}
                <div className="bg-blue-800 h-full flex flex-col justify-between items-center p-2 rounded-l-md w-16 text-white shrink-0">
                    <div className='w-8'>
                        <div className="h-1.5 bg-green-500"></div>
                        <div className="h-1.5 bg-white"></div>
                        <div className="h-1.5 bg-red-500"></div>
                    </div>
                    <span className="font-sans text-xs font-bold">I.R. IRAN</span>
                </div>

                {/* Middle section (Inputs) */}
                <div className="flex-grow flex items-center justify-evenly px-2 h-full">
                     <span className="text-2xl font-mono text-gray-400">•••</span>
                    <Select value={plateLetter} onValueChange={setPlateLetter}>
                        <SelectTrigger className="w-16 h-12 text-lg border-none bg-transparent focus:ring-0 focus:ring-offset-0 font-bold text-gray-800">
                           <SelectValue placeholder="ب" />
                        </SelectTrigger>
                        <SelectContent className="glass-effect">
                        {plateLetters.map(letter => (
                            <SelectItem key={letter} value={letter}>{letter}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Right section (Iran & plate number) */}
                <div className="border-l-2 border-blue-800 h-full flex flex-col items-center justify-center px-2 w-20 shrink-0">
                    <span className="text-sm font-bold text-gray-800" style={{fontFamily: 'Vazirmatn'}}>ایران</span>
                    <Input
                        type="text"
                        value={plateNumber}
                        onChange={handlePlateNumberChange}
                        placeholder="۱۱"
                        className="w-12 h-12 text-3xl text-center font-mono tracking-widest border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-gray-800"
                        maxLength={2}
                    />
                </div>
            </div>
        </div>
      
      {result ? (
         <div className="w-full text-center bg-muted/50 p-4 rounded-lg shadow-inner mt-2 space-y-3 max-w-sm">
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
        <div className="flex items-center justify-center text-muted-foreground h-24 bg-muted/30 rounded-lg w-full max-w-sm">
          <p>شماره و حرف پلاک را برای تشخیص وارد کنید.</p>
        </div>
      )}
    </CardContent>
  );
}
