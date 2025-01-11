const express = require('express');
const { Dbconnect } = require('./config/dbConnect');
const { fetchCryptoData } = require('./controllers/cryptoData');
const cron = require('node-cron');
const statsRoute=require("./routes/statsRoute")
const deviationRoute=require("./routes/deviationRoute")
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/v1',statsRoute);
app.use('/api/v1',deviationRoute);

app.listen(PORT, () => {
    Dbconnect();
    console.log(`Server running successfully on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Welcome to the Cryptocurrency Tracker API!');
});

cron.schedule('0 */2 * * *', () => {
    console.log('Fetching cryptocurrency data...');
    fetchCryptoData();
});

fetchCryptoData();
