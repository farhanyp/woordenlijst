import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import Navbar from '@/components/Navbar';
import './globals.css';

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-open-sans'
});

export const metadata: Metadata = {
  title: {
    default: 'Woordenlijst',
    template: '%s | Woordenlijst'
  },
  description: 'Nederlandse woordenlijst applicatie voor spellingregels en taaladvies',
  keywords: ['Nederlands', 'spelling', 'woordenlijst', 'taaladvies'],
  authors: [{ name: 'Woordenlijst Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="nl" className={openSans.variable}>
      <body className="font-sans antialiased bg-white text-gray-900">
        <main className="relative">
          {children}
        </main>
      </body>
    </html>
  );
}