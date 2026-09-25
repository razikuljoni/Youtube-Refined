import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'YouTube Refined - Customizable Distraction-Free Chrome Extension',
  description: 'Production-grade customizable Chrome Extension to eliminate distractions, block Shorts, hide algorithmic feeds, and transform YouTube into a mindful productivity tool.',
  openGraph: {
    title: 'YouTube Refined - Customizable Distraction-Free Chrome Extension',
    description: 'Production-grade customizable Chrome Extension to eliminate distractions, block Shorts, hide algorithmic feeds, and transform YouTube into a mindful productivity tool.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YouTube Refined - Customizable Distraction-Free Chrome Extension',
    description: 'Production-grade customizable Chrome Extension to eliminate distractions, block Shorts, hide algorithmic feeds, and transform YouTube into a mindful productivity tool.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
