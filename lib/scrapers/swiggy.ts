import puppeteer from 'puppeteer';
import { GroceryProduct } from '../types';

export async function scrapeSwiggy(searchTerm: string): Promise<GroceryProduct[]> {
    let browser;
    try {
        console.log(`Searching Swiggy Instamart for: ${searchTerm}`);
        const baseUrl = 'https://www.swiggy.com';

        browser = await puppeteer.launch({
            headless: "new" as any,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 1800 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        await page.goto(baseUrl + '/instamart', { waitUntil: 'domcontentloaded', timeout: 60000 });
        
        const searchUrl = `${baseUrl}/instamart/search?query=${encodeURIComponent(searchTerm)}`;
        await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 60000 });

        await new Promise(resolve => setTimeout(resolve, 5000));

        const containerSelector = 'div[data-testid="default_container_ux4"]';
        try {
            await page.waitForSelector(containerSelector, { timeout: 15000 });
            console.log('Swiggy Instamart product containers found.');
        } catch (error) {
            console.log('Could not find Swiggy Instamart product containers.');
            return [];
        }
        
        const products = await page.evaluate((baseUrl, selector) => {
            const results: GroceryProduct[] = [];
            const productElements = document.querySelectorAll(selector);

            productElements.forEach(element => {
                if (results.length >= 10) return;

                try {
                    const titleEl = element.querySelector('.novMV');
                    const priceEl = element.querySelector('[data-testid="item-offer-price"]');
                    const quantityEl = element.querySelector('div[aria-label][class*="entQHA"]');
                    const imageEl = element.querySelector('img.sc-dcJsrY') as HTMLImageElement;
                    
                    const linkEl = element.closest('a');
                    const link = linkEl ? new URL(linkEl.href, baseUrl).href : window.location.href;

                    if (titleEl && priceEl && imageEl) {
                        const title = titleEl.textContent?.trim() ?? 'No title';
                        const price = priceEl.textContent?.trim() ?? 'No price';
                        const quantity = quantityEl ? quantityEl.getAttribute('aria-label') ?? undefined : undefined;
                        const image = imageEl.src;

                        results.push({
                            title,
                            price,
                            quantity,
                            image,
                            link,
                            platform: 'Swiggy'
                        });
                    }
                } catch (e: any) {
                    console.log(`Error parsing Swiggy Instamart product: ${e.message}`);
                }
            });
            return results;
        }, baseUrl, containerSelector);

        console.log(`Successfully extracted ${products.length} Swiggy Instamart products`);
        return products;

    } catch (error: any) {
        console.error(`Swiggy Instamart scraping error: ${error.message}`);
        return [];
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}
