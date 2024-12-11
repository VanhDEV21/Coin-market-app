// const express = require('express');
// const path = require('path');
// const axios = require('axios');
// const app = express();

// const API_KEY = '73feb218-7d95-459b-a40b-5f726d5c9c01';
// const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
// const TELEGRAM_BOT_TOKEN = '7614733660:AAFzo6JgoF_pCFek1DIWnRos9Y_S3FYfKeM';  // Thay bằng token của bạn
// const TELEGRAM_CHAT_ID = '6486451651';  // Thay bằng chat ID của bạn

// let lastPrices = {};  // Lưu trữ giá của các đồng tiền trước đó

// app.use(express.static(path.join(__dirname, 'frontend')));

// app.get('/top-coins', async (req, res) => {
//     try {
//         const response = await axios.get(url, {
//             headers: {
//                 'X-CMC_PRO_API_KEY': API_KEY,
//                 'Accept': 'application/json'
//             },
//             params: {
//                 limit: 10,
//                 sort: 'volume_24h'
//             }
//         });

//         const coins = response.data.data.map(coin => {
//             const currentPrice = coin.quote.USD.price;
//             const change1h = coin.quote.USD.percent_change_1h;
//             const change24h = coin.quote.USD.percent_change_24h;

//             // Kiểm tra thay đổi giá trong 1h và 24h
//             if (lastPrices[coin.symbol] !== undefined) {
//                 if (Math.abs(change1h) > 1 || Math.abs(change24h) > 10) {
//                     sendTelegramMessage(coin, change1h, change24h);
//                 }
//             }

//             // Cập nhật giá trị mới
//             lastPrices[coin.symbol] = currentPrice;

//             return {
//                 name: coin.name,
//                 symbol: coin.symbol,
//                 change_1h: change1h,
//                 change_24h: change24h,
//                 volume_24h: coin.quote.USD.volume_24h
//             };
//         });

//         res.json(coins);
//     } catch (error) {
//         res.status(500).send('Error fetching data');
//     }
// });

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
// });

// // Hàm gửi thông báo đến Telegram
// const sendTelegramMessage = (coin, change1h, change24h) => {
//     let message = `${coin.name} (${coin.symbol})\n`;

//     if (Math.abs(change1h) > 10) {
//         message += `Change 1h: ${change1h.toFixed(2)}%\n`;
//     }
//     if (Math.abs(change24h) > 10) {
//         message += `Change 24h: ${change24h.toFixed(2)}%\n`;
//     }

//     axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
//         chat_id: TELEGRAM_CHAT_ID,
//         text: message
//     }).then(response => {
//         console.log('Message sent to Telegram');
//     }).catch(error => {
//         console.error('Error sending message to Telegram:', error);
//     });
// };

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//     console.log('Server running on port 3000');
// });


const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();
const API_KEY = '73feb218-7d95-459b-a40b-5f726d5c9c01';
const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';

app.use(express.static(path.join(__dirname, '../frontend')));  // Để phục vụ file HTML và các tài nguyên tĩnh

app.get('/top-coins', async (req, res) => {
    try {
        const response = await axios.get(url, {
            headers: {
                'X-CMC_PRO_API_KEY': API_KEY,
                'Accept': 'application/json'
            },
            params: {
                limit: 10,
                sort: 'volume_24h'
            }
        });
        const coins = response.data.data.map(coin => ({
            name: coin.name,
            symbol: coin.symbol,
            change_1h: coin.quote.USD.percent_change_1h,
            change_24h: coin.quote.USD.percent_change_24h,
            volume_24h: coin.quote.USD.volume_24h
        }));
        res.json(coins);
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server running on port 3000');
});
