
import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/900.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Examination Information / 考試資訊',
  description: 'Examination Information and Timer / 考試資訊及計時器',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
  },
};

// Explicit viewport: without it iOS/iPadOS applies its own width and text
// inflation, which is what makes the layout look "shifted" on an iPad.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#0ea5e9',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Custom head tags like theme-color and manifest are now handled by the metadata object */}
      </head>
      <body className="antialiased min-h-[100dvh] flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light" 
          enableSystem={false} 
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
