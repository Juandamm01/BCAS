import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Toaster } from "react-hot-toast";

const plusJakarta = Plus_Jakarta_Sans({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const sora = Sora({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-sora",
});

export const metadata: Metadata = {
  title: "Bioconstructores Asociados SAS",
  description: "Soluciones Innovadoras Para Un Mundo Conectado. Internet de alta velocidad en Villavicencio.",
  icons: {
    icon: "/images/bcas-logo.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${plusJakarta.variable} ${sora.variable} ${plusJakarta.className} bg-black text-white antialiased`}>
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: '#111',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '1rem',
          }
        }} />
        {children}
      </body>
    </html>
  );
}
