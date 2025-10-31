const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

// Async utilities to read/write data without blocking the event loop
async function readData() {
  const raw = await fs.promises.readFile(DATA_PATH, 'utf8');
  return JSON.parse(raw);
}

async function writeData(items) {
  const json = JSON.stringify(items, null, 2);
  await fs.promises.writeFile(DATA_PATH, json, 'utf8');
}

// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const data = await readData();
    const { limit, q, page, pageSize } = req.query;
    let results = data;

    if (q) {
      const query = String(q).toLowerCase();
      results = results.filter(item => item.name.toLowerCase().includes(query));
    }

    // Pagination: prefer page/pageSize when provided, otherwise fallback to limit
    const hasPaging = typeof page !== 'undefined' || typeof pageSize !== 'undefined';
    const totalCount = results.length;

    // Always set the total count header for pagination support
    if (hasPaging || typeof limit !== 'undefined') {
      res.set('X-Total-Count', String(totalCount));
      res.set('Access-Control-Expose-Headers', 'X-Total-Count');
    }

    if (hasPaging) {
      const pageNum = Math.max(parseInt(page || '1', 10), 1);
      const pageSizeNum = Math.max(parseInt(pageSize || '20', 10), 1);
      const start = (pageNum - 1) * pageSizeNum;
      const end = start + pageSizeNum;
      results = results.slice(start, end);
    } else if (typeof limit !== 'undefined') {
      const limitNum = parseInt(limit, 10);
      if (!Number.isNaN(limitNum) && limitNum >= 0) {
        results = results.slice(0, limitNum);
      }
    }

    res.json(results);
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
  try {
    const data = await readData();
    const id = parseInt(req.params.id, 10);
    const item = data.find(i => i.id === id);
    if (!item) {
      const err = new Error('Item not found');
      err.status = 404;
      throw err;
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post('/', async (req, res, next) => {
  try {
    // Minimal payload validation
    const payload = req.body || {};
    if (!payload.name || typeof payload.name !== 'string') {
      const err = new Error('Invalid payload: "name" is required');
      err.status = 400;
      throw err;
    }

    const data = await readData();
    const item = { ...payload, id: Date.now() };
    data.push(item);
    await writeData(data);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;