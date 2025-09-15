import { Zap } from 'lucide-react';

export default function Header() {
  return (
    <header className="glass-effect rounded-b-3xl p-4 mb-8 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center animate-float shadow-2xl backdrop-blur-sm">
            <Zap className="w-8 h-8 text-primary/80 text-glow" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display gradient-text text-glow">تبدیلا</h1>
            <p className="text-white/80 text-sm font-body hidden sm:block">دستیار هوشمند شما ✨</p>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-2 space-x-reverse bg-white/10 rounded-full px-4 py-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-white/80 text-sm font-body">آنلاین</span>
        </div>
      </div>
    </header>
  );
}
