const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();

const API_KEY = '73feb218-7d95-459b-a40b-5f726d5c9c01';
const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
const TELEGRAM_BOT_TOKEN = '7614733660:AAFzo6JgoF_pCFek1DIWnRos9Y_S3FYfKeM';  // Thay bằng token của bạn
const TELEGRAM_CHAT_ID = '6486451651';  // Thay bằng chat ID của bạn


app.use(express.static(path.join(__dirname, '../frontend'))); // Để phục vụ file HTML và các tài nguyên tĩnh

// Hàm gửi tin nhắn đến Telegram
const sendTelegramMessage = async (message) => {
    try {
        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        await axios.post(telegramUrl, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
        });
        console.log('Đã gửi thông báo đến Telegram:', message);
    } catch (error) {
        console.error('Lỗi khi gửi tin nhắn Telegram:', error.message);
    }
};

// Kiểm tra biến động giá
const checkPriceChanges = async () => {
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

        const coins = response.data.data;
        coins.forEach((coin) => {
            const change1h = coin.quote.USD.percent_change_1h;
            if (Math.abs(change1h) > 2) {
                const message = `⚠️ ${coin.name} (${coin.symbol}) đã thay đổi ${change1h.toFixed(2)}% trong 1 giờ!`;
                sendTelegramMessage(message);
            }
        });
    } catch (error) {
        console.error('Lỗi khi kiểm tra biến động giá:', error.message);
    }
};

// Gửi thông báo mỗi giờ
setInterval(checkPriceChanges, 60 * 60 * 1000); // 1 giờ

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
