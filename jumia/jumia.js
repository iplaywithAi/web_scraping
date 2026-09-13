'use strict';

import puppeteer from 'puppeteer';

export async function scrapeJumiaNikeShoes(searchUrl = 'https://www.jumia.co.ke/catalog/?q=shoes') {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
  
    // Block heavy resources we don't need 
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const blockedTypes = ['image', 'stylesheet', 'font', 'media'];
      blockedTypes.includes(req.resourceType()) ? req.abort() : req.continue();
    });

    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 60000 });

    // Wait for product listings to load
    await page.waitForSelector('article.prd', { timeout: 15000 });

    // Extract product data in the page context
    const products = await page.evaluate(() => {

      const items = document.querySelectorAll('article.prd');
      const results = [];

      items.forEach((item) => {
        const nameEl = item.querySelector('.name');
        const priceEl = item.querySelector('.prc');
        const oldPriceEl = item.querySelector('.old');
        const ratingEl = item.querySelector('.stars._s');
        const discountEl = item.querySelector('.bdg._dsct');
        const linkEl = item.querySelector('a.core');
        const imgEl = item.querySelector('img.img');

        results.push({
          name: nameEl ? nameEl.textContent.trim() : null,
          price: priceEl ? priceEl.textContent.trim() : null,
          oldPrice: oldPriceEl ? oldPriceEl.textContent.trim() : null,
          discount: discountEl ? discountEl.textContent.trim() : null,
          rating: ratingEl ? ratingEl.getAttribute('style') : null,
          url: linkEl ? 'https://www.jumia.co.ke' + linkEl.getAttribute('href') : null,
          image: imgEl ? (imgEl.getAttribute('data-src') || imgEl.getAttribute('src')) : null
        });
        
      });

      return results;
      
    });

    return products;
    
   
  } catch (error) {
    console.error('Error scraping Jumia:', error.message);
    return [];


  } finally {
    if (browser) {
      await browser.close();
    }
  }
}