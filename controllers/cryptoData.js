const axios=require('axios')
const CryptoData=require('../models/cryptoData')
exports.fetchCryptoData=async(req,res)=>{
   try {
    const coinIds = ['bitcoin', 'matic-network', 'ethereum'];
    const response=await axios.get(`https://api.coingecko.com/api/v3/simple/price?x_cg_demo_api_key=${process.env.COIN_GECKO_API_KEY}`,{
        params: {
            ids: coinIds.join(','),
            vs_currencies: 'usd',
            include_market_cap: true,
            include_24hr_change: true,
        },
    }
    )
    // console.log("response",response)
    const data=response.data
    // console.log("data",data)
    const cryptoData = coinIds.map((id) => ({
        name: id,
        price: data[id].usd,
        marketCap: data[id].usd_market_cap,
        change24h: data[id].usd_24h_change,
    }));

    for (const crypto of cryptoData) {
        await CryptoData.findOneAndUpdate(
            { name: crypto.name },
            { $set: {
                marketCap: crypto.marketCap,
                change24h: crypto.change24h,
                lastUpdated: new Date()
              },
              $push: {
                price: crypto.price,
              } 
            },
            { upsert: true, new: true }
        );
    }
    console.log('Cryptocurrency data fetched and stored successfully');
   } 
   catch (error) {
    console.error('Error fetching cryptocurrency data:', error);
   }
}
exports.sendStats = async (req, res) => {
    try {
        const { coin } = req.body;
        if (!coin) {
            return res.status(400).json({
                success: false,
                message: "Please provide a coin name"
            });
        }
        const data = await CryptoData.findOne({ name: coin.toLowerCase() });
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Coin not found"
            });
        }
        return res.status(200).json({
            success: true,
            price: data.price.at(-1),
            marketCap: data.marketCap,
            change24h: data.change24h,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
exports.sendDeviation=async(req,res)=>{
    try{
    const { coin } = req.body;
        if (!coin) {
            return res.status(400).json({
                success: false,
                message: "Please provide a coin name"
            });
        }
        const data = await CryptoData.findOne({ name: coin.toLowerCase() });
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Coin not found"
            });
        }
        const prices=data.price.slice(-100)
        const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
        const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
        const deviation = Math.sqrt(variance);
        return res.status(200).json({
            success: true,
            deviation: deviation.toFixed(2),
        });
    }
   catch(err){
    return res.status(500).json({
        success: false,
        message: "An error occurred while calculating the deviation.",
        error: err.message,
    });
   }
}