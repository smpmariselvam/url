const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Error:', err));

app.use('/api/urls', require('./routes/urls'));

// Redirect route - IMPORTANT for short URL functionality
app.get('/:shortId', async (req, res) => {
  try {
    const Url = require('./models/Url');
    const url = await Url.findOne({ shortId: req.params.shortId });

    if (!url) return res.status(404).json({ error: 'URL not found' });

    url.clicks += 1;
    await url.save();

    res.redirect(url.originalUrl);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'URL Shortener API Running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
