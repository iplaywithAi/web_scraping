// scraper.js
import puppeteer from 'puppeteer';

const BLOCKED_RESOURCE_TYPES = new Set(['image', 'stylesheet', 'font', 'media']);
const BLOCKED_URL_PATTERNS = ['analytics', 'doubleclick', 'facebook.net'];

export async function scrapePage(url) {
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();

  await page.setRequestInterception(true);

  page.on('request', (req) => {
    const shouldBlock =
      BLOCKED_RESOURCE_TYPES.has(req.resourceType()) ||
      BLOCKED_URL_PATTERNS.some((pattern) => req.url().includes(pattern));

    shouldBlock ? req.abort() : req.continue();
  });

  await page.goto(url, { waitUntil: 'networkidle2' });
  const content = await page.content();

  await browser.close();
  return content;
}