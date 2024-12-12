const express = require('express');
const path = require('path');
const axios = require('axios');
const cron = require('node-cron');
const app = express();

const API_KEY = '73feb218-7d95-459b-a40b-5f726d5c9c01';
const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
const TELEGRAM_BOT_TOKEN = '7614733660:AAFzo6JgoF_pCFek1DIWnRos9Y_S3FYfKeM'; // Thay bằng token của bạn
const TELEGRAM_CHAT_ID = '-4777612257'; // Thay bằng chat ID của nhóm

let lastPrices = {}; // Lưu trữ giá của các đồng tiền trước đó

app.use(express.static(path.join(__dirname, '../frontend')));

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

        const coins = response.data.data.map(coin => {
            const currentPrice = coin.quote.USD.price;
            const change1h = coin.quote.USD.percent_change_1h;
            const change24h = coin.quote.USD.percent_change_24h;

            // Cập nhật giá trị mới
            lastPrices[coin.symbol] = currentPrice;

            return {
                name: coin.name,
                price: currentPrice,
                symbol: coin.symbol,
                change_1h: change1h,
                change_24h: change24h,
                volume_24h: coin.quote.USD.volume_24h
            };
        });

        // Gửi thông báo Telegram cho 10 đồng có sự thay đổi lớn nhất trong 1h
        const topChanges = [...coins]
            .sort((a, b) => Math.abs(b.change_1h) - Math.abs(a.change_1h))
            .slice(0, 10);

        sendTelegramMessage(topChanges);

        // Trả về danh sách coins tới frontend
        res.json(coins);
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Hàm gửi thông báo đến Telegram
const sendTelegramMessage = (coins) => {
    const messages = coins.map(coin => {
        return `${coin.name} (${coin.symbol})\nChange 1h: ${coin.change_1h.toFixed(2)}%`;
    }).join('\n\n');

    axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: TELEGRAM_CHAT_ID,
        text: `Top 10 coins with the largest 1h changes:\n\n${messages}`
    }).then(response => {
        console.log('Message sent to Telegram');
    }).catch(error => {
        console.error('Error sending message to Telegram:', error.response?.data || error.message);
    });
};
cron.schedule('0 * * * *', async () => {
    try {
        // Gọi API để lấy thông tin các đồng tiền mới nhất
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

        const coins = response.data.data.map(coin => {
            const currentPrice = coin.quote.USD.price;
            const change1h = coin.quote.USD.percent_change_1h;
            const change24h = coin.quote.USD.percent_change_24h;

            // Cập nhật giá trị mới
            lastPrices[coin.symbol] = currentPrice;

            return {
                name: coin.name,
                price: currentPrice,
                symbol: coin.symbol,
                change_1h: change1h,
                change_24h: change24h,
                volume_24h: coin.quote.USD.volume_24h
            };
        });

        // Gửi thông báo Telegram cho 10 đồng có sự thay đổi lớn nhất trong 1h
        const topChanges = [...coins]
            .sort((a, b) => Math.abs(b.change_1h) - Math.abs(a.change_1h))
            .slice(0, 10);

        sendTelegramMessage(topChanges);

    } catch (error) {
        console.error('Error fetching data for Telegram:', error);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server running on port 3000');
});
