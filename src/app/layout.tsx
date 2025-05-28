import type {Metadata} from 'next';
import { Geist } from 'next/font/google'; // Use Geist Sans only for cleaner font import
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({ // Renamed for clarity
  variable: '--font-geist-sans', // Ensure this matches font usage in globals or tailwind config
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Quizify',
  description: 'Generate and take quizzes on any topic!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
