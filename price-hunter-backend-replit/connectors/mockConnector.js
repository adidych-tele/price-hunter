
const AFF_TAG = process.env.AFF_TAG || '';
function mk(url){ if(!AFF_TAG) return url; return url + (url.includes('?')?'&':'?') + AFF_TAG; }
exports.getOffers = async ({ query, ean }) => {
  const q = (ean || query || '').toLowerCase();
  const isCoffee = q.includes('coffee') || q.includes('коф') || q.includes('café') || q.includes('espresso');
  return [
    { store:'SuperMart', store_logo:'🛒', store_rating:4.6, product_title: isCoffee? 'Кофе зерновой 250 г':'Товар', ean: ean||'0000000000000', price:169.0, delivery_price:49.0, total_price:218.0, in_store_pickup:true, available:true, url: mk('https://example.com/product/coffee-250') },
    { store:'MegaShop', store_logo:'🏬', store_rating:4.4, product_title: isCoffee? 'Кофе 250 г (акция)':'Товар (акция)', ean: ean||'0000000000000', price:159.0, delivery_price:69.0, total_price:228.0, in_store_pickup:false, available:true, url: mk('https://example.com/offer/coffee-250') },
    { store:'Discount24', store_logo:'💸', store_rating:4.0, product_title: isCoffee? 'Кофе 250 г — бюджет':'Товар — бюджет', ean: ean||'0000000000000', price:149.0, delivery_price:99.0, total_price:248.0, in_store_pickup:false, available:true, url: mk('https://example.com/deal/coffee-250') }
  ];
};
