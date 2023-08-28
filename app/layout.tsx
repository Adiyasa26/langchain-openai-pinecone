import { Inter } from 'next/font/google';

import '@/styles/base.css';
import Layout from '@/components/layout';
import { Metadata } from 'next';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Leren Chatbot',
  description: 'Learn math and histories. #LearnToBeLeren',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
