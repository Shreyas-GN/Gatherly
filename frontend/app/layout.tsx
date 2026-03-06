import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gatherly - Bring the right people together',
  description: 'Community focused event and volunteer management.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[#F9FAFB] text-[#111827] antialiased`}>
        <Sidebar />
        <main className="pl-64 min-h-screen">
          <div className="p-8 max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
