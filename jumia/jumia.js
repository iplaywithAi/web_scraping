'use strict';

import puppeteer from 'puppeteer';

// exportToExcel.js
import * as XLSX from 'xlsx';

// exportToCsv.js
import { Parser } from 'json2csv';
import { writeFileSync } from 'fs';

export async function scrapeJumiaNikeShoes(searchUrl = 'https://www.jumia.co.ke/catalog/?q=shoes'){
  let browser;

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

    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.waitForSelector('article.prd', { timeout: 15000 });

    // Extract product data 
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


///EXCEL
export function exportToExcel(products, filename = 'jumia_nike_shoes.xlsx') {

  try {
    // Convert array of objects into a worksheet
    const worksheet = XLSX.utils.json_to_sheet(products);

     worksheet['!cols'] = [
      { wch: 40 }, // name
      { wch: 12 }, // price
      { wch: 12 }, // oldPrice
      { wch: 10 }, // discount
      { wch: 20 }, // rating
      { wch: 50 }, // url
      { wch: 50 }  // image
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Nike Shoes');

    XLSX.writeFile(workbook, filename);
    console.log(`Saved ${products.length} products to ${filename}`);

  } catch (error) {
    console.error('Error exporting to Excel:', error.message);
  }
}



//CSV

export function exportToCsv(products, filename = 'jumia_nike_shoes.csv') {

  try {
    if (!products || products.length === 0) {
      console.log('No products to export.');
      return;
    }

    const parser = new Parser();
    const csv = parser.parse(products);

    writeFileSync(filename, '\uFEFF' + csv, 'utf8');
    console.log(`Saved ${products.length} products to ${filename}`);

  } catch (error) {
    console.error('Error exporting to CSV:', error.message);
  }
}
