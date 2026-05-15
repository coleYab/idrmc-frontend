import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/sonner';
import { fontVariables } from '@/components/themes/font.config';
import { DEFAULT_THEME } from '@/components/themes/theme.config';
import { ActiveThemeProvider } from '@/components/themes/active-theme';
import { cn } from '@/lib/utils';
import type { Metadata, Viewport } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import '../styles/globals.css';
const META_THEME_COLORS = {
  light: '#ffffff',
  dark: '#09090b'
};

export const metadata: Metadata = {
  title: 'Next Shadcn',
  description: 'Basic dashboard with Next.js and Shadcn'
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: META_THEME_COLORS.light },
    { media: '(prefers-color-scheme: dark)', color: META_THEME_COLORS.dark }
  ]
};
export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const themeToApply = DEFAULT_THEME;

  return (
    <html
      lang='en'
      suppressHydrationWarning
      data-theme={themeToApply}
      className='dark'
    >
      <head />
      <body
        className={cn(
          'bg-background overflow-x-hidden overscroll-none font-sans antialiased',
          fontVariables
        )}
      >
        <NextTopLoader color='var(--primary)' showSpinner={false} />
        <NuqsAdapter>
          <ActiveThemeProvider initialTheme={themeToApply}>
            <Providers activeThemeValue={themeToApply}>
              <Toaster />
              {children}
            </Providers>
          </ActiveThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
