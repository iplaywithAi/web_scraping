'use strict';

import { Parser } from 'json2csv';
import { writeFileSync } from 'fs';

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