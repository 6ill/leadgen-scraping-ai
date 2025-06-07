import { Injectable, Logger } from "@nestjs/common";
import { type Browser, type Page, chromium } from 'playwright';
import { CompanyDTO, SearchQueryDTO } from "../dtos";
import { getDomain } from "../helper";



@Injectable()
export class ScraperService {
    private readonly logger = new Logger(ScraperService.name);
    
    constructor(
    ) {}

    async scrapeYellowPages({ industry, location }: SearchQueryDTO): Promise<CompanyDTO[]> {
        const browser:Browser = await chromium.launch({ 
            headless: false,
            //  args: [
            //     '--no-sandbox',
            //     '--disable-setuid-sandbox',
            //     '--disable-dev-shm-usage',
            //     '--single-process'
            // ]
        });
        const page:Page = await browser.newPage();
        const companies: CompanyDTO[] = [];

        try {
            const url = `https://www.yellowpages.com/search?search_terms=${encodeURIComponent(industry)}&geo_location_terms=${encodeURIComponent(location)}`;
            await page.goto(url, { waitUntil: 'domcontentloaded' });
            
            await page.waitForSelector('.search-results.organic', { state:'attached', timeout: 12000 });
            
            const companyCards = await page.$$('.v-card');
            
            for (const card of companyCards) {
                try {
                    const websiteUrl = await card.$eval('.links a.track-visit-website', el => el.getAttribute('href'));
                    if (!websiteUrl) continue;
                    const companyName = (await card.$eval('.business-name span', el => el.textContent?.trim())) || 'N/A';
                    const contactPhone = (await card.$eval('.phones', el => el.textContent?.trim())) || 'N/A';
                    const address1 = (await card.$eval('.street-address', el => el.textContent?.trim())) || 'N/A';
                    const address2 = (await card.$eval('.locality', el => el.textContent?.trim())) || 'N/A';
                    const location  = address1 + ' ' + address2
                    
                    const domain = websiteUrl ? getDomain(websiteUrl) : null;
                    
                    companies.push({companyName, contactPhone, location, websiteUrl, domain });
                } catch (error) {
                    console.log('Error parsing card:', error);
                }
            } 
        } catch (error) {
            this.logger.error('Scraping failed or not found');
        } finally {
            await browser.close();
        }   
        
        return companies;
    }
}