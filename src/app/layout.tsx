import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const fireRedFont = localFont({
  src: './fonts/firered-leafgreen-font.ttf',
  weight: '400',
});

export const metadata: Metadata = {
  title: 'Jiggly',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fireRedFont.className}>
      <head>
        <link href="/jigglypuff.ico" rel="icon" sizes="any" />
      </head>
      <body>{children}</body>
    </html>
  );
}
