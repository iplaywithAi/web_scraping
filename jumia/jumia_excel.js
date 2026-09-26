'use strict';

import * as XLSX from 'xlsx';

export function exportToExcel(products, filename = 'jumia_nike_shoes.xlsx') {
  try {
    const worksheet = XLSX.utils.json_to_sheet(products);

    worksheet['!cols'] = [
      { wch: 40 }, // name
      { wch: 12 }, // price
      { wch: 12 }, // oldPrice
      { wch: 10 }, // discount
      { wch: 20 }, // rating
      { wch: 12 }, // ratingPercent
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
