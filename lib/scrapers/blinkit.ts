import puppeteer from 'puppeteer';
import { SearchResultItem } from '../types';

export async function scrapeBlinkit(searchTerm: string): Promise<SearchResultItem[]> {
    let browser;
    try {
        console.log(`Blinkit: Searching for: ${searchTerm}`);
        const baseUrl = 'https://blinkit.com';
        browser = await puppeteer.launch({ 
            headless: "new" as any,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 768 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        // Directly navigate to a search URL with a pre-set location (e.g., Delhi)
        const searchUrl = `${baseUrl}/s/?q=${encodeURIComponent(searchTerm)}&lat=28.6139&lon=77.2090`;
        console.log(`Blinkit: Navigating to ${searchUrl}`);
        
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

        await new Promise(resolve => setTimeout(resolve, 5000)); 

        const containerSelector = '.ProductList__Grid-sc-1q2y52o-1';
        try {
            await page.waitForSelector(containerSelector, { timeout: 15000 });
            console.log('Blinkit: Product containers found.');
        } catch (error) {
            console.log('Blinkit: Could not find product containers. The site structure may have changed.');
            const bodyHTML = await page.evaluate(() => document.body.innerHTML);
            console.log('Blinkit Page HTML on failure:', bodyHTML.substring(0, 2000));
            return [];
        }

        const products = await page.evaluate((baseUrl, selector) => {
            const results: SearchResultItem[] = [];
            const productContainers = document.querySelector(selector);
            if (!productContainers) {
                console.log('Blinkit: Product container element not found after wait.');
                return [];
            }
            const productElements = productContainers.querySelectorAll('.Product__ListItem-sc-1daaf0c-0');
            console.log(`Blinkit: Found ${productElements.length} potential product elements.`);

            productElements.forEach((element, index) => {
                if (results.length >= 10) return;

                try {
                    const titleEl = element.querySelector('.Product__details__name');
                    const priceEl = element.querySelector('.Product__details__price > span');
                    const quantityEl = element.querySelector('.Product__details__quantity');
                    const imageEl = element.querySelector('img.Product__image') as HTMLImageElement;
                    const linkEl = element.closest('a');
                    
                    if (titleEl && priceEl && quantityEl && imageEl && linkEl) {
                        const title = titleEl.textContent?.trim() ?? 'No title';
                        const price = priceEl.textContent?.trim() ?? 'No price';
                        const quantity = quantityEl.textContent?.trim();
                        const image = imageEl.src;
                        let link = linkEl.href;
                        
                        if (!link.startsWith('http')) {
                            link = new URL(link, baseUrl).href;
                        }

                        results.push({
                            title,
                            price,
                            quantity,
                            image,
                            link,
                            platform: 'Blinkit'
                        });
                    }
                } catch (e: any) {
                    console.log(`Blinkit: Error parsing product: ${e.message}`);
                }
            });
            return results;
        }, baseUrl, containerSelector);

        console.log(`Blinkit: Successfully extracted ${products.length} products`);
        return products;

    } catch (error: any) {
        console.error(`Blinkit scraping error: ${error.message}`);
        return [];
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}
