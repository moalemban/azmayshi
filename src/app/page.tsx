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
import { Info, HeartHandshake } from 'lucide-react';

const SectionTitle = ({ title }: { title: string }) => (
  <h2 className="col-span-12 text-2xl font-bold text-primary mb-4 mt-8">{title}</h2>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-screen-2xl">
          <div className="grid grid-cols-12 gap-6">
            
            {/* Section: Main Tools */}
            <SectionTitle title="ابزارهای اصلی" />
            <div className="col-span-12 lg:col-span-8 xl:col-span-6">
              <UnitConverter />
            </div>
            <div className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3">
              <CurrencyConverter />
            </div>
            <div className="col-span-12 sm:col-span-6 lg:col-span-12 xl:col-span-3">
              <DateConverter />
            </div>

            {/* Section: Live Prices */}
            <div className="col-span-12">
              <LivePrices />
            </div>
            
            {/* Section: Financial Tools */}
            <SectionTitle title="ابزارهای مالی" />
            <div className="col-span-12 md:col-span-6">
               <LoanCalculator />
            </div>
             <div className="col-span-12 md:col-span-6">
              <DepositCalculator />
            </div>

            {/* Section: Utility Tools */}
            <SectionTitle title="ابزارهای کاربردی" />
            <div className="col-span-12 sm:col-span-6 md:col-span-4">
               <AgeCalculator />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-4">
              <BmiCalculator />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-4">
              <PercentageCalculator />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-4">
              <NumberToWordsConverter />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-4">
              <NumberSystemConverter />
            </div>
             <div className="col-span-12 sm:col-span-6 md:col-span-4">
              <RandomNumberGenerator />
            </div>
            <div className="col-span-12">
               <PasswordGenerator />
            </div>
            
            {/* Section: Stopwatch */}
             <div className="col-span-12">
              <Stopwatch />
            </div>
            
             {/* Section: QR Code */}
             <div className="col-span-12">
              <QrCodeGenerator />
            </div>

          </div>
          
           {/* About Us Section */}
           <div className="mt-12">
             <Card>
               <CardContent className="p-6">
                 <div className="flex items-center gap-4">
                   <Info className="h-8 w-8 text-primary"/>
                   <div>
                      <h3 className="text-xl font-semibold">درباره ما</h3>
                      <p className="text-muted-foreground mt-2">
                        «تبدیلا» یک دستیار هوشمند و مدرن برای انجام انواع محاسبات و تبدیل‌های روزمره شماست. هدف ما ارائه ابزارهای دقیق، سریع و با رابط کاربری زیبا و ساده است تا نیازهای شما را به بهترین شکل ممکن برطرف کنیم.
                      </p>
                   </div>
                 </div>
               </CardContent>
             </Card>
           </div>
           
           {/* Financial Support Section */}
           <div className="mt-6">
             <Card>
               <CardContent className="p-6">
                 <div className="flex items-center gap-4">
                   <HeartHandshake className="h-8 w-8 text-pink-500"/>
                   <div>
                      <h3 className="text-xl font-semibold">حمایت از توسعه «تبدیلا»</h3>
                      <p className="text-muted-foreground mt-2">
                        اگر این مجموعه ابزار برای شما کاربردی بوده است، می‌توانید با حمایت مالی خود به ما در توسعه، بهبود و افزودن ابزارهای جدید کمک کنید. هر حمایتی، هرچند کوچک، برای ما ارزشمند است.
                      </p>
                   </div>
                 </div>
               </CardContent>
             </Card>
           </div>
        </div>
      </main>
      <footer className="text-center p-6 text-muted-foreground text-sm">
        توسعه داده شده توسط حسین طاهری
      </footer>
    </div>
  );
}
