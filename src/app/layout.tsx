import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { Vazirmatn } from 'next/font/google';
import NetworkStatusDetector from '@/components/layout/network-status-detector';

const vazirmatn = Vazirmatn({ subsets: ['latin', 'arabic'], variable: '--font-vazirmatn' });

export const metadata: Metadata = {
  title: 'تبدیلا | دستیار هوشمند شما',
  description: 'دستیار هوشمند شما برای انواع محاسبات و تبدیل واحدها',
  manifest: '/manifest.json',
  icons: {
    icon: 'https://uploadkon.ir/uploads/cf7220_252fb04e3a-9e9c-44da-8d7e-7a0345be973aa4-copy.png',
  },
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
         <link rel="icon" href="https://uploadkon.ir/uploads/cf7220_252fb04e3a-9e9c-44da-8d7e-7a0345be973aa4-copy.png" type="image/png" />
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
                <NetworkStatusDetector />
            </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
