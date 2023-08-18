import './globals.css';
import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ToasterContext from './context/ToasterContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Welcome to QuipChat',
  description:
    'Developed by Francis Ong - A chat application made on the top of Next 13',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToasterContext />
        {children}
      </body>
    </html>
  );
}
