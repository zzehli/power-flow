import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';
import { ChatContextProvider } from '@/contexts/chatContext';
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Point Flow - AI-Powered Presentation Generator',
  description: 'Create professional presentations in seconds with the power of AI',
  icons: {
    icon: '/images/presentation-emoji-1583836-1344298.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ChatContextProvider>
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </ChatContextProvider>
      </body>
    </html>
  );
}