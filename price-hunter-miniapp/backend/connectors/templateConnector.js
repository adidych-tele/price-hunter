
const axios = require('axios');
const cheerio = require('cheerio');
const pLimit = require('p-limit');
function normalizePrice(txt){ const num=String(txt).replace(/[^\d.,]/g,'').replace(',','.'); const val=parseFloat(num); return Number.isFinite(val)?val:null; }
async function fetchHtml(url){ const res=await axios.get(url,{timeout:10000, headers:{'User-Agent':'Mozilla/5.0 (PriceHunterBot/0.1)'}}); return res.data; }
exports.getOffers = async ({ query, ean }) => {
  const items = [];
  // Example (disabled): const html = await fetchHtml('https://shop.example/search?q='+encodeURIComponent(query||ean||''));
  // const $ = cheerio.load(html);
  // $('.product-card').each((_, el)=>{ ... push normalized items ... });
  return items;
};
