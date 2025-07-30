const express = require('express');
const cors = require('cors');
const { v4: uuid } = require('uuid');
const geoip = require('geoip-lite');
const logger = require('./logger');
const db = require('./db/data');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(logger);

function generateCode() {
  return uuid().slice(0, 6);
}

app.post('/shorturls', (req, res) => {
  const { url, validity = 30, shortcode } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  const code = shortcode || generateCode();
  if (!/^[a-zA-Z0-9]{3,10}$/.test(code)) {
    return res.status(400).json({ error: 'Invalid shortcode format' });
  }

  if (db.urls[code]) {
    return res.status(409).json({ error: 'Shortcode already exists' });
  }

  const now = Date.now();
  const expiry = now + validity * 60 * 1000;

  db.urls[code] = { url, createdAt: now, expiry };
  db.clicks[code] = [];

  res.json({
    shortUrl: `http://localhost:${PORT}/${code}`,
    expiry: new Date(expiry).toISOString(),
  });
});

app.get('/:code', (req, res) => {
  const code = req.params.code;
  const record = db.urls[code];

  if (!record) return res.status(404).send('Short URL not found');
  if (Date.now() > record.expiry) return res.status(410).send('This link has expired');

  const click = {
    timestamp: new Date().toISOString(),
    source: req.get('Referrer') || 'direct',
    location: geoip.lookup(req.ip)?.country || 'unknown',
  };

  db.clicks[code].push(click);
  res.redirect(record.url);
});

app.get('/stats/:code', (req, res) => {
  const code = req.params.code;
  const record = db.urls[code];

  if (!record) return res.status(404).json({ error: 'Shortcode not found' });

  res.json({
    shortUrl: `http://localhost:${PORT}/${code}`,
    originalUrl: record.url,
    createdAt: new Date(record.createdAt).toISOString(),
    expiry: new Date(record.expiry).toISOString(),
    clickCount: db.clicks[code].length,
    clickData: db.clicks[code],
  });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
