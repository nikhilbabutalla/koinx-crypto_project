const axios = require('axios');
const mongoose = require('mongoose');
const express = require('express');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/cryptoDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB')).catch(err => console.error('Error connecting to MongoDB:', err));

// Define the Cryptocurrency schema and model
const cryptoSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price_usd: { type: Number, required: true },
  market_cap_usd: { type: Number, required: true },
  change_24h: { type: Number, required: true }
});

const Cryptocurrency = mongoose.model('Cryptocurrency', cryptoSchema);

// Function to fetch cryptocurrency data from CoinGecko
async function fetchCryptoData() {
  try {
    const coinIds = ['bitcoin', 'matic-network', 'ethereum'];
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds.join(",")}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`;

    const response = await axios.get(url);
    const data = response.data;

    for (const coin of coinIds) {
      await Cryptocurrency.findOneAndUpdate(
        { name: coin },
        {
          name: coin,
          price_usd: data[coin].usd,
          market_cap_usd: data[coin].usd_market_cap,
          change_24h: data[coin].usd_24h_change
        },
        { upsert: true, new: true }
      );
    }

    console.log('Cryptocurrency data updated successfully.');
  } catch (error) {
    console.error('Error fetching cryptocurrency data:', error);
  }
}

// Background job to run every 2 hours
setInterval(fetchCryptoData, 2 * 60 * 60 * 1000);

// Start fetching data
(async () => {
  try {
    fetchCryptoData();
  } catch (error) {
    console.error('Error initializing the application:', error);
  }
})();

// Express App Setup
const app = express();
const PORT = 3000;

// /stats API to fetch latest data for a cryptocurrency
app.get('/stats', async (req, res) => {
  try {
    const { coin } = req.query;
    if (!coin) {
      return res.status(400).json({ error: 'Query parameter "coin" is required.' });
    }

    const cryptoData = await Cryptocurrency.findOne({ name: coin });
    if (!cryptoData) {
      return res.status(404).json({ error: 'Cryptocurrency not found.' });
    }

    res.json({
      price: cryptoData.price_usd,
      marketCap: cryptoData.market_cap_usd,
      '24hChange': cryptoData.change_24h
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
