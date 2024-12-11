const express = require('express')
const path = require('path')
const http = require('http')
const axios = require('axios')
const  app = express();
//API key of Coinmarket
const API_KEY = '73feb218-7d95-459b-a40b-5f726d5c9c01';
//endpoint to get list top coin in 24h
const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';

const TELEGRAM_BOT_TOKEN = '8122591153:AAGC4b_SQK2psfJMit8w_JHhdamLkplwRLo';
const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID';

app.use(express.static(path.join(__dirname, 'frontend'))); // Để phục vụ file HTML và các tài nguyên tĩnh
app.get('/top-coins',async(req,res)=>{
    try {
        const response = await axios.get(url,{
            headers:{
                'X-CMC_PRO_API_KEY': API_KEY,
                'Accept': 'application/json'
            },
            params: {
                limit: 10,
                sort: 'volume_24h'
            }
        });
        const coins = response.data.data.map(coin=>({
            name: coin.name,
            symbol: coin.symbol,
            change_1h: coin.quote.USD.percent_change_1h,
            change_24h: coin.quote.USD.percent_change_24h,
            volume_24h: coin.quote.USD.volume_24h
            
        }));
        res.json(coins);
    } catch (error) {
        res.status(500).send('Error fetching data')
    }
})


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});



//server
const port = process.env.PORT || 3000
app.listen(port,()=>{
    console.log('Server running in port 3000')
});

