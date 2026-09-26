import { scrapeJumiaNikeShoes } from './jumia_main.js';
import  {exportToExcel} from './jumia_excel.js';
import  {exportToCsv} from './jumia_csv.js';


//print to console
const data = await scrapeJumiaNikeShoes();
console.log(data);

if (data.length > 0) {
  exportToExcel(data);
  exportToCsv(data);
} else {
  console.log('No products to export.');
}

