import puppeteer from 'puppeteer';
import { SearchResultItem } from '../types';

export async function scrapeZepto(searchTerm: string): Promise<SearchResultItem[]> {
    let browser;
    try {
        console.log(`Zepto: Searching for: ${searchTerm}`);
        const baseUrl = 'https://www.zeptonow.com';

        browser = await puppeteer.launch({
            headless: "new" as any,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 768 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        // Setting location via cookies is more reliable than UI interaction for Zepto.
        // These coordinates are for Delhi.
        const cookies = [{
            name: 'location_v2',
            value: '{"id":"2a52f8a8-b6b3-4672-9cc8-8339f0b83b3e","latitude":28.6139,"longitude":77.2090,"address":"Connaught Place, New Delhi, Delhi, India"}',
            domain: '.zeptonow.com',
            path: '/',
        }];
        await page.setCookie(...cookies);
        console.log('Zepto: Location cookie set.');
        
        const searchUrl = `${baseUrl}/search?q=${encodeURIComponent(searchTerm)}`;
        console.log(`Zepto: Navigating to ${searchUrl}`);
        
        await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 60000 });
        
        await new Promise(resolve => setTimeout(resolve, 5000));

        const containerSelector = '[class*="product-list-wrapper"]';
        try {
            await page.waitForSelector(containerSelector, { timeout: 15000 });
            console.log('Zepto: Product containers found.');
        } catch (error) {
            console.log('Zepto: Could not find product containers. The site structure may have changed.');
            const bodyHTML = await page.evaluate(() => document.body.innerHTML);
            console.log('Zepto Page HTML on failure:', bodyHTML.substring(0, 2000));
            return [];
        }

        const products = await page.evaluate((baseUrl, selector) => {
            const results: SearchResultItem[] = [];
            const productListContainer = document.querySelector(selector);
            if (!productListContainer) {
                console.log('Zepto: Product list container not found.');
                return [];
            }

            const productElements = productListContainer.querySelectorAll('[class*="product-card-wrapper"]');
            console.log(`Zepto: Found ${productElements.length} potential product elements.`);

            productElements.forEach((element, index) => {
                if (results.length >= 10) return;

                try {
                    const titleEl = element.querySelector('[class*="product-name"]');
                    const priceEl = element.querySelector('p[class*="selling-price"]');
                    const quantityEl = element.querySelector('p[class*="product-meta-info"]');
                    const imageEl = element.querySelector('img.product-img') as HTMLImageElement;
                    
                    const link = window.location.href;

                    if (titleEl && priceEl && imageEl) {
                        const title = titleEl.textContent?.trim() ?? 'No title';
                        const price = priceEl.textContent?.trim() ?? 'No price';
                        const quantity = quantityEl ? quantityEl.textContent?.trim() : undefined;
                        const image = imageEl.src;

                        results.push({
                            title,
                            price,
                            quantity,
                            image,
                            link,
                            platform: 'Zepto'
                        });
                    }
                } catch (e: any) {
                    console.log(`Zepto: Error parsing product: ${e.message}`);
                }
            });
            return results;
        }, baseUrl, containerSelector);

        console.log(`Zepto: Successfully extracted ${products.length} products`);
        return products;

    } catch (error: any) {
        console.error(`Zepto scraping error: ${error.message}`);
        return [];
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}
