import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/Toast';
import { ThemeProvider } from '@/components/ThemeToggle';

export const metadata: Metadata = {
  title: 'Voxora AI | Advanced Neural Text-to-Speech Studio',
  description: 'Generate hyper-realistic AI neural speech in Hindi, English, and 50+ languages with studio-grade pitch, rate, and audio controls.',
  keywords: ['Text to Speech', 'AI Voice Generator', 'Hindi Neural Voices', 'Edge TTS', 'Voxora AI', 'Voice Studio'],
  icons: {
    icon: '/voxora-icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090b0e] text-slate-100 antialiased selection:bg-lime-400 selection:text-black">
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
