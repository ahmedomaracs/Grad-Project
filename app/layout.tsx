import type { Metadata } from 'next';
import './globals.css';
import { ClientProviders } from '../components/ClientProviders';

export const metadata: Metadata = {
  title: {
    template: '%s | Automate',
    default: 'Automate — Premium Automotive SaaS Platform',
  },
  description: 'Manage your vehicles, book certified mechanics, and shop genuine automotive parts — all in one luxury platform.',
  keywords: ['automotive', 'car service', 'mechanics', 'spare parts', 'vehicle management'],
  authors: [{ name: 'Automate' }],
  creator: 'Automate',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Automate — Premium Automotive SaaS',
    description: 'The all-in-one automotive service platform for discerning drivers.',
    siteName: 'Automate',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Automate — Premium Automotive SaaS',
    description: 'The all-in-one automotive service platform for discerning drivers.',
  },
};

export const viewport = {
  themeColor: '#E62424',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inline script to prevent dark-mode flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){document.documentElement.classList.add('light');document.documentElement.style.colorScheme='light';})();`,
          }}
        />
      </head>
      <body className="antialiased bg-white text-ink font-sans">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}