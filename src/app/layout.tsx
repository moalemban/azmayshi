import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { Vazirmatn } from 'next/font/google';

const vazirmatn = Vazirmatn({ subsets: ['latin', 'arabic'], variable: '--font-vazirmatn' });

export const metadata: Metadata = {
  title: 'تبدیلا | دستیار هوشمند شما',
  description: 'دستیار هوشمند شما برای انواع محاسبات و تبدیل واحدها',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#2a0e5c',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
         <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" />
      </head>
      <body className={vazirmatn.variable}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className="gradient-bg antialiased">
                {children}
                <Toaster />
            </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
