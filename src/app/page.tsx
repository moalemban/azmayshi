import Header from '@/components/layout/header';
import QuickCalculator from '@/components/features/calculator';
import CurrencyConverter from '@/components/features/currency-converter';
import UnitConverter from '@/components/features/unit-converter';
import DateConverter from '@/components/features/date-converter';
import LivePrices from '@/components/features/live-prices';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-screen-2xl">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8 xl:col-span-6">
              <UnitConverter />
            </div>
            <div className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3">
              <CurrencyConverter />
            </div>
            <div className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3">
              <DateConverter />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <LivePrices />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <QuickCalculator />
            </div>
          </div>
        </div>
      </main>
      <footer className="text-center p-6 text-muted-foreground text-sm">
        ساخته شده با ❤️ در استودیو فایربیس
      </footer>
    </div>
  );
}
