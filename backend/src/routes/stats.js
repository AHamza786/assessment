const express = require('express');
const fs = require('fs');
const path = require('path');
const { mean } = require('../utils/stats');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

// Simple cache invalidated when the data file's mtime changes
let cachedStats = null;
let lastMtimeMs = 0;

// GET /api/stats
router.get('/', async (req, res, next) => {
  try {
    const fileStat = await fs.promises.stat(DATA_PATH);
    const mtime = fileStat.mtimeMs;

    if (!cachedStats || mtime !== lastMtimeMs) {
      const raw = await fs.promises.readFile(DATA_PATH, 'utf8');
      const items = JSON.parse(raw);
      const prices = items.map(i => i.price);
      const avg = prices.length ? mean(prices) : 0;
      cachedStats = {
        total: items.length,
        averagePrice: avg
      };
      lastMtimeMs = mtime;
    }

    res.json(cachedStats);
  } catch (err) {
    next(err);
  }
});

module.exports = router;