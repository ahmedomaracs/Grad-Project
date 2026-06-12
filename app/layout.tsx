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
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#FF2D2D',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Inline script to prevent dark-mode flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){document.documentElement.classList.add('light');document.documentElement.style.colorScheme='light';})();`,
          }}
        />
      </head>
      <body className="antialiased min-h-screen bg-[#FAFAFA] text-gray-900">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}