'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Inter, Instrument_Serif as InstrumentSerif } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const instrumentSerif = InstrumentSerif({
  subsets: ['latin'],
  style: ['italic', 'normal'],
  weight: ['400'],
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-theme-background text-theme-text-primary">
      <div className="container mx-auto px-4 sm:px-6 py-12 max-w-3xl">
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center text-theme-text-secondary hover:text-theme-text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </div>

        <div className="space-y-8">
          <h1 className={`${instrumentSerif.className} text-5xl md:text-6xl text-theme-text-primary`}>
            About Price Pal
          </h1>
          <div className={`${inter.className} space-y-6 text-lg text-theme-text-secondary leading-relaxed`}>
            <p>
              Price Pal is a powerful tool that utilizes advanced scraping technology to compare prices for millions of products across the web's biggest retailers. Our goal is to provide you with the best deal, every time.
            </p>
            <p>
              Input a product you're looking for, and our service will search the leading platforms to find you the most affordable option available, helping you shop smarter and save more effectively.
            </p>
            <p>
              Experience fast and efficient price comparison in a sleek, modern interface designed for savvy shoppers. Price Pal is an independent tool and is not affiliated with Amazon, Flipkart, or any other retailer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 