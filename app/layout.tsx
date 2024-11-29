import type { Metadata } from 'next';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
  authors: [{name: 'Guilherme Zaparoli Gomes', url: "https://www.linkedin.com/in/guilhermezaparoli/"}]
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`antialiased`}
      >
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
