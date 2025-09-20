"use client";

import { useState, useMemo } from 'react';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { shebaToAccountNumber, type ShebaInfo } from '@/lib/sheba-utils';
import { ShieldCheck, XCircle, Copy, Banknote, CreditCard, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const formatShebaInput = (value: string): string => {
  const clean = value.replace(/[^0-9]/gi, '').toUpperCase();
  const parts = [];
  for (let i = 0; i < clean.length; i += 4) {
    parts.push(clean.slice(i, i + 4));
  }
  return parts.join(' ');
};

const ResultCard = ({ icon, title, value, onCopy }: { icon: React.ReactNode, title: string, value: string, onCopy: () => void }) => (
    <div className="relative p-4 bg-muted/50 rounded-lg shadow-inner">
        <div className="flex items-center gap-3">
            {icon}
            <div>
                <p className="text-sm text-muted-foreground">{title}</p>
                <p className="text-lg font-semibold text-primary font-mono tracking-wider" dir="ltr">{value}</p>
            </div>
        </div>
        <Button variant="ghost" size="icon" className="absolute top-2 left-2 text-muted-foreground" onClick={onCopy} title={`کپی کردن ${title}`}>
          <Copy className="w-5 h-5"/>
        </Button>
    </div>
);


export default function ShebaConverter() {
  const [sheba, setSheba] = useState('');
  const [result, setResult] = useState<ShebaInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleShebaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/^IR/i, '').replace(/\s/g, '');
    const formatted = formatShebaInput(rawValue);
    setSheba(formatted);
    
    if (rawValue.length === 24) {
        try {
            const info = shebaToAccountNumber('IR' + rawValue);
            setResult(info);
            setError(null);
        } catch (err: any) {
            setError(err.message);
            setResult(null);
        }
    } else {
        setError(null);
        setResult(null);
    }
  };
  
  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({
        title: 'کپی شد!',
        description: `${label} با موفقیت در کلیپ‌بورد کپی شد.`,
    });
  }

  return (
    <CardContent className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="sheba-input" className="text-muted-foreground">شماره شبا (IBAN)</Label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-muted-foreground">IR</span>
          <Input
            id="sheba-input"
            dir="ltr"
            value={sheba}
            onChange={handleShebaChange}
            placeholder="XX XXXX XXXX XXXX XXXX XXXX XXXX"
            className="h-14 text-2xl tracking-widest font-mono text-center"
            maxLength={29}
          />
        </div>
      </div>
      
      {error && (
          <div className="p-4 rounded-lg bg-destructive/10 text-destructive-foreground flex items-center gap-3">
              <XCircle className="w-6 h-6 text-destructive" />
              <div>
                  <h4 className="font-bold">خطا در اعتبارسنجی</h4>
                  <p className="text-sm">{error}</p>
              </div>
          </div>
      )}

      {result && (
          <div className="space-y-4">
              <div className={cn("p-4 rounded-lg flex items-center gap-4", 
                result.bankLogo ? "bg-muted/30" : "bg-green-500/10"
              )}>
                 {result.bankLogo ? (
                    <Image src={result.bankLogo} alt={result.bankName} width={48} height={48} className="rounded-full bg-white p-1 shadow-md"/>
                 ) : (
                    <ShieldCheck className="w-8 h-8 text-green-600" />
                 )}
                  <div>
                      <h3 className="text-lg font-bold text-foreground">{result.bankName}</h3>
                      <p className="text-sm text-green-600 dark:text-green-400">شماره شبا معتبر است</p>
                  </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                  <ResultCard 
                    icon={<Banknote className="w-7 h-7 text-muted-foreground"/>}
                    title="شماره حساب"
                    value={result.accountNumber}
                    onCopy={() => copyToClipboard(result.accountNumber, "شماره حساب")}
                  />
                  {result.possibleCardNumber && (
                       <ResultCard 
                            icon={<CreditCard className="w-7 h-7 text-muted-foreground"/>}
                            title="شماره کارت احتمالی"
                            value={formatShebaInput(result.possibleCardNumber)}
                            onCopy={() => copyToClipboard(result.possibleCardNumber!, "شماره کارت")}
                        />
                  )}
              </div>
          </div>
      )}
      
      { !error && !result && sheba.length < 29 && (
          <div className="flex items-center justify-center text-muted-foreground h-32 bg-muted/30 rounded-lg">
              <p>برای تبدیل، شماره شبا ۲۴ رقمی خود را وارد کنید.</p>
          </div>
      )}

    </CardContent>
  );
}
