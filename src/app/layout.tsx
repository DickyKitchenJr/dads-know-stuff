import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const fredericka = localFont({
  src: "../assets/fonts/FrederickatheGreat-Regular.ttf",
  variable: "--font-fredericka",
});

const spectralSC = localFont({
  src: "../assets/fonts/SpectralSC-Regular.ttf",
  variable: "--font-spectral-sc",
});

const manrope = localFont({
  src: "../assets/fonts/Manrope-VariableFont_wght.ttf",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Dads Know Stuff",
  description:
    "Dads Know Stuff is a website dedicated to sharing dad knowledge, jokes, wisdom, and love. Whether you are looking for advice, laughs, or want to send a dad in your life some love and respect, Dads Know Stuff has your covered.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fredericka.variable} ${spectralSC.variable} ${manrope.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
