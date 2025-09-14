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
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <UnitConverter />
            </div>
            <CurrencyConverter />
            <DateConverter />
            <QuickCalculator />
            <LivePrices />
          </div>
        </div>
      </main>
    </div>
  );
}
