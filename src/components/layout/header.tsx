import { ThemeToggle } from './theme-toggle';
import Image from 'next/image';


export default function Header() {
  return (
    <header className="glass-effect rounded-b-3xl p-4 mb-8 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
            <Image 
              src="https://uploadkon.ir/uploads/886e18_252fb04e3a-9e9c-44da-8d7e-7a0345be973aa4-copy.png"
              width={48}
              height={48}
              alt="تبدیلا لوگو"
              className="animate-float"
            />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold gradient-text">تبدیلا</h1>
            <p className="text-muted-foreground text-sm font-body hidden sm:block">دستیار هوشمند شما ✨</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center space-x-2 space-x-reverse bg-background/50 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                <span className="text-muted-foreground text-sm font-body">آنلاین</span>
            </div>
            <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
