
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { z } = require('zod');

const { getOffers: mockOffers } = require('./connectors/mockConnector');
const { getOffers: templateOffers } = require('./connectors/templateConnector');

const PORT = process.env.PORT || 4000;
const ALLOW_TEMPLATE = process.env.ALLOW_TEMPLATE === '1';

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(morgan('tiny'));
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

const SearchSchema = z.object({
  query: z.string().optional(),
  ean: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  country: z.string().default('UA'),
});

function rankOffers(offers) {
  return offers
    .filter(o => o.available !== false)
    .sort((a, b) => {
      const ta = (a.total_price ?? a.price) ?? Number.POSITIVE_INFINITY;
      const tb = (b.total_price ?? b.price) ?? Number.POSITIVE_INFINITY;
      if (ta !== tb) return ta - tb;
      return (b.store_rating ?? 0) - (a.store_rating ?? 0);
    })
    .slice(0, 5);
}

app.post('/api/search', async (req, res) => {
  const parsed = SearchSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: parsed.error.message });
  }
  const { query, ean, lat, lng, country } = parsed.data;
  try {
    let offers = [];
    const fromMock = await mockOffers({ query, ean, lat, lng, country });
    offers = offers.concat(fromMock);
    if (ALLOW_TEMPLATE) {
      const fromTemplate = await templateOffers({ query, ean, lat, lng, country });
      offers = offers.concat(fromTemplate);
    }
    const ranked = rankOffers(offers);
    res.json({ ok: true, count: ranked.length, items: ranked });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get('/healthz', (req, res) => res.json({ ok: true }));
app.use('/', express.static(path.join(__dirname, 'public'))));
app.listen(PORT, () => console.log(`Backend on http://localhost:${PORT}`));
