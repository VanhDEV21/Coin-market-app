const axios = require('axios');

const TELEGRAM_BOT_TOKEN = '7614733660:AAFzo6JgoF_pCFek1DIWnRos9Y_S3FYfKeM'; // Thay bằng token của bạn
const TELEGRAM_CHAT_ID = '-4777612257'; // Thay bằng chat ID của nhóm

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

module.exports = { sendTelegramMessage };
