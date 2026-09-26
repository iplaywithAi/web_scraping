'use strict';

import puppeteer from 'puppeteer';
import {autoScroll} from './scroll.js';
import  {scrapeCurrentPage} from './jumia_scraper.js';
import  {exportToExcel} from './jumia_excel.js';
import  {exportToCsv} from './jumia_csv.js';


export async function scrapeJumiaNikeShoes(searchUrl = 'https://www.jumia.co.ke/catalog/?q=shoes', maxPages = 5) {
  let browser;
  const allProducts = [];

  try {
    browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Block resources not needed
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const blockedTypes = ['image', 'stylesheet', 'font', 'media'];
      blockedTypes.includes(req.resourceType()) ? req.abort() : req.continue();
    });

    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const pageUrl = pageNum === 1 ? searchUrl : `${searchUrl}&page=${pageNum}`;
      console.log(`Scraping page ${pageNum}: ${pageUrl}`);

      await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 60000 });

      // Check if this page actually has products before waiting/scrolling
      const hasProducts = await page.$('article.prd');
      if (!hasProducts) {
        console.log(`No products found on page ${pageNum} — stopping pagination.`);
        break;
      }

      await page.waitForSelector('article.prd', { timeout: 15000 });

      // Scroll to trigger any lazy-loaded products on this page
      await autoScroll(page);
      await page.waitForSelector('article.prd', { timeout: 15000 });

      const productsOnPage = await scrapeCurrentPage(page);
      console.log(`Found ${productsOnPage.length} products on page ${pageNum}`);

      allProducts.push(...productsOnPage);
      
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    return allProducts;

  } catch (error) {
    console.error('Error scraping Jumia:', error.message);
    return allProducts; 

  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
}

exportToExcel;
exportToCsv;





