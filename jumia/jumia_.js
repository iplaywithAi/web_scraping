import { scrapeJumiaNikeShoes } from './jumia.js';

const shoes = await scrapeJumiaNikeShoes();
console.log(shoes);