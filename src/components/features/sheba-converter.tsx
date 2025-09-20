"use client";

import { useState, useMemo } from 'react';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { shebaToAccountNumber, accountNumberToSheba, type ShebaInfo, banks as bankData } from '@/lib/sheba-utils';
import { ShieldCheck, XCircle, Copy, Banknote, CreditCard, ArrowRightLeft, ChevronsUpDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';

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
                <p className="text-lg font-semibold text-primary font-display tracking-wider" dir="ltr">{value}</p>
            </div>
        </div>
        <Button variant="ghost" size="icon" className="absolute top-2 left-2 text-muted-foreground" onClick={onCopy} title={`کپی کردن ${title}`}>
          <Copy className="w-5 h-5"/>
        </Button>
    </div>
);

type ConversionMode = 'sheba-to-account' | 'account-to-sheba';

export default function ShebaConverter() {
  const [mode, setMode] = useState<ConversionMode>('sheba-to-account');

  // States for sheba-to-account
  const [sheba, setSheba] = useState('');
  const [shebaResult, setShebaResult] = useState<ShebaInfo | null>(null);
  const [shebaError, setShebaError] = useState<string | null>(null);
  
  // States for account-to-sheba
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedBankCode, setSelectedBankCode] = useState('');
  const [accountResult, setAccountResult] = useState<string | null>(null);
  const [accountError, setAccountError] = useState<string | null>(null);
  
  const [bankSelectOpen, setBankSelectOpen] = useState(false);
  const { toast } = useToast();

  const handleShebaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/^IR/i, '').replace(/\s/g, '');
    const formatted = formatShebaInput(rawValue);
    setSheba(formatted);
    
    if (rawValue.length === 24) {
        try {
            const info = shebaToAccountNumber('IR' + rawValue);
            setShebaResult(info);
            setShebaError(null);
        } catch (err: any) {
            setShebaError(err.message);
            setShebaResult(null);
        }
    } else {
        setShebaError(null);
        setShebaResult(null);
    }
  };

  const handleAccountToSheba = () => {
    if (!selectedBankCode || !accountNumber) {
        setAccountError("لطفا بانک و شماره حساب را وارد کنید.");
        setAccountResult(null);
        return;
    }
    try {
        const sheba = accountNumberToSheba(accountNumber, selectedBankCode);
        setAccountResult(sheba);
        setAccountError(null);
    } catch(err: any) {
        setAccountError(err.message);
        setAccountResult(null);
    }
  }
  
  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    const cleanText = text.replace(/\s/g, '');
    navigator.clipboard.writeText(cleanText);
    toast({
        title: 'کپی شد!',
        description: `${label} (${cleanText}) با موفقیت کپی شد.`,
    });
  }

  const bankOptions = Object.entries(bankData).map(([code, info]) => ({
      value: code,
      label: info.name,
      logo: info.logo
  })).sort((a,b) => a.label.localeCompare(b.label));

  return (
    <CardContent className="space-y-6">

        <div className="flex items-center justify-center p-1 bg-muted rounded-lg w-full max-w-md mx-auto">
            {(['sheba-to-account', 'account-to-sheba'] as ConversionMode[]).map((m) => (
            <Button 
                key={m}
                onClick={() => setMode(m)} 
                variant={mode === m ? 'default' : 'ghost'}
                className={`w-full h-10 ${mode === m ? '' : 'text-muted-foreground'}`}
            >
                 <ArrowRightLeft className="w-4 h-4 ml-2" />
                {m === 'sheba-to-account' ? 'شبا به حساب' : 'حساب به شبا'}
            </Button>
            ))}
        </div>

        {mode === 'sheba-to-account' ? (
          <div className="space-y-6">
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
                  className="h-14 text-2xl tracking-wider font-display text-center"
                  maxLength={29}
                />
              </div>
            </div>
            
            {shebaError && (
                <div className="p-4 rounded-lg bg-destructive/10 text-destructive-foreground flex items-center gap-3">
                    <XCircle className="w-6 h-6 text-destructive" />
                    <div>
                        <h4 className="font-bold">خطا در اعتبارسنجی</h4>
                        <p className="text-sm">{shebaError}</p>
                    </div>
                </div>
            )}

            {shebaResult && (
                <div className="space-y-4">
                    <div className={cn("p-4 rounded-lg flex items-center gap-4", 
                      shebaResult.bankLogo ? "bg-muted/30" : "bg-green-500/10"
                    )}>
                      {shebaResult.bankLogo ? (
                          <Image src={shebaResult.bankLogo} alt={shebaResult.bankName} width={48} height={48} className="rounded-full bg-white p-1 shadow-md"/>
                      ) : (
                          <ShieldCheck className="w-8 h-8 text-green-600" />
                      )}
                        <div>
                            <h3 className="text-lg font-bold text-foreground">{shebaResult.bankName}</h3>
                            <p className="text-sm text-green-600 dark:text-green-400">شماره شبا معتبر است</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        <ResultCard 
                          icon={<Banknote className="w-7 h-7 text-muted-foreground"/>}
                          title="شماره حساب"
                          value={shebaResult.accountNumber}
                          onCopy={() => copyToClipboard(shebaResult.accountNumber, "شماره حساب")}
                        />
                        {shebaResult.possibleCardNumber && (
                            <ResultCard 
                                  icon={<CreditCard className="w-7 h-7 text-muted-foreground"/>}
                                  title="شماره کارت احتمالی"
                                  value={formatShebaInput(shebaResult.possibleCardNumber)}
                                  onCopy={() => copyToClipboard(shebaResult.possibleCardNumber!, "شماره کارت")}
                              />
                        )}
                    </div>
                </div>
            )}
            
            { !shebaError && !shebaResult && sheba.replace(/\s/g, '').length < 24 && (
                <div className="flex items-center justify-center text-muted-foreground h-32 bg-muted/30 rounded-lg">
                    <p>برای تبدیل، شماره شبا ۲۴ رقمی خود را وارد کنید.</p>
                </div>
            )}
        </div>
        ) : (
          <div className='space-y-4'>
             <div className="space-y-2">
                <Label>بانک</Label>
                <Popover open={bankSelectOpen} onOpenChange={setBankSelectOpen}>
                    <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={bankSelectOpen}
                        className="w-full justify-between h-12 text-base"
                    >
                        {selectedBankCode
                        ? bankOptions.find((bank) => bank.value === selectedBankCode)?.label
                        : "بانک مورد نظر را انتخاب کنید..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0 glass-effect">
                        <Command>
                            <CommandInput placeholder="جستجوی بانک..." />
                            <CommandEmpty>بانکی یافت نشد.</CommandEmpty>
                            <CommandList>
                                <CommandGroup>
                                    {bankOptions.map((bank) => (
                                    <CommandItem
                                        key={bank.value}
                                        value={bank.label}
                                        onSelect={() => {
                                            setSelectedBankCode(bank.value);
                                            setBankSelectOpen(false);
                                        }}
                                    >
                                        <Image src={bank.logo} alt={bank.label} width={24} height={24} className="ml-2"/>
                                        {bank.label}
                                    </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="space-y-2">
                <Label htmlFor="account-number-input">شماره حساب</Label>
                <Input 
                    id="account-number-input"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                    className="h-14 text-2xl tracking-wider font-display text-center"
                    dir="ltr"
                    placeholder='شماره حساب را وارد کنید'
                />
            </div>
             <Button onClick={handleAccountToSheba} className="w-full h-12 text-base">
                <ShieldCheck className="w-5 h-5 ml-2" />
                دریافت شماره شبا
            </Button>
            {accountError && (
                <div className="p-4 rounded-lg bg-destructive/10 text-destructive-foreground flex items-center gap-3">
                    <XCircle className="w-6 h-6 text-destructive" />
                    <p className="text-sm">{accountError}</p>
                </div>
            )}
            {accountResult && (
                 <ResultCard 
                    icon={<ShieldCheck className="w-7 h-7 text-muted-foreground"/>}
                    title="شماره شبا"
                    value={formatShebaInput(accountResult.replace('IR', ''))}
                    onCopy={() => copyToClipboard(accountResult, "شماره شبا")}
                />
            )}
          </div>
        )}
    </CardContent>
  );
}
