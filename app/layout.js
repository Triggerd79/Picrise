import { Lato } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

// Configure the font
const lato = Lato({
  variable: '--font-lato',
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata = {
  title: 'Picrise - Share Your AI-Generated Images',
  description:
    'Picrise is a social media platform where users can share and explore AI-generated images with creative prompts and captions.',
  keywords: [
    'AI-generated images',
    'social media',
    'image sharing',
    'creative prompts',
    'Picrise',
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={lato.variable}>
      <body className="antialiased min-h-screen flex flex-col">
        <ClerkProvider>
          <Navbar />
          {children}
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  );
}
