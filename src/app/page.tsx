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
import { Info, HeartHandshake, Zap, Scale, Wallet, Calculator, ArrowLeft, Heart, Globe, SpellCheck } from 'lucide-react';
import BinaryConverter from '@/components/features/binary-converter';
import { Button } from '@/components/ui/button';

const SectionTitle = ({ title, icon }: { title: string, icon: React.ReactNode }) => (
  <h2 className="col-span-12 text-2xl font-display font-bold text-foreground mb-8 flex items-center gap-3 text-glow">
    <div className="w-10 h-10 bg-gradient-to-br from-primary/80 to-accent/80 rounded-xl flex items-center justify-center animate-pulse">
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
            <SectionTitle title="ابزارهای اصلی تبدیل" icon={<Scale className="w-6 h-6 text-primary-foreground"/>} />
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
            <SectionTitle title="ابزارهای مالی" icon={<Wallet className="w-6 h-6 text-primary-foreground"/>} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <LoanCalculator />
               <DepositCalculator />
            </div>
          </div>

          {/* Section: Text & Number Tools */}
           <div className="glass-effect rounded-3xl p-4 md:p-8 mb-10">
             <SectionTitle title="ابزارهای متنی و عددی" icon={<SpellCheck className="w-6 h-6 text-primary-foreground"/>} />
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               <NumberToWordsConverter />
               <NumberSystemConverter />
               <BinaryConverter />
               <PercentageCalculator />
            </div>
          </div>

          {/* Section: Utility Tools */}
          <div className="glass-effect rounded-3xl p-4 md:p-8 mb-10">
             <SectionTitle title="ابزارهای کاربردی" icon={<Calculator className="w-6 h-6 text-primary-foreground"/>} />
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
               <AgeCalculator />
               <BmiCalculator />
               <RandomNumberGenerator />
               <Stopwatch />
            </div>
          </div>
          
           <div className="glass-effect rounded-3xl p-4 md:p8 mb-10">
             <SectionTitle title="ابزارهای امنیتی و تولیدی" icon={<Zap className="w-6 h-6 text-primary-foreground"/>} />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PasswordGenerator />
                <QrCodeGenerator />
            </div>
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
          href="https://www.hosseintaheri.org/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center justify-center gap-2 hover:text-primary transition-colors"
        >
            <Globe className="w-5 h-5" />
            <span>
              توسعه داده شده توسط <span className="font-semibold text-foreground hover:underline">حسین طاهری</span>
            </span>
        </a>
      </footer>
    </div>
  );
}
