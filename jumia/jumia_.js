import { scrapeJumiaNikeShoes } from './jumia.js';
import { exportToExcel } from './jumia.js';

const shoes = await scrapeJumiaNikeShoes();
console.log(shoes);

if (shoes.length > 0) {
  exportToExcel(shoes);
} else {
  console.log('No products to export.');
}