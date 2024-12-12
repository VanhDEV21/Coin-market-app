const express = require('express');
const path = require('path');
const cron = require('node-cron');
const { getTopCoins } = require('./api');
const { sendTelegramMessage } = require('./telegram');
const app = express();

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/top-coins', async (req, res) => {
    try {
        const coins = await getTopCoins();

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

// Sử dụng cron để gửi thông báo mỗi giờ
cron.schedule('0 * * * *', async () => {
    try {
        const coins = await getTopCoins();

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
