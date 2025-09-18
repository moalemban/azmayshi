"use client";

import { useState, useMemo } from 'react';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getCityByCode } from '@/lib/national-id-codes';
import { Fingerprint, CheckCircle, XCircle, MapPin, Building } from 'lucide-react';

interface ValidationResult {
  isValid: boolean;
  message: string;
  province?: string;
  city?: string;
}

const validateNationalId = (id: string): ValidationResult => {
    if (!/^\d{10}$/.test(id)) {
        return { isValid: false, message: 'کد ملی باید ۱۰ رقم و فقط شامل اعداد باشد.' };
    }
    
    // Check for all same digits
    if (/^(\d)\1{9}$/.test(id)) {
        return { isValid: false, message: 'کد ملی با ارقام تکراری نامعتبر است.' };
    }

    const check = +id[9];
    const sum = id.slice(0, 9).split('').reduce((acc, digit, index) => {
        return acc + (+digit * (10 - index));
    }, 0);
    
    const remainder = sum % 11;
    const expectedCheckDigit = remainder < 2 ? remainder : 11 - remainder;

    const isValid = check === expectedCheckDigit;
    
    if (!isValid) {
        return { isValid: false, message: 'ساختار کد ملی نامعتبر است (رقم کنترل اشتباه است).' };
    }

    const cityInfo = getCityByCode(id.substring(0, 3));

    return {
        isValid: true,
        message: 'کد ملی معتبر است.',
        province: cityInfo?.province,
        city: cityInfo?.city
    };
};

export default function NationalIdValidator() {
  const [nationalId, setNationalId] = useState('');

  const result = useMemo(() => {
    if (nationalId.length < 3) return null; // Wait for at least 3 digits to show location
    if (nationalId.length < 10) return { isValid: false, message: 'کد ملی باید ۱۰ رقم باشد.' };
    return validateNationalId(nationalId);
  }, [nationalId]);

  return (
    <CardContent className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="national-id-input" className="text-muted-foreground">شماره ملی را وارد کنید</Label>
        <Input
          id="national-id-input"
          type="text"
          value={nationalId}
          onChange={(e) => setNationalId(e.target.value.replace(/[^0-9]/g, ''))}
          maxLength={10}
          placeholder="مثال: ۰۰۱۲۳۴۵۶۷۸"
          className="h-14 text-lg text-center tracking-[4px] font-mono"
          dir="ltr"
        />
      </div>

      {nationalId.length === 10 && result ? (
        <div className={`p-4 rounded-lg shadow-inner text-center space-y-3 ${
            result.isValid 
            ? 'bg-green-500/10 border border-green-500/30' 
            : 'bg-red-500/10 border border-red-500/30'
        }`}>
          <div className={`flex items-center justify-center gap-2 font-semibold ${
            result.isValid ? 'text-green-600' : 'text-red-600'
          }`}>
            {result.isValid ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            <span>{result.message}</span>
          </div>

          {result.isValid && (
            <div className="border-t border-border/50 pt-3 mt-3 space-y-2">
               <div className='flex items-center justify-center gap-2'>
                  <MapPin className='w-5 h-5 text-primary'/>
                  <p className="text-md text-foreground">
                    <span className="text-muted-foreground">استان:</span> {result.province || 'نامشخص'}
                  </p>
               </div>
               <div className='flex items-center justify-center gap-2'>
                  <Building className='w-5 h-5 text-muted-foreground'/>
                   <p className="text-md text-foreground">
                    <span className="text-muted-foreground">شهرستان:</span> {result.city || 'نامشخص'}
                  </p>
               </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center text-muted-foreground h-24 bg-muted/30 rounded-lg">
          <p>شماره ملی ۱۰ رقمی خود را وارد کنید.</p>
        </div>
      )}
    </CardContent>
  );
}
