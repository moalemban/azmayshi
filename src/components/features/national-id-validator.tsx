"use client";

import { useState, useMemo } from 'react';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Fingerprint, CheckCircle, XCircle, MapPin, Building } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidationResult {
  isValid: boolean;
  message: string;
  province?: string;
  city?: string;
}

const cityCodes: { [key: string]: { province: string; city: string } } = {
    "001": { province: "تهران", city: "تهران" },
    "002": { province: "تهران", city: "تهران" },
    "003": { province: "تهران", city: "تهران" },
    "004": { province: "تهران", city: "تهران" },
    "005": { province: "تهران", city: "تهران" },
    "006": { province: "تهران", city: "تهران" },
    "007": { province: "تهران", city: "حوزه شمیران" },
    "008": { province: "گیلان", city: "گیلان" },
    "009": { province: "گیلان", city: "گیلان" },
    "010": { province: "گیلان", city: "گیلان" },
    "011": { province: "مازندران", city: "مازندران" },
    "012": { province: "مازندران", city: "مازندران" },
    "013": { province: "آذربایجان شرقی", city: "آذربایجان شرقی" },
    "014": { province: "آذربایجان شرقی", city: "آذربایجان شرقی" },
    "015": { province: "آذربایجان غربی", city: "آذربایجان غربی" },
    "016": { province: "آذربایجان غربی", city: "آذربایجان غربی" },
    "017": { province: "کرمانشاه", city: "کرمانشاه" },
    "018": { province: "کرمانشاه", city: "کرمانشاه" },
    "019": { province: "همدان", city: "همدان" },
    "020": { province: "همدان", city: "همدان" },
    "021": { province: "کردستان", city: "کردستان" },
    "022": { province: "کردستان", city: "کردستان" },
    "023": { province: "اصفهان", city: "اصفهان" },
    "024": { province: "اصفهان", city: "اصفهان" },
    "025": { province: "سیستان و بلوچستان", city: "سیستان و بلوچستان" },
    "026": { province: "سیستان و بلوچستان", city: "سیستان و بلوچستان" },
    "027": { province: "فارس", city: "فارس" },
    "028": { province: "فارس", city: "فارس" },
    "029": { province: "کرمان", city: "کرمان" },
    "030": { province: "کرمان", city: "کرمان" },
    "031": { province: "خراسان رضوی", city: "خراسان رضوی" },
    "032": { province: "خراسان رضوی", city: "خراسان رضوی" },
    "033": { province: "خراسان جنوبی", city: "خراسان جنوبی" },
    "034": { province: "خراسان شمالی", city: "خراسان شمالی" },
    "035": { province: "یزد", city: "یزد" },
    "036": { province: "هرمزگان", city: "هرمزگان" },
    "037": { province: "هرمزگان", city: "هرمزگان" },
    "038": { province: "چهارمحال و بختیاری", city: "چهارمحال و بختیاری" },
    "039": { province: "چهارمحال و بختیاری", city: "چهارمحال و بختیاری" },
    "040": { province: "لرستان", city: "لرستان" },
    "041": { province: "لرستان", city: "لرستان" },
    "042": { province: "بوشهر", city: "بوشهر" },
    "043": { province: "زنجان", city: "زنجان" },
    "044": { province: "زنجان", city: "زنجان" },
    "045": { province: "قزوین", city: "قزوین" },
    "046": { province: "سمنان", city: "سمنان" },
    "047": { province: "سمنان", city: "سمنان" },
    "048": { province: "گلستان", city: "گلستان" },
    "049": { province: "البرز", city: "البرز" },
    "050": { province: "کهگیلویه و بویراحمد", city: "کهگیلویه و بویراحمد" },
    "051": { province: "ایلام", city: "ایلام" },
    "052": { province: "قم", city: "قم" },
    "053": { province: "قم", city: "قم" },
    "054": { province: "خوزستان", city: "خوزستان" },
    "055": { province: "خوزستان", city: "خوزستان" },
    "056": { province: "خوزستان", city: "خوزستان" },
    "057": { province: "خوزستان", city: "خوزستان" },
    "058": { province: "خوزستان", city: "خوزستان" },
    "059": { province: "خوزستان", city: "خوزستان" },
    "060": { province: "خوزستان", city: "خوزستان" },
    "061": { province: "خوزستان", city: "خوزستان" },
    "062": { province: "خوزستان", city: "خوزستان" },
    "063": { province: "خوزستان", city: "خوزستان" },
    "064": { province: "خوزستان", city: "خوزستان" },
    "065": { province: "خوزستان", city: "خوزستان" },
    "066": { province: "خوزستان", city: "خوزستان" },
    "067": { province: "خوزستان", city: "خوزستان" },
    "068": { province: "خوزستان", city: "خوزستان" },
    "069": { province: "خوزستان", city: "خوزستان" },
    "070": { province: "خوزستان", city: "خوزستان" },
    // ... more codes
};

export default function NationalIdValidator() {
    const [nationalId, setNationalId] = useState('');

    const validateNationalId = (id: string): ValidationResult => {
        if (!/^\d{10}$/.test(id)) {
            return { isValid: false, message: 'کد ملی باید ۱۰ رقم باشد.' };
        }
        if (/^(\d)\1{9}$/.test(id)) {
            return { isValid: false, message: 'کد ملی معتبر نیست (ارقام تکراری).' };
        }

        const check = parseInt(id[9], 10);
        const sum = id
            .slice(0, 9)
            .split('')
            .reduce((acc, digit, index) => acc + parseInt(digit, 10) * (10 - index), 0);

        const remainder = sum % 11;
        const isValid = (remainder < 2) ? check === remainder : check === 11 - remainder;

        if (!isValid) {
            return { isValid: false, message: 'رقم کنترل کد ملی اشتباه است.' };
        }

        const cityCode = id.substring(0, 3);
        const location = cityCodes[cityCode] || { province: 'نامشخص', city: 'کد شهرستان تعریف نشده' };

        return {
            isValid: true,
            message: 'کد ملی معتبر است.',
            province: location.province,
            city: location.city,
        };
    };

    const validationResult = useMemo(() => {
        if (nationalId.length !== 10) {
            return null;
        }
        return validateNationalId(nationalId);
    }, [nationalId]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length <= 10) {
            setNationalId(value);
        }
    };

    return (
        <CardContent className="space-y-6 flex flex-col items-center">
            <div className="w-full max-w-sm mx-auto">
                <Label className="text-muted-foreground text-center block mb-2">شماره ملی را وارد کنید</Label>
                <Input
                    type="text"
                    value={nationalId}
                    onChange={handleInputChange}
                    placeholder="۰۰۱۲۳۴۵۶۷۸"
                    className="h-14 text-2xl text-center font-mono tracking-widest"
                    maxLength={10}
                    dir="ltr"
                />
            </div>

            {nationalId.length === 10 ? (
                validationResult && (
                    <div className={cn(
                        "w-full text-center bg-muted/50 p-4 rounded-lg shadow-inner mt-4 space-y-3 max-w-sm",
                        validationResult.isValid ? "border-green-500/50" : "border-red-500/50",
                        "border-2"
                    )}>
                        <div className={cn(
                            "flex items-center justify-center gap-2 font-semibold",
                            validationResult.isValid ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                        )}>
                            {validationResult.isValid ? <CheckCircle className='w-5 h-5'/> : <XCircle className='w-5 h-5'/>}
                            <p>{validationResult.message}</p>
                        </div>

                        {validationResult.isValid && validationResult.province && (
                            <>
                                <div className='flex items-center justify-center gap-2 pt-2 border-t border-border mt-2'>
                                    <MapPin className='w-5 h-5 text-primary'/>
                                    <p className="text-lg font-semibold text-primary">{validationResult.province}</p>
                                </div>
                                <div className='flex items-center justify-center gap-2'>
                                    <Building className='w-5 h-5 text-muted-foreground'/>
                                    <p className="text-md text-foreground">{validationResult.city}</p>
                                </div>
                            </>
                        )}
                    </div>
                )
            ) : (
                <div className="flex items-center justify-center text-muted-foreground h-24 bg-muted/30 rounded-lg w-full max-w-sm">
                    <p>کد ملی ۱۰ رقمی را برای بررسی وارد کنید.</p>
                </div>
            )}
        </CardContent>
    );
}
