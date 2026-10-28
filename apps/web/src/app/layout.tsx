import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '../components/navbar';
import { Footer } from '../components/footer';

export const metadata: Metadata = {
  title: "L's Auth | Secure Access for Everything You Build",
  description: "Enterprise Single Sign-On and Multi-Tenant Identity Provider by Liji Groups",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#050914] text-slate-100 flex flex-col min-h-screen antialiased selection:bg-blue-600 selection:text-white">
        <Navbar />
        <main className="flex-1 w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
