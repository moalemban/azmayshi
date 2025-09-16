import React from 'react';
import Header from '@/components/layout/header';
import UnitConverter from '@/components/features/unit-converter';
import CurrencyConverter from '@/components/features/currency-converter';
import DateConverter from '@/components/features/date-converter';
import LivePrices from '@/components/features/live-prices';
import AgeCalculator from '@/components/features/age-calculator';
import BmiCalculator from '@/components/features/bmi-calculator';
import PercentageCalculator from '@/components/features/percentage-calculator';
import LoanCalculator from '@/components/features/loan-calculator';
import Stopwatch from '@/components/features/stopwatch';
import DepositCalculator from '@/components/features/deposit-calculator';
import NumberToWordsConverter from '@/components/features/number-to-words-converter';
import NumberSystemConverter from '@/components/features/number-system-converter';
import PasswordGenerator from '@/components/features/password-generator';
import RandomNumberGenerator from '@/components/features/random-number-generator';
import QrCodeGenerator from '@/components/features/qr-code-generator';
import IpDetector from '@/components/features/ip-detector';
import BinaryConverter from '@/components/features/binary-converter';
import DistanceCalculator from '@/components/features/distance-calculator';
import VehiclePlateIdentifier from '@/components/features/vehicle-plate-identifier';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


import {
  Scale,
  Landmark,
  CalendarDays,
  Banknote,
  PiggyBank,
  SpellCheck,
  Binary,
  Percent,
  Gift,
  HeartPulse,
  Dices,
  Timer,
  KeyRound,
  QrCode,
  LocateFixed,
  Info,
  HeartHandshake,
  ArrowLeft,
  Globe,
  Wrench,
  ArrowDown,
  Map,
  RectangleEllipsis,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const tools = [
  { id: 'unit-converter', title: 'تبدیل واحد', icon: <Scale className="h-8 w-8 text-blue-400" />, component: <UnitConverter /> },
  { id: 'currency-converter', title: 'تبدیل ارز', icon: <Landmark className="h-8 w-8 text-green-400" />, component: <CurrencyConverter /> },
  { id: 'date-converter', title: 'تبدیل تاریخ', icon: <CalendarDays className="h-8 w-8 text-purple-400" />, component: <DateConverter /> },
  { id: 'loan-calculator', title: 'ماشین‌حساب اقساط وام', icon: <Banknote className="h-8 w-8 text-rose-400" />, component: <LoanCalculator /> },
  { id: 'deposit-calculator', title: 'ماشین‌حساب سود سپرده', icon: <PiggyBank className="h-8 w-8 text-emerald-400" />, component: <DepositCalculator /> },
  { id: 'number-to-words', title: 'تبدیل عدد به حروف', icon: <SpellCheck className="h-8 w-8 text-amber-400" />, component: <NumberToWordsConverter /> },
  { id: 'number-system', title: 'تبدیل ارقام', icon: <Binary className="h-8 w-8 text-sky-400" />, component: <NumberSystemConverter /> },
  { id: 'binary-converter', title: 'تبدیل متن و باینری', icon: <Binary className="h-8 w-8 text-cyan-400" />, component: <BinaryConverter /> },
  { id: 'percentage-calculator', title: 'محاسبه درصد', icon: <Percent className="h-8 w-8 text-teal-400" />, component: <PercentageCalculator /> },
  { id: 'age-calculator', title: 'محاسبه سن', icon: <Gift className="h-8 w-8 text-pink-400" />, component: <AgeCalculator /> },
  { id: 'bmi-calculator', title: 'محاسبه BMI', icon: <HeartPulse className="h-8 w-8 text-red-400" />, component: <BmiCalculator /> },
  { id: 'distance-calculator', title: 'محاسبه مسافت', icon: <Map className="h-8 w-8 text-fuchsia-400" />, component: <DistanceCalculator /> },
  { id: 'vehicle-plate-identifier', title: 'هوشمند پلاک', icon: <RectangleEllipsis className="h-8 w-8 text-indigo-400" />, component: <VehiclePlateIdentifier /> },
  { id: 'random-number', title: 'تولید عدد تصادفی', icon: <Dices className="h-8 w-8 text-orange-400" />, component: <RandomNumberGenerator /> },
  { id: 'stopwatch', title: 'کرونومتر', icon: <Timer className="h-8 w-8 text-indigo-400" />, component: <Stopwatch /> },
  { id: 'password-generator', title: 'تولیدکننده رمز عبور', icon: <KeyRound className="h-8 w-8 text-violet-400" />, component: <PasswordGenerator /> },
  { id: 'qr-code-generator', title: 'تولید کننده QR Code', icon: <QrCode className="h-8 w-8 text-lime-400" />, component: <QrCodeGenerator /> },
  { id: 'ip-detector', title: 'تشخیص IP', icon: <LocateFixed className="h-8 w-8 text-sky-400" />, component: <IpDetector /> },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-screen-2xl">
          <div className="glass-effect rounded-3xl p-4 md:p-8 mb-10">
            <LivePrices />
          </div>

          {/* Toolbox Shortcuts */}
          <div className="glass-effect rounded-3xl p-4 md:p-8 mb-10">
             <h2 className="col-span-12 text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-3 text-glow">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/80 to-accent/80 rounded-xl flex items-center justify-center animate-pulse">
                  <Wrench className="w-6 h-6 text-primary-foreground"/>
              </div>
              جعبه ابزار
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {tools.map((tool) => (
                <a href={`#${tool.id}`} key={`shortcut-${tool.id}`} className="block">
                  <div className="glass-effect rounded-2xl p-4 card-hover w-full h-full flex flex-col items-center justify-center text-center gap-3">
                    {tool.icon}
                    <span className="font-semibold text-sm text-foreground">{tool.title}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
          
          {/* Tools Sections */}
          <div className="space-y-6">
            {tools.map((tool) => (
              <Card key={tool.id} id={tool.id} className="glass-effect scroll-mt-24">
                <CardHeader>
                  <CardTitle className='flex items-center gap-3 text-xl font-display'>
                     {React.cloneElement(tool.icon, { className: "h-7 w-7" })}
                     {tool.title}
                  </CardTitle>
                </CardHeader>
                {tool.component}
              </Card>
            ))}
          </div>
          
           {/* About Us Section */}
           <div className="mt-12 glass-effect rounded-3xl p-6 md:p-8">
             <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-right">
                <div className="p-3 bg-gradient-to-br from-primary/80 to-accent/80 rounded-2xl inline-flex animate-pulse">
                    <Info className="h-10 w-10 text-primary-foreground"/>
                </div>
               <div className='flex-grow'>
                  <h3 className="text-xl font-semibold font-display text-foreground">درباره «تبدیلا»</h3>
                  <p className="text-muted-foreground mt-2 leading-relaxed">
                    «تبدیلا» فقط یک ابزار نیست؛ یک دستیار هوشمند برای تمام لحظاتی است که به محاسبات و تبدیلات سریع، دقیق و زیبا نیاز دارید. ما با وسواس، مجموعه‌ای از بهترین ابزارهای روزمره را در یک پلتفرم مدرن و چشم‌نواز گرد هم آورده‌ایم تا کار شما را آسان‌تر کنیم.
                  </p>
               </div>
             </div>
           </div>
           
           {/* Financial Support Section */}
           <div className="mt-6 glass-effect rounded-3xl p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex-grow flex items-center gap-6 text-center sm:text-right">
                    <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl inline-flex animate-pulse">
                        <HeartHandshake className="h-10 w-10 text-white"/>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold font-display text-foreground">حمایت از توسعه «تبدیلا»</h3>
                        <p className="text-muted-foreground mt-2">
                           اگر «تبدیلا» برایتان مفید بوده، با حمایت خود به رشد و پیشرفت آن کمک کنید. هر حمایتی، انرژی ما را برای ساخت ابزارهای بهتر دوچندان می‌کند.
                        </p>
                    </div>
                </div>
                 <Button className="bg-pink-500 hover:bg-pink-600 text-white font-bold h-12 px-8 text-base shrink-0">
                    حمایت می‌کنم
                    <ArrowLeft className="mr-2 h-5 w-5" />
                </Button>
            </div>
           </div>
        </div>
      </main>
      <footer className="text-center p-6 text-muted-foreground text-sm font-body">
        <a 
          href="https://www.nigardip.site/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center justify-center gap-2 hover:text-primary transition-colors"
        >
            <Globe className="w-5 h-5" />
            <span>
              توسعه داده شده توسط <span className="font-semibold text-foreground hover:underline">نگار دی پی</span>
            </span>
        </a>
      </footer>
    </div>
  );
}
