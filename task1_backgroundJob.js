const axios = require('axios');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/cryptoDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB')).catch(err => console.error('Error connecting to MongoDB:', err));

// Define the Cryptocurrency schema and model
const cryptoSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: false },
  price_usd: { type: Number, required: true },
  market_cap_usd: { type: Number, required: true },
  change_24h: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
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
      await new Cryptocurrency({
        name: coin,
        price_usd: data[coin].usd,
        market_cap_usd: data[coin].usd_market_cap,
        change_24h: data[coin].usd_24h_change
      }).save();
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
