import { ThemeToggle } from './theme-toggle';

const Logo = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="animate-float"
  >
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--primary))" />
        <stop offset="100%" stopColor="hsl(var(--accent))" />
      </linearGradient>
      <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--primary) / 0.8)" />
        <stop offset="100%" stopColor="hsl(var(--accent) / 0.8)" />
      </linearGradient>
    </defs>
    <g className="group/logo" transform="rotate(0 24 24)">
        <path
            d="M24 6V24C24 33.9411 15.9411 42 6 42"
            stroke="url(#grad1)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-500 ease-in-out group-hover/logo:rotate-[10deg]"
            style={{ transformOrigin: '24px 24px' }}
        />
        <path
            d="M42 6C32.0589 6 24 14.0589 24 24V42"
            stroke="url(#grad2)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-500 ease-in-out group-hover/logo:-rotate-[10deg]"
            style={{ transformOrigin: '24px 24px' }}
        />
    </g>
  </svg>
);


export default function Header() {
  return (
    <header className="glass-effect rounded-b-3xl p-4 mb-8 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
            <Logo />
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
