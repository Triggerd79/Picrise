import { Lato } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import BottomBar from '@/components/Bottombar';
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
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" className={lato.variable}>
        <body className="antialiased min-h-screen flex flex-col">
          <Navbar />
          <main className="flex flex-row">
            <Sidebar />
            <section className="flex min-h-screen flex-1 flex-col items-center bg-dark-1 px-6 pb-10 pt-28 max-md:pb-32 sm:px-10">
              <div className="w-full max-w-4xl">{children}</div>
            </section>
          </main>
          <BottomBar />
        </body>
      </html>
    </ClerkProvider>
  );
}
