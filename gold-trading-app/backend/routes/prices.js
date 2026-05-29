const router = require('express').Router();

let cachedPrice = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// GET /api/prices/gold
router.get('/gold', async (req, res) => {
  try {
    const now = Date.now();
    if (cachedPrice && (now - cacheTime) < CACHE_TTL) {
      return res.json(cachedPrice);
    }

    try {
      const fetch = require('node-fetch');
      const response = await fetch('https://api.metals.live/v1/spot/gold', {
        timeout: 5000,
        headers: { 'User-Agent': 'GoldTradingApp/1.0' },
      });
      if (response.ok) {
        const data = await response.json();
        const priceData = {
          price: data[0]?.price || 1950,
          source: 'live',
          currency: 'USD',
          unit: 'troy_oz',
          timestamp: new Date().toISOString(),
        };
        cachedPrice = priceData;
        cacheTime = now;
        return res.json(priceData);
      }
    } catch (fetchErr) {
      console.warn('Live price fetch failed, using simulated price');
    }

    // Fallback: simulate realistic price fluctuation
    const BASE_PRICE = 1950;
    const variation = (Math.random() - 0.5) * 20;
    const priceData = {
      price: Number((BASE_PRICE + variation).toFixed(2)),
      source: 'simulated',
      currency: 'USD',
      unit: 'troy_oz',
      timestamp: new Date().toISOString(),
      note: 'Simulated price for development',
    };
    cachedPrice = priceData;
    cacheTime = now;
    res.json(priceData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/prices/history (simulated historical data)
router.get('/history', (req, res) => {
  const months = 12;
  const history = [];
  let price = 1820;
  const now = new Date();

  for (let i = months; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    price += (Math.random() - 0.45) * 60;
    price = Math.max(1600, Math.min(2200, price));
    history.push({
      date: date.toISOString().split('T')[0],
      price: Number(price.toFixed(2)),
      open: Number((price - Math.random() * 20).toFixed(2)),
      high: Number((price + Math.random() * 30).toFixed(2)),
      low: Number((price - Math.random() * 30).toFixed(2)),
    });
  }
  res.json({ history, currency: 'USD', unit: 'troy_oz' });
});

module.exports = router;
