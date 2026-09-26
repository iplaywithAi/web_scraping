'use strict';

 export async function scrapeCurrentPage(page) {
  return page.evaluate(() => {
    const items = document.querySelectorAll('article.prd');
    const results = [];

    items.forEach((item) => {
      const name = item.querySelector('.name');
      const price = item.querySelector('.prc');
      const oldPrice = item.querySelector('.old');
      const rating = item.querySelector('.stars._s');
      const discount = item.querySelector('.bdg._dsct');
      const link = item.querySelector('a.core');
      const img = item.querySelector('img.img');

      let ratingText = null;
      let ratingPercent = null;

      if (rating) {
        ratingText = rating.childNodes[0]?.textContent?.trim() || null;
        const innerEl = rating.querySelector('.in');
        if (innerEl) {
          const styleAttr = innerEl.getAttribute('style');
          const match = styleAttr?.match(/width:\s*(\d+)%/);
          ratingPercent = match ? parseInt(match[1], 10) : null;

        }
      }

      results.push({
        name: name ? name.textContent.trim() : null,
        price: price ? price.textContent.trim() : null,
        oldPrice: oldPrice ? oldPrice.textContent.trim() : null,
        discount: discount ? discount.textContent.trim() : null,
        rating: ratingText,
        ratingPercent: ratingPercent,
        url: link ? 'https://www.jumia.co.ke' + link.getAttribute('href') : null,
        image: img ? (img.getAttribute('data-src') || img.getAttribute('src')) : null
      });
    });

    return results;
  });
}
