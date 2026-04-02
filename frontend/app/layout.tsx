import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'Gatherly — Stop emailing spreadsheets to strangers',
  description: 'Gatherly matches volunteers to events by skill, sends the invites, tracks the RSVPs, and tells you when you\'re full. You just show up.',
  openGraph: {
    title: 'Gatherly',
    description: 'Volunteer coordination that actually works.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body
        className="min-h-screen antialiased"
        style={{ fontFamily: 'var(--font-inter), sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}
