import { Bot } from 'lucide-react';

export default function Header() {
  return (
    <header className="px-4 sm:px-6 lg:px-8 pt-8 pb-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <Bot className="h-8 w-8 text-primary" />
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
          دستیار آرش
        </h1>
      </div>
      <p className="text-muted-foreground mt-1 text-lg">
        دستیار هوشمند شما برای محاسبات و تبدیل واحدها.
      </p>
    </header>
  );
}
