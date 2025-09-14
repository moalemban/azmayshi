import { Bot, Zap } from 'lucide-react';

export default function Header() {
  return (
    <header className="px-4 sm:px-6 lg:px-8 pt-8 pb-4 max-w-screen-2xl mx-auto text-center">
      <div className="flex items-center justify-center gap-3">
        <Zap className="h-10 w-10 text-primary animate-pulse" />
        <h1 className="text-5xl md:text-6xl font-extrabold font-headline text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500">
          تبدیلا
        </h1>
      </div>
      <p className="text-muted-foreground mt-3 text-lg md:text-xl">
        دستیار هوشمند شما برای انواع محاسبات و تبدیل واحدها
      </p>
    </header>
  );
}
