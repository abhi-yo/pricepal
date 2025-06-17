import { NextRequest, NextResponse } from 'next/server';
import { SearchResultItem } from '@/lib/types';

// Product Scrapers
import { scrapeAmazon } from '@/lib/scrapers/amazon';
import { scrapeFlipkart } from '@/lib/scrapers/flipkart';

// Grocery Scrapers
import { scrapeBlinkit } from '@/lib/scrapers/blinkit';
import { scrapeZepto } from '@/lib/scrapers/zepto';
import { scrapeSwiggy } from '@/lib/scrapers/swiggy';

type ScraperFunction = (searchTerm: string) => Promise<SearchResultItem[]>;

const scrapers: Record<string, ScraperFunction[]> = {
  products: [scrapeAmazon, scrapeFlipkart],
  grocery: [scrapeSwiggy, scrapeBlinkit, scrapeZepto],
  // food: [scrapeZomato, scrapeSwiggyRestaurants], // Future category
  // hotels: [scrapeAirbnb, scrapeBooking],         // Future category
};

function normalizePrice(price: string): number {
    if (!price) return Infinity;
    return parseFloat(price.replace(/[₹,]/g, ''));
}

export async function POST(request: NextRequest) {
  try {
    const { searchTerm, category } = await request.json();
    
    if (!searchTerm || !category) {
      return NextResponse.json({ error: 'Search term and category are required' }, { status: 400 });
    }

    const scraperFunctions = scrapers[category];
    if (!scraperFunctions) {
      return NextResponse.json({ error: 'Invalid category specified' }, { status: 400 });
    }
    
    console.log(`API: Starting '${category}' search for "${searchTerm}"`);

    const results = await Promise.allSettled(
      scraperFunctions.map(scraper => scraper(searchTerm))
    );

    let allProducts: SearchResultItem[] = [];
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        allProducts = allProducts.concat(result.value);
      } else {
        console.error('A scraper failed:', result.reason);
      }
    });

    if (allProducts.length === 0) {
      console.log('API: No products found on any platform.');
      return NextResponse.json({ error: 'Could not find the product on any platform.' }, { status: 404 });
    }

    const sortedProducts = allProducts
        .map(product => ({
            ...product,
            normalizedPrice: normalizePrice(product.price)
        }))
        .filter(product => isFinite(product.normalizedPrice))
        .sort((a, b) => a.normalizedPrice - b.normalizedPrice);
    
    const top5Results = sortedProducts.slice(0, 5);
    
    console.log(`API: Found ${allProducts.length} total items. Returning top ${top5Results.length}.`);
    return NextResponse.json(top5Results);

  } catch (error: any) {
    console.error('API Error in /api/search:', error.message);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
} 