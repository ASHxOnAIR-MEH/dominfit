import type { Metadata } from 'next';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/cormorant-garamond/500.css';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://domainfit.in'),
  title: 'Domainfit — Wellbeing. Built around you.',
  description: 'A new era of wellbeing. Discover structured 35-minute movement, personal coaching, nutrition guidance, and space to rest.',
  openGraph: { title: 'Domainfit — Wellbeing. Built around you.', description: 'Science-led, personalised wellbeing. Your next chapter starts here.', images: ['/media/hero.webp'] },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
