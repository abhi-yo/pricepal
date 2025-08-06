import puppeteer from 'puppeteer';
import { SearchResultItem } from '../types';

export async function scrapeFlipkart(searchTerm: string): Promise<SearchResultItem[]> {
    let browser;
    try {
        const baseUrl = 'https://www.flipkart.com';
        console.log(`Searching Flipkart for: ${searchTerm}`);
        browser = await puppeteer.launch({ 
            headless: "new" as any,
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox',
                '--disable-blink-features=AutomationControlled',
                '--disable-features=VizDisplayCompositor'
            ]
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 768 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
        });

        const searchUrl = `${baseUrl}/search?q=${encodeURIComponent(searchTerm)}`;
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        
        await new Promise(resolve => setTimeout(resolve, 2000));

        const possibleSelectors = [
            'div[data-id]',      
            '._1AtVbE',          
            '.tUxRFH',           
            '._2kHMtA',          
            '._4ddWXP',          
        ];

        let productElements = null;
        let usedSelector = '';

        for (const selector of possibleSelectors) {
            try {
                await page.waitForSelector(selector, { timeout: 3000 });
                const elements = await page.$$(selector);
                if (elements.length > 0) {
                    productElements = elements;
                    usedSelector = selector;
                    console.log(`Found ${elements.length} Flipkart products using selector: ${selector}`);
                    break;
                }
            } catch (err) {
                console.log(`Flipkart selector ${selector} not found, trying next...`);
            }
        }
        
        if (!productElements || productElements.length === 0) {
            console.log('No Flipkart product elements found with any selector');
            return [];
        }

        const products = await page.evaluate((baseUrl, selector) => {
            const results: SearchResultItem[] = [];
            const productElements = document.querySelectorAll(selector);

            productElements.forEach((element) => {
                if (results.length >= 10) return;
                
                const productData: any = { platform: 'Flipkart' };

                try {
                    const titleSelectors = ['.KzDlHZ', '.s1Q9rs', '._4rR01T', '.IRpwTa'];
                    for(const sel of titleSelectors) {
                        const el = element.querySelector(sel);
                        if (el && el.textContent?.trim()) {
                            productData.title = el.textContent.trim();
                            break;
                        }
                    }

                    const priceSelectors = ['._4b5DiR', '._30jeq3._1_WHN1', '._30jeq3'];
                     for(const sel of priceSelectors) {
                        const el = element.querySelector(sel);
                        if (el && el.textContent?.trim()) {
                            productData.price = el.textContent.trim();
                            break;
                        }
                    }

                    const imageEl = element.querySelector('img.DByuf4, img._396cs4, img._2r_T1I') as HTMLImageElement;
                    if (imageEl && imageEl.src) {
                        productData.image = imageEl.src;
                    }

                    const linkSelectors = ['a.CGtC98', 'a._1fQZEK', 'a.s1Q9rs', 'a._2UzuFa'];
                    for(const sel of linkSelectors) {
                        const el = element.querySelector(sel) as HTMLAnchorElement;
                        if (el && el.href) {
                           productData.link = new URL(el.href, baseUrl).href;
                           break;
                        }
                    }
                    
                    const ratingSelectors = ['.XQDdHH', '._3LWZlK'];
                    for (const sel of ratingSelectors) {
                         const el = element.querySelector(sel);
                        if (el && el.textContent) {
                            productData.rating = el.textContent.trim();
                            break;
                        }
                    }
                   
                    if (productData.title && productData.link && productData.price) {
                        results.push(productData as SearchResultItem);
                    }
                } catch (e: any) {
                    console.log(`Error parsing Flipkart product: ${e.message}`);
                }
            });
            return results;
        }, baseUrl, usedSelector);
        
        console.log(`Successfully extracted ${products.length} Flipkart products`);
        return products;

    } catch (error: any) {
        console.error(`Flipkart scraping error: ${error.message}`);
        return [];
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

