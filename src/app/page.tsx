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
import { Card, CardContent } from '@/components/ui/card';
import { Info, HeartHandshake, Zap, BarChart, Scale, Wallet, Calculator, HeartPulse, Gift, Percent, SpellCheck, Binary, KeyRound, Dices, QrCode as QrCodeIcon, TimerIcon } from 'lucide-react';
import BinaryConverter from '@/components/features/binary-converter';

const SectionTitle = ({ title, icon }: { title: string, icon: React.ReactNode }) => (
  <h2 className="col-span-12 text-2xl font-display font-bold text-white mb-8 flex items-center gap-3 text-glow">
    <div className="w-10 h-10 bg-gradient-to-br from-primary/50 to-primary/80 rounded-xl flex items-center justify-center animate-pulse">
        {icon}
    </div>
    {title}
  </h2>
);

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-screen-2xl">
          <div className="glass-effect rounded-3xl p-4 md:p-8 mb-10">
              <LivePrices />
          </div>

          {/* Section: Main Tools */}
          <div className="glass-effect rounded-3xl p-4 md:p-8 mb-10">
            <SectionTitle title="ابزارهای اصلی تبدیل" icon={<Scale className="w-6 h-6 text-white"/>} />
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-6">
                <UnitConverter />
              </div>
              <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                <CurrencyConverter />
              </div>
              <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                <DateConverter />
              </div>
            </div>
          </div>

          {/* Section: Financial Tools */}
          <div className="glass-effect rounded-3xl p-4 md:p-8 mb-10">
            <SectionTitle title="ابزارهای مالی" icon={<Wallet className="w-6 h-6 text-white"/>} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <LoanCalculator />
               <DepositCalculator />
            </div>
          </div>

          {/* Section: Utility Tools */}
          <div className="glass-effect rounded-3xl p-4 md:p-8 mb-10">
             <SectionTitle title="ابزارهای کاربردی" icon={<Calculator className="w-6 h-6 text-white"/>} />
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
               <AgeCalculator />
               <BmiCalculator />
               <PercentageCalculator />
               <NumberToWordsConverter />
               <NumberSystemConverter />
               <RandomNumberGenerator />
               <BinaryConverter />
               <Stopwatch />
            </div>
          </div>
          
           <div className="glass-effect rounded-3xl p-4 md:p-8 mb-10">
             <SectionTitle title="ابزارهای امنیتی و تولیدی" icon={<Zap className="w-6 h-6 text-white"/>} />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PasswordGenerator />
                <QrCodeGenerator />
            </div>
          </div>
          
           {/* About Us Section */}
           <div className="mt-12 glass-effect rounded-3xl p-6 md:p-8">
             <div className="flex items-center gap-4">
               <Info className="h-8 w-8 text-primary"/>
               <div>
                  <h3 className="text-xl font-semibold font-display text-white">درباره ما</h3>
                  <p className="text-white/80 mt-2">
                    «تبدیلا» یک دستیار هوشمند و مدرن برای انجام انواع محاسبات و تبدیل‌های روزمره شماست. هدف ما ارائه ابزارهای دقیق، سریع و با رابط کاربری زیبا و ساده است تا نیازهای شما را به بهترین شکل ممکن برطرف کنیم.
                  </p>
               </div>
             </div>
           </div>
           
           {/* Financial Support Section */}
           <div className="mt-6 glass-effect rounded-3xl p-6 md:p-8">
             <div className="flex items-center gap-4">
               <HeartHandshake className="h-8 w-8 text-pink-400"/>
               <div>
                  <h3 className="text-xl font-semibold font-display text-white">حمایت از توسعه «تبدیلا»</h3>
                  <p className="text-white/80 mt-2">
                    اگر این مجموعه ابزار برای شما کاربردی بوده است، می‌توانید با حمایت مالی خود به ما در توسعه، بهبود و افزودن ابزارهای جدید کمک کنید. هر حمایتی، هرچند کوچک، برای ما ارزشمند است.
                  </p>
               </div>
             </div>
           </div>
        </div>
      </main>
      <footer className="text-center p-6 text-white/60 text-sm font-body">
        توسعه داده شده توسط حسین طاهری
      </footer>
    </div>
  );
}
