import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Calculadora de Cerveja - Compare Preços e Economize',
  description: 
    'Descubra a melhor opção de cerveja comparando preços por volume. Economize dinheiro ao escolher a cerveja mais barata por litro, de forma rápida e prática!',
  keywords: [
    'calculadora de cerveja',
    'preço por litro',
    'comparar preços de cerveja',
    'economizar cerveja',
    'melhor preço de cerveja',
    'calculadora de bebidas',
    'cervejas',
  ],
  authors: [{name: 'Guilherme Zaparoli Gomes', url: "https://www.linkedin.com/in/guilhermezaparoli/"}],
  viewport: 'width=device-width, initial-scale=1.0',
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
