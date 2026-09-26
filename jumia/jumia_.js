import { scrapeJumiaNikeShoes , exportToExcel, exportToCsv} from './jumia.js';

//print to console
const data = await scrapeJumiaNikeShoes();
console.log(data);

//excel
if (data.length > 0) {
  exportToExcel(data);
} else {
  console.log('No products to export.');
}

//csv file
if (data.length > 0) {
  exportToCsv(data);
} else {
  console.log('No products to export.');
}