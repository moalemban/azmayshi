import { Zap } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

export default function Header() {
  return (
    <header className="px-4 sm:px-6 lg:px-8 pt-8 pb-4 max-w-screen-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center gap-3">
          <div className="relative">
            <Zap className="h-10 w-10 text-primary" />
            <Zap className="h-10 w-10 text-primary/50 absolute top-0 left-0 animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500 animate-text-gradient bg-300% bg-pos-0% hover:bg-pos-100% transition-all duration-500">
            تبدیلا
          </h1>
        </div>
        <ThemeToggle />
      </div>
      <p className="text-muted-foreground mt-3 text-lg md:text-xl text-center">
        دستیار هوشمند شما برای انواع محاسبات و تبدیل واحدها
      </p>
    </header>
  );
}
