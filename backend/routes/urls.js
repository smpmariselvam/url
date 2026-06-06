const express = require('express');
const { nanoid } = require('nanoid');
const Url = require('../models/Url');
const router = express.Router();

// Create short URL
router.post('/shorten', async (req, res) => {
  try {
    const { originalUrl, customAlias } = req.body;

    // Validate URL
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(originalUrl)) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    let shortId;

    if (customAlias) {
      // Check if custom alias already exists
      const existing = await Url.findOne({ shortId: customAlias });
      if (existing) return res.status(400).json({ error: 'Custom alias already taken' });
      shortId = customAlias;
    } else {
      shortId = nanoid(6);
    }

    const url = new Url({ 
      originalUrl, 
      shortId,
      shortUrl: `${process.env.BASE_URL}/${shortId}`
    });

    await url.save();
    res.status(201).json(url);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all URLs (for history)
router.get('/all', async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get URL stats
router.get('/stats/:shortId', async (req, res) => {
  try {
    const url = await Url.findOne({ shortId: req.params.shortId });
    if (!url) return res.status(404).json({ error: 'URL not found' });
    res.json(url);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete URL
router.delete('/:shortId', async (req, res) => {
  try {
    const url = await Url.findOneAndDelete({ shortId: req.params.shortId });
    if (!url) return res.status(404).json({ error: 'URL not found' });
    res.json({ message: 'URL deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
