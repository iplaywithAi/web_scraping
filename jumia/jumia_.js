import { scrapeJumiaNikeShoes } from './jumia.js';
import { exportToExcel } from './jumia.js';
import { exportToCsv } from './jumia.js';

//print to console
const shoes = await scrapeJumiaNikeShoes();
console.log(shoes);

//excel
if (shoes.length > 0) {
  exportToExcel(shoes);
} else {
  console.log('No products to export.');
}

//csv file
if (shoes.length > 0) {
  exportToCsv(shoes);
} else {
  console.log('No products to export.');
}
