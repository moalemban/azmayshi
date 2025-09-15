import Header from '@/components/layout/header';
import QuickCalculator from '@/components/features/calculator';
import CurrencyConverter from '@/components/features/currency-converter';
import UnitConverter from '@/components/features/unit-converter';
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

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-screen-2xl">
          <div className="grid grid-cols-12 gap-6">
            {/* Row 1 */}
            <div className="col-span-12 lg:col-span-8 xl:col-span-6">
              <UnitConverter />
            </div>
            <div className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3">
              <CurrencyConverter />
            </div>
            <div className="col-span-12 sm:col-span-6 lg:col-span-12 xl:col-span-3">
              <DateConverter />
            </div>

            {/* Row 2 */}
            <div className="col-span-12 lg:col-span-7">
              <QuickCalculator />
            </div>
             <div className="col-span-12 lg:col-span-5">
              <LivePrices />
            </div>
            
            {/* Row 3 - Financial Tools */}
            <div className="col-span-12 md:col-span-6">
               <LoanCalculator />
            </div>
             <div className="col-span-12 md:col-span-6">
              <DepositCalculator />
            </div>

            {/* Row 4 - Health & Misc Tools */}
            <div className="col-span-12 sm:col-span-6 md:col-span-4">
               <AgeCalculator />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-4">
              <BmiCalculator />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-4">
              <PercentageCalculator />
            </div>

            {/* Row 5 - New Tools */}
             <div className="col-span-12 md:col-span-6">
              <NumberToWordsConverter />
            </div>
             <div className="col-span-12 md:col-span-6">
              <NumberSystemConverter />
            </div>
            
            {/* Row 6 - Stopwatch */}
            <div className="col-span-12 sm:col-span-6 md:col-span-12">
              <Stopwatch />
            </div>

          </div>
        </div>
      </main>
      <footer className="text-center p-6 text-muted-foreground text-sm">
        توسعه داده شده توسط حسین طاهری
      </footer>
    </div>
  );
}
