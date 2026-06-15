import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "../components/Footer";

const fredericka = localFont({
  src: "../assets/fonts/FrederickatheGreat-Regular.ttf",
  variable: "--font-fredericka",
  preload: false,
});

const spectralSC = localFont({
  src: "../assets/fonts/SpectralSC-Regular.ttf",
  variable: "--font-spectral-sc",
  preload: false,
});

const spectralSCBold = localFont({
  src: "../assets/fonts/SpectralSC-Bold.ttf",
  variable: "--font-spectral-sc-bold",
  preload: false,
});

const spectralSCExtraBold = localFont({
  src: "../assets/fonts/SpectralSC-ExtraBold.ttf",
  variable: "--font-spectral-sc-extra-bold",
  preload: false,
});

const manrope = localFont({
  src: "../assets/fonts/Manrope-VariableFont_wght.ttf",
  variable: "--font-manrope",
  preload: false,
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
      className={`${fredericka.variable} ${spectralSC.variable} ${spectralSCBold.variable} ${spectralSCExtraBold.variable} ${manrope.variable}`}
    >
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}
