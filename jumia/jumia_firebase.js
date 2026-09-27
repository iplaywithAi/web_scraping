'use strict';

import { db } from '../firebase.js';
import { createHash } from 'crypto';

const BATCH_LIMIT = 500; // Firestore batch write limit

/**
 * Builds a stable, deterministic document ID from a product's URL
 * (or name, as a fallback) so re-scraping the same product updates
 * its existing document instead of creating a duplicate.
 */
function makeProductId(product) {
  const key = product.url || product.name || JSON.stringify(product);
  return createHash('md5').update(key).digest('hex');
}

/**
 * Saves an array of product objects to a Firestore collection.
 * Uses batched writes for efficiency and stable IDs to avoid duplicates.
 * @param {object[]} products
 * @param {string} collectionName
 */
export async function exportToFirebase(products, collectionName = 'jumia_products') {
  if (!products || products.length === 0) {
    console.log('No products to export to Firebase.');
    return;
  }

  try {
    const collectionRef = db.collection(collectionName);
    let savedCount = 0;


    for (let i = 0; i < products.length; i += BATCH_LIMIT) {
      const batch = db.batch();
      const chunk = products.slice(i, i + BATCH_LIMIT);

      chunk.forEach((product) => {
        const docRef = collectionRef.doc(makeProductId(product));
        batch.set(docRef, {
          ...product,
          scrapedAt: new Date().toISOString()
        });
      });

      await batch.commit();
      savedCount += chunk.length;
      console.log(`Saved batch: ${savedCount}/${products.length} products`);
    }

    console.log(` Saved ${savedCount} products to Firestore collection "${collectionName}"`);

  } catch (error) {
    console.error('Error exporting to Firebase:', error.message);
  }
}