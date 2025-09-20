import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Loader } from 'lucide-react';

export default function Loading() {
  const logo = PlaceHolderImages.find(p => p.id === 'logo');

  return (
    <div className="gradient-bg flex items-center justify-center min-h-screen">
      <div className="text-center p-8 glass-effect rounded-3xl shadow-2xl flex flex-col items-center gap-4">
        {logo && (
          <Image
            src={logo.imageUrl}
            width={80}
            height={80}
            alt="لوگوی تبدیلا"
            className="animate-float"
            data-ai-hint={logo.imageHint}
          />
        )}
        <div className="flex items-center gap-3 text-2xl font-bold text-primary text-glow">
          <Loader className="animate-spin" />
          <span>در حال بارگذاری...</span>
        </div>
        <div className="text-sm text-muted-foreground mt-4 space-y-1">
            <p>نسخه 1.0.0</p>
            <p>توسعه داده شده توسط حسین طاهری</p>
        </div>
      </div>
    </div>
  );
}
